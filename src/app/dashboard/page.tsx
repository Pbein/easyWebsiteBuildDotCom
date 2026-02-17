"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Plus, Globe, Pencil, Trash2, ExternalLink, Loader2, Sparkles, Clock } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function StatusBadge({ status }: { status: string }): React.ReactElement {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    draft: {
      bg: "bg-[#6b6d80]/10",
      text: "text-[#9496a8]",
      label: "Draft",
    },
    published: {
      bg: "bg-[#3ecfb4]/10",
      text: "text-[#3ecfb4]",
      label: "Live",
    },
    suspended: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      label: "Suspended",
    },
  };
  const c = config[status] ?? config.draft;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

function ProjectCard({
  project,
  onDelete,
}: {
  project: {
    _id: Id<"projects">;
    name: string;
    siteType: string;
    tagline?: string;
    publishStatus?: string;
    publishedDomain?: string;
    sessionId?: string;
    createdAt: number;
    updatedAt: number;
  };
  onDelete: (id: Id<"projects">) => void;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-colors hover:border-[var(--color-border-accent)]"
    >
      {/* Thumbnail placeholder */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-primary)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="h-10 w-10 text-[var(--color-text-tertiary)]/30" />
        </div>
        {/* Hover actions overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={
              project.sessionId
                ? `/demo/preview?session=${project.sessionId}`
                : `/dashboard/${project._id}`
            }
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-105"
          >
            <Pencil className="mr-1.5 inline h-3 w-3" />
            Edit
          </Link>
          {project.publishedDomain && (
            <a
              href={`https://${project.publishedDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#3ecfb4] px-4 py-2 text-xs font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-105"
            >
              <ExternalLink className="mr-1.5 inline h-3 w-3" />
              Visit
            </a>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3
            className="truncate text-sm font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.name}
          </h3>
          <StatusBadge status={project.publishStatus ?? "draft"} />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-accent)] capitalize">
            {project.siteType}
          </span>
          {project.publishedDomain && (
            <span className="truncate text-[10px] text-[var(--color-text-tertiary)]">
              {project.publishedDomain}
            </span>
          )}
        </div>

        {project.tagline && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {project.tagline}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-tertiary)]">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(project._id);
            }}
            className="rounded p-1 text-[var(--color-text-tertiary)] opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
            title="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
        <Sparkles className="h-10 w-10 text-[var(--color-accent)]" />
      </div>
      <h2
        className="mb-2 text-xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Create your first website
      </h2>
      <p className="mb-8 max-w-sm text-sm text-[var(--color-text-secondary)]">
        Answer a few questions and our AI will assemble a professional website in under 90 seconds.
      </p>
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-6 py-3 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
      >
        <Plus className="h-4 w-4" />
        Start Building
      </Link>
    </div>
  );
}

function DashboardContent(): React.ReactElement {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const projects = useQuery(api.projects.getUserProjects);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const deleteProject = useMutation(api.projects.deleteProject);

  // Ensure user record exists in Convex
  useEffect(() => {
    if (isSignedIn) {
      getOrCreateUser().catch(() => {
        // User might already exist — that's fine
      });
    }
  }, [isSignedIn, getOrCreateUser]);

  // Redirect to sign-in if not authenticated
  if (isLoaded && !isSignedIn) {
    if (!hasClerk) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Authentication is not configured. Set up Clerk to use the dashboard.
          </p>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Sign in to access your dashboard
        </p>
        <SignInButton mode="modal">
          <button className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-[1.02]">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  if (!isLoaded || projects === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  const handleDelete = async (projectId: Id<"projects">): Promise<void> => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await deleteProject({ projectId });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            My Projects
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {projects.length === 0
              ? "No projects yet"
              : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {projects.length > 0 && (
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-[1.02] hover:shadow-[var(--shadow-glow)]"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        )}
      </div>

      {/* Project grid or empty state */}
      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={(id) => void handleDelete(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const DashboardContentNoSSR = dynamic(() => Promise.resolve({ default: DashboardContent }), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
    </div>
  ),
});

export default function DashboardPage(): React.ReactElement {
  return <DashboardContentNoSSR />;
}

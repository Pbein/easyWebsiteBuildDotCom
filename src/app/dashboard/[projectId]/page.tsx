"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2, ArrowLeft, ExternalLink, Pencil, Globe, Rocket } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

function ProjectDetailContent({ projectId }: { projectId: string }): React.ReactElement {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (isLoaded && !isSignedIn) {
    router.push("/dashboard");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (project === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Project not found or you don&apos;t have access.
        </p>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const statusBg =
    project.publishStatus === "published"
      ? "bg-[#3ecfb4]/10 text-[#3ecfb4]"
      : "bg-[#6b6d80]/10 text-[#9496a8]";

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Project header */}
      <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1
                className="text-2xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {project.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusBg}`}
              >
                {project.publishStatus === "published" ? "Live" : "Draft"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)] capitalize">
                {project.siteType}
              </span>
              {project.publishedDomain && (
                <a
                  href={`https://${project.publishedDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#3ecfb4] hover:underline"
                >
                  <Globe className="h-3 w-3" />
                  {project.publishedDomain}
                </a>
              )}
            </div>

            {project.tagline && (
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{project.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Edit / Preview */}
        {project.sessionId && (
          <Link
            href={`/demo/preview?session=${project.sessionId}`}
            className="group flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-colors hover:border-[var(--color-border-accent)]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
              <Pencil className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Edit & Customize
              </h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                Open in the preview editor with customization sidebar
              </p>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-[var(--color-text-tertiary)] transition-colors group-hover:text-[var(--color-text-primary)]" />
          </Link>
        )}

        {/* Publish */}
        {project.publishStatus !== "published" && (
          <button
            className="group flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 text-left transition-colors hover:border-[#3ecfb4]/30"
            onClick={() => {
              // Will open MakeItYoursModal in Phase 2
              alert("Publishing requires a paid plan. Stripe integration coming soon!");
            }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#3ecfb4]/10">
              <Rocket className="h-5 w-5 text-[#3ecfb4]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Publish with Custom Domain
              </h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                Go live at your own URL — starting at $12/mo
              </p>
            </div>
          </button>
        )}

        {/* Visit live site */}
        {project.publishedDomain && (
          <a
            href={`https://${project.publishedDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-colors hover:border-[#3ecfb4]/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#3ecfb4]/10">
              <Globe className="h-5 w-5 text-[#3ecfb4]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Visit Live Site
              </h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                {project.publishedDomain}
              </p>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-[var(--color-text-tertiary)] transition-colors group-hover:text-[var(--color-text-primary)]" />
          </a>
        )}
      </div>
    </div>
  );
}

const ProjectDetailNoSSR = dynamic(() => Promise.resolve({ default: ProjectDetailContent }), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
    </div>
  ),
});

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): React.ReactElement {
  const { projectId } = use(params);
  return <ProjectDetailNoSSR projectId={projectId} />;
}

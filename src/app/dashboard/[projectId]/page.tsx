"use client";

import { use, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Pencil,
  Globe,
  Rocket,
  CheckCircle2,
  XCircle,
  Crown,
  Search,
} from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { MakeItYoursModal } from "@/components/platform/preview/MakeItYoursModal";
import { DomainSearchModal } from "@/components/platform/preview/DomainSearchModal";
import { useSubscription } from "@/lib/hooks/use-subscription";

function ProjectDetailContent({ projectId }: { projectId: string }): React.ReactElement {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { plan, isActive } = useSubscription();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const paymentParam = searchParams.get("payment");
  const [dismissed, setDismissed] = useState(false);
  const paymentBanner =
    !dismissed && (paymentParam === "success" || paymentParam === "canceled") ? paymentParam : null;
  const publishProject = useMutation(api.projects.publishProject);

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

  const hasPaidPlan = plan === "starter" || plan === "pro";

  const planLabel = plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : "Free";
  const planColor =
    plan === "pro"
      ? "bg-[#e8a849]/10 text-[#e8a849]"
      : plan === "starter"
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

      {/* Payment success/cancel banner */}
      <AnimatePresence>
        {paymentBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
              paymentBanner === "success"
                ? "border-[#3ecfb4]/30 bg-[#3ecfb4]/5"
                : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
            }`}
          >
            {paymentBanner === "success" ? (
              <>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3ecfb4]" />
                <div>
                  <p className="text-sm font-semibold text-[#3ecfb4]">Payment successful!</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Your {planLabel} plan is active. You can now publish with a custom domain.
                  </p>
                </div>
                <button
                  onClick={() => setShowDomainModal(true)}
                  className="ml-auto shrink-0 rounded-lg bg-[#3ecfb4] px-4 py-2 text-xs font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-[1.02]"
                >
                  Choose Domain
                </button>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 shrink-0 text-[var(--color-text-tertiary)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    Payment canceled
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    No charge was made. You can try again anytime.
                  </p>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="ml-auto shrink-0 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  Dismiss
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              {/* Plan tier badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${planColor}`}
              >
                {plan === "pro" && <Crown className="h-3 w-3" />}
                {planLabel} Plan
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

        {/* Publish — different depending on plan */}
        {project.publishStatus !== "published" && (
          <button
            className="group flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 text-left transition-colors hover:border-[#3ecfb4]/30"
            onClick={() => {
              if (hasPaidPlan && isActive) {
                setShowDomainModal(true);
              } else {
                setShowPricingModal(true);
              }
            }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#3ecfb4]/10">
              {hasPaidPlan ? (
                <Search className="h-5 w-5 text-[#3ecfb4]" />
              ) : (
                <Rocket className="h-5 w-5 text-[#3ecfb4]" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                {hasPaidPlan ? "Choose Your Domain" : "Publish with Custom Domain"}
              </h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                {hasPaidPlan
                  ? "Search for a domain and go live"
                  : "Go live at your own URL — starting at $12/mo"}
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

      {/* Pricing / upgrade modal */}
      <MakeItYoursModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        projectId={projectId}
      />

      {/* Domain search modal */}
      <DomainSearchModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        onDomainSelected={async (domain) => {
          await publishProject({
            projectId: projectId as Id<"projects">,
            domain,
          });
          setShowDomainModal(false);
        }}
        projectId={projectId}
      />
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

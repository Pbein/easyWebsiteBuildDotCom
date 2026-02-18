"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RotateCcw, Mail, Check } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { api } from "../../../../convex/_generated/api";
import { useIntakeStore } from "@/lib/stores/intake-store";

/* ────────────────────────────────────────────────────────────
 * Building phases — sequential, never repeating
 * Each phase corresponds to an assembly block appearing
 * ──────────────────────────────────────────────────────────── */

const DEEP_BUILDING_STEPS = [
  { text: "Reading your brand story...", block: "story", delay: 0 },
  { text: "Mapping your personality vector...", block: "personality", delay: 1800 },
  { text: "Choosing your color palette...", block: "nav", delay: 3600 },
  { text: "Setting typography pairings...", block: "hero", delay: 5200 },
  { text: "Selecting hero layout...", block: "features", delay: 6800 },
  { text: "Building content sections...", block: "content", delay: 8400 },
  { text: "Adding social proof...", block: "proof", delay: 10000 },
  { text: "Composing call-to-action...", block: "cta", delay: 11600 },
  { text: "Assembling footer...", block: "footer", delay: 13200 },
  { text: "Applying final polish...", block: "polish", delay: 14800 },
  { text: "Almost there...", block: "done", delay: 16400 },
];

const EXPRESS_BUILDING_STEPS = [
  { text: "Analyzing your business...", block: "analyze", delay: 0 },
  { text: "Selecting components...", block: "components", delay: 800 },
  { text: "Building your site...", block: "build", delay: 1600 },
  { text: "Adding finishing touches...", block: "polish", delay: 2400 },
  { text: "Almost ready...", block: "done", delay: 3200 },
];

/* ────────────────────────────────────────────────────────────
 * Wireframe assembly blocks — the miniature site preview
 * ──────────────────────────────────────────────────────────── */

type WireframeBlockDef = {
  id: string;
  label: string;
  appearsAt: number;
  height: string;
  pattern: "nav" | "hero" | "features" | "text" | "cards" | "cta" | "footer";
};

const DEEP_WIREFRAME_BLOCKS: WireframeBlockDef[] = [
  { id: "nav", label: "Navigation", appearsAt: 2, height: "h-6", pattern: "nav" },
  { id: "hero", label: "Hero", appearsAt: 3, height: "h-16", pattern: "hero" },
  { id: "features", label: "Features", appearsAt: 4, height: "h-12", pattern: "features" },
  { id: "content", label: "Content", appearsAt: 5, height: "h-10", pattern: "text" },
  { id: "proof", label: "Testimonials", appearsAt: 6, height: "h-10", pattern: "cards" },
  { id: "cta", label: "Call to Action", appearsAt: 7, height: "h-8", pattern: "cta" },
  { id: "footer", label: "Footer", appearsAt: 8, height: "h-6", pattern: "footer" },
];

const EXPRESS_WIREFRAME_BLOCKS: WireframeBlockDef[] = [
  { id: "nav", label: "Navigation", appearsAt: 0, height: "h-6", pattern: "nav" },
  { id: "hero", label: "Hero", appearsAt: 1, height: "h-16", pattern: "hero" },
  { id: "content", label: "Content", appearsAt: 2, height: "h-12", pattern: "features" },
  { id: "footer", label: "Footer", appearsAt: 3, height: "h-6", pattern: "footer" },
];

function WireframeBlock({
  block,
  index,
}: {
  block: WireframeBlockDef;
  index: number;
}): React.ReactElement {
  const patterns: Record<string, React.ReactNode> = {
    nav: (
      <div className="flex items-center justify-between px-3">
        <div className="h-2 w-8 rounded-sm bg-white/30" />
        <div className="flex gap-1.5">
          <div className="h-1.5 w-6 rounded-sm bg-white/15" />
          <div className="h-1.5 w-6 rounded-sm bg-white/15" />
          <div className="h-1.5 w-6 rounded-sm bg-white/15" />
        </div>
      </div>
    ),
    hero: (
      <div className="flex flex-col items-center justify-center gap-1.5 px-4">
        <div className="h-2.5 w-24 rounded-sm bg-white/25" />
        <div className="h-1.5 w-32 rounded-sm bg-white/10" />
        <div className="mt-1 h-4 w-14 rounded bg-[var(--color-accent)]/40" />
      </div>
    ),
    features: (
      <div className="flex items-center justify-center gap-2 px-3">
        <div className="h-8 w-1/3 rounded bg-white/8 p-1.5">
          <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-white/20" />
          <div className="mx-auto h-1 w-8 rounded-sm bg-white/10" />
        </div>
        <div className="h-8 w-1/3 rounded bg-white/8 p-1.5">
          <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-white/20" />
          <div className="mx-auto h-1 w-8 rounded-sm bg-white/10" />
        </div>
        <div className="h-8 w-1/3 rounded bg-white/8 p-1.5">
          <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-white/20" />
          <div className="mx-auto h-1 w-8 rounded-sm bg-white/10" />
        </div>
      </div>
    ),
    text: (
      <div className="flex items-center gap-3 px-3">
        <div className="h-7 w-1/3 rounded bg-white/8" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="h-1.5 w-full rounded-sm bg-white/12" />
          <div className="h-1.5 w-4/5 rounded-sm bg-white/8" />
          <div className="h-1.5 w-3/5 rounded-sm bg-white/8" />
        </div>
      </div>
    ),
    cards: (
      <div className="flex items-center justify-center gap-2 px-3">
        <div className="h-7 flex-1 rounded bg-white/8 p-1.5">
          <div className="mb-1 h-1 w-full rounded-sm bg-white/12" />
          <div className="h-1 w-2/3 rounded-sm bg-white/8" />
        </div>
        <div className="h-7 flex-1 rounded bg-white/8 p-1.5">
          <div className="mb-1 h-1 w-full rounded-sm bg-white/12" />
          <div className="h-1 w-2/3 rounded-sm bg-white/8" />
        </div>
      </div>
    ),
    cta: (
      <div className="flex flex-col items-center justify-center gap-1 px-4">
        <div className="h-2 w-20 rounded-sm bg-white/20" />
        <div className="h-3.5 w-12 rounded bg-[var(--color-accent)]/40" />
      </div>
    ),
    footer: (
      <div className="flex items-center justify-between px-3">
        <div className="h-1.5 w-10 rounded-sm bg-white/15" />
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/15" />
        </div>
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={`${block.height} flex w-full flex-col justify-center rounded border border-white/[0.06] bg-white/[0.03]`}
    >
      {patterns[block.pattern]}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Main component
 * ──────────────────────────────────────────────────────────── */

export function Step6Loading(): React.ReactElement {
  const router = useRouter();
  const sessionId = useIntakeStore((s) => s.sessionId);
  const siteType = useIntakeStore((s) => s.siteType);
  const goal = useIntakeStore((s) => s.goal);
  const businessName = useIntakeStore((s) => s.businessName);
  const description = useIntakeStore((s) => s.description);
  const personality = useIntakeStore((s) => s.personality);
  const aiResponses = useIntakeStore((s) => s.aiResponses);
  const emotionalGoals = useIntakeStore((s) => s.emotionalGoals);
  const voiceProfile = useIntakeStore((s) => s.voiceProfile);
  const narrativePrompts = useIntakeStore((s) => s.narrativePrompts);
  const brandArchetype = useIntakeStore((s) => s.brandArchetype);
  const antiReferences = useIntakeStore((s) => s.antiReferences);
  const reset = useIntakeStore((s) => s.reset);
  const isExpress = useIntakeStore((s) => s.expressMode);

  const BUILDING_STEPS = isExpress ? EXPRESS_BUILDING_STEPS : DEEP_BUILDING_STEPS;
  const WIREFRAME_BLOCKS = isExpress ? EXPRESS_WIREFRAME_BLOCKS : DEEP_WIREFRAME_BLOCKS;

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTime = useRef(Date.now());

  const generateSiteSpec = useAction(api.ai.generateSiteSpec.generateSiteSpec);
  const captureLead = useMutation(api.leads.captureLead);

  // Email capture state
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleEmailSubmit = useCallback(async (): Promise<void> => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    try {
      await captureLead({
        email: trimmed,
        sessionId: sessionId || undefined,
        source: "loading_screen",
        siteType: siteType || undefined,
        businessName: businessName || undefined,
      });
      setEmailSubmitted(true);
      posthog.capture("email_captured", {
        source: "loading_screen",
        session_id: sessionId,
      });
    } catch {
      // Silently fail — don't interrupt generation
      setEmailSubmitted(true);
    }
  }, [email, captureLead, sessionId, siteType, businessName]);

  const startGeneration = useCallback(async (): Promise<void> => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    startTime.current = Date.now();

    try {
      await generateSiteSpec({
        sessionId,
        siteType: siteType || "business",
        goal: goal || "contact",
        businessName: businessName || "",
        description: description || "",
        personality,
        aiResponses,
        emotionalGoals: emotionalGoals.length > 0 ? emotionalGoals : undefined,
        voiceProfile: voiceProfile || undefined,
        brandArchetype: brandArchetype || undefined,
        antiReferences: antiReferences.length > 0 ? antiReferences : undefined,
        narrativePrompts: Object.keys(narrativePrompts).length > 0 ? narrativePrompts : undefined,
      });

      if (isExpress) {
        posthog.capture("express_generation_completed", {
          session_id: sessionId,
          site_type: siteType,
          business_name: businessName,
        });
      }
      // Navigate to preview on success
      router.push(`/demo/preview?session=${encodeURIComponent(sessionId)}`);
    } catch (err) {
      posthog.capture("site_spec_generation_failed", {
        session_id: sessionId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong generating your preview. Please try again."
      );
      setIsGenerating(false);
    }
  }, [
    isGenerating,
    generateSiteSpec,
    sessionId,
    siteType,
    goal,
    businessName,
    description,
    personality,
    aiResponses,
    emotionalGoals,
    voiceProfile,
    narrativePrompts,
    brandArchetype,
    antiReferences,
    isExpress,
    router,
  ]);

  // Start generation on mount
  useEffect(() => {
    startGeneration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Time-based progress — tick every 200ms, advance steps based on elapsed time
  useEffect(() => {
    if (error) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime.current;
      setElapsedMs(elapsed);

      // Advance to the next step based on elapsed time
      const nextStep = BUILDING_STEPS.findIndex((s) => s.delay > elapsed);
      const currentStep = nextStep === -1 ? BUILDING_STEPS.length - 1 : Math.max(0, nextStep - 1);
      setActiveStep(currentStep);
    }, 200);

    return () => clearInterval(timer);
  }, [error, BUILDING_STEPS]);

  // Logarithmic progress: fast at start, asymptotically approaches 95%
  // Express: ~4s total (faster curve). Deep: ~16s total.
  const progressDecay = isExpress ? 3000 : 8000;
  const progress = Math.min(95, (1 - Math.exp(-elapsedMs / progressDecay)) * 100);

  // Which wireframe blocks are visible based on current step
  const visibleBlocks = WIREFRAME_BLOCKS.filter((b) => b.appearsAt <= activeStep);

  if (error) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h2
          className="mb-3 text-2xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Generation Failed
        </h2>
        <p className="mb-8 text-sm text-[var(--color-text-secondary)]">{error}</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setError(null);
              setActiveStep(0);
              setElapsedMs(0);
              setIsGenerating(false);
              startGeneration();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-all hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <button
            onClick={() => {
              reset();
              router.push("/demo");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:py-16">
      {/* Two-column layout: wireframe + status */}
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
        {/* Wireframe assembly preview */}
        <div className="w-full max-w-[200px] shrink-0 md:max-w-[180px]">
          <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0e14] p-2 shadow-xl">
            {/* Fake browser chrome */}
            <div className="mb-2 flex items-center gap-1 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-red-400/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-green-400/40" />
              <div className="ml-2 h-2.5 flex-1 rounded-sm bg-white/[0.04]" />
            </div>

            {/* Assembly area */}
            <div className="flex min-h-[160px] flex-col gap-1">
              <AnimatePresence>
                {visibleBlocks.map((block, i) => (
                  <WireframeBlock key={block.id} block={block} index={i} />
                ))}
              </AnimatePresence>

              {/* Placeholder shimmer for blocks not yet placed */}
              {visibleBlocks.length < WIREFRAME_BLOCKS.length && (
                <motion.div
                  className="flex-1 rounded border border-dashed border-white/[0.06]"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>
          </div>

          {/* Block counter */}
          <p className="mt-2 text-center text-[10px] font-medium text-[var(--color-text-tertiary)]">
            {visibleBlocks.length} / {WIREFRAME_BLOCKS.length} sections placed
          </p>
        </div>

        {/* Status text + progress */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:pt-4 md:text-left">
          {/* Heading */}
          <h2
            className="mb-1 text-lg font-bold text-[var(--color-text-primary)] md:text-xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Building your site
          </h2>

          {/* Business name callout */}
          {businessName && (
            <p className="mb-4 text-sm text-[var(--color-text-tertiary)]">
              for <span className="font-medium text-[var(--color-accent)]">{businessName}</span>
            </p>
          )}

          {/* Active phase text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-6 min-h-[1.5rem] text-sm text-[var(--color-text-secondary)]"
            >
              {BUILDING_STEPS[activeStep]?.text}
            </motion.p>
          </AnimatePresence>

          {/* Progress bar — never resets, logarithmic curve */}
          <div className="w-full max-w-xs">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-teal)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "linear" }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[var(--color-text-tertiary)] tabular-nums">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Email capture — appears after 40% progress */}
          <AnimatePresence>
            {progress > 40 && !emailSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="mt-6 w-full max-w-xs"
              >
                <p className="mb-2 text-xs text-[var(--color-text-secondary)]">
                  Get notified when your site is ready to publish
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleEmailSubmit();
                        }
                      }}
                      placeholder="you@email.com"
                      className={`w-full rounded-lg border bg-[var(--color-bg-elevated)] py-2 pr-3 pl-8 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none ${
                        emailError
                          ? "border-red-400/60 focus:border-red-400"
                          : "border-[var(--color-border)] focus:border-[var(--color-accent)]/50"
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => void handleEmailSubmit()}
                    className="shrink-0 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-105"
                  >
                    Notify Me
                  </button>
                </div>
                {emailError && (
                  <p className="mt-1 text-[10px] text-red-400">
                    Please enter a valid email address
                  </p>
                )}
              </motion.div>
            )}
            {emailSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex w-full max-w-xs items-center gap-2 rounded-lg border border-[#3ecfb4]/20 bg-[#3ecfb4]/5 px-3 py-2"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-[#3ecfb4]" />
                <p className="text-xs text-[#3ecfb4]">
                  We&apos;ll let you know when it&apos;s time to go live
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

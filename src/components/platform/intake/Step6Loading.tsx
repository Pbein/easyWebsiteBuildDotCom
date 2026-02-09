"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useIntakeStore } from "@/lib/stores/intake-store";

const LOADING_PHASES = [
  { text: "Analyzing your brand personality...", duration: 2000 },
  { text: "Selecting the perfect components...", duration: 2500 },
  { text: "Generating your theme palette...", duration: 2000 },
  { text: "Composing page layouts...", duration: 2500 },
  { text: "Polishing the final details...", duration: 3000 },
];

export function Step6Loading(): React.ReactElement {
  const router = useRouter();
  const { sessionId, siteType, goal, businessName, description, personality, aiResponses, reset } =
    useIntakeStore();

  const [phase, setPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSiteSpec = useAction(api.ai.generateSiteSpec.generateSiteSpec);

  const startGeneration = useCallback(async (): Promise<void> => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      await generateSiteSpec({
        sessionId,
        siteType: siteType || "business",
        goal: goal || "contact",
        businessName: businessName || "",
        description: description || "",
        personality,
        aiResponses,
      });

      // Navigate to preview on success
      router.push(`/demo/preview?session=${encodeURIComponent(sessionId)}`);
    } catch (err) {
      console.error("Failed to generate site spec:", err);
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
    router,
  ]);

  // Start generation on mount
  useEffect(() => {
    startGeneration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cycle through loading phases
  useEffect(() => {
    if (error) return;

    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % LOADING_PHASES.length);
    }, LOADING_PHASES[phase]?.duration || 2000);

    return () => clearInterval(interval);
  }, [phase, error]);

  const progress = Math.min(((phase + 1) / LOADING_PHASES.length) * 100, 95);

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
              setPhase(0);
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
    <div className="mx-auto max-w-lg py-16 text-center">
      {/* Animated icon */}
      <motion.div
        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] shadow-[var(--shadow-glow)]"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="h-10 w-10 text-[var(--color-bg-primary)]" />
      </motion.div>

      {/* Phase text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-2 text-lg font-medium text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {LOADING_PHASES[phase].text}
        </motion.p>
      </AnimatePresence>

      <p className="mb-8 text-sm text-[var(--color-text-tertiary)]">
        This usually takes a few seconds
      </p>

      {/* Progress bar */}
      <div className="mx-auto max-w-xs">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-teal)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

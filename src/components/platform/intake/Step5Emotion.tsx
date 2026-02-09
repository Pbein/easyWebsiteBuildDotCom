"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Crown,
  Search,
  Leaf,
  Zap,
  Sparkles,
  Lock,
  Smile,
  Award,
  DoorOpen,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIntakeStore } from "@/lib/stores/intake-store";
import { EMOTIONAL_OUTCOMES } from "@/lib/types/brand-character";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Crown,
  Search,
  Leaf,
  Zap,
  Sparkles,
  Lock,
  Smile,
  Award,
  DoorOpen,
};

interface Step5EmotionProps {
  onComplete: () => void;
  onBack: () => void;
}

export function Step5Emotion({ onComplete, onBack }: Step5EmotionProps): React.ReactElement {
  const { emotionalGoals, setEmotionalGoals } = useIntakeStore();

  const toggleEmotion = useCallback(
    (id: string): void => {
      if (emotionalGoals.includes(id)) {
        setEmotionalGoals(emotionalGoals.filter((g) => g !== id));
      } else if (emotionalGoals.length < 2) {
        setEmotionalGoals([...emotionalGoals, id]);
      }
    },
    [emotionalGoals, setEmotionalGoals]
  );

  const canProceed = emotionalGoals.length >= 1;

  return (
    <div className="mx-auto max-w-3xl">
      <h2
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        How should visitors FEEL in the first 5 seconds?
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        Pick 1-2 emotional reactions you want from every visitor. This shapes everything from colors
        to copy.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {EMOTIONAL_OUTCOMES.map((emotion, i) => {
          const isSelected = emotionalGoals.includes(emotion.id);
          const Icon = ICON_MAP[emotion.icon] || Sparkles;

          return (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() => toggleEmotion(emotion.id)}
              disabled={!isSelected && emotionalGoals.length >= 2}
              className={`group relative rounded-xl border p-4 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                  : emotionalGoals.length >= 2
                    ? "cursor-not-allowed border-[var(--color-border)] bg-[var(--color-bg-card)] opacity-40"
                    : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                </div>
              )}
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ background: `color-mix(in srgb, ${emotion.accent} 12%, transparent)` }}
              >
                <Icon className="h-4.5 w-4.5" style={{ color: emotion.accent }} />
              </div>
              <p
                className="mb-0.5 text-sm font-semibold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {emotion.label}
              </p>
              <p className="text-[11px] leading-snug text-[var(--color-text-tertiary)]">
                {emotion.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mx-auto mt-12 flex max-w-2xl justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

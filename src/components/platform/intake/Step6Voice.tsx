"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useIntakeStore } from "@/lib/stores/intake-store";
import { VOICE_COMPARISONS } from "@/lib/types/brand-character";
import type { VoiceTone } from "@/lib/types/brand-character";

interface Step6VoiceProps {
  onComplete: () => void;
  onBack: () => void;
}

const TONE_OPTIONS: VoiceTone[] = ["warm", "polished", "direct"];
const TONE_LABELS = ["A", "B", "C"];

export function Step6Voice({ onComplete, onBack }: Step6VoiceProps): React.ReactElement {
  const { voiceProfile, setVoiceProfile, narrativePrompts, setNarrativePrompt } = useIntakeStore();

  // Track picks per comparison set: index → tone chosen
  const [picks, setPicks] = useState<Record<number, VoiceTone>>({});

  // Auto-calculate dominant voice from picks
  useEffect(() => {
    const values = Object.values(picks);
    if (values.length < 3) return;

    const counts: Record<VoiceTone, number> = { warm: 0, polished: 0, direct: 0 };
    values.forEach((v) => counts[v]++);

    let dominant: VoiceTone = "warm";
    let max = 0;
    for (const tone of TONE_OPTIONS) {
      if (counts[tone] > max) {
        max = counts[tone];
        dominant = tone;
      }
    }
    setVoiceProfile(dominant);
  }, [picks, setVoiceProfile]);

  const handlePick = useCallback((setIndex: number, tone: VoiceTone): void => {
    setPicks((prev) => ({ ...prev, [setIndex]: tone }));
  }, []);

  const canProceed = voiceProfile !== null;

  return (
    <div className="mx-auto max-w-3xl">
      <h2
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        What does your brand sound like?
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        For each scenario, pick the version that sounds most like you.
      </p>

      {/* Voice Comparison Sets */}
      <div className="mb-10 space-y-6">
        {VOICE_COMPARISONS.map((comparison, setIndex) => (
          <motion.div
            key={comparison.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: setIndex * 0.1, duration: 0.3 }}
          >
            <p
              className="mb-3 text-xs font-semibold tracking-wider text-[var(--color-text-tertiary)] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {comparison.context}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {TONE_OPTIONS.map((tone, toneIndex) => {
                const isSelected = picks[setIndex] === tone;
                const text =
                  tone === "warm"
                    ? comparison.warm
                    : tone === "polished"
                      ? comparison.polished
                      : comparison.direct;

                return (
                  <button
                    key={tone}
                    onClick={() => handlePick(setIndex, tone)}
                    className={`relative rounded-xl border p-4 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                      isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                      </div>
                    )}
                    <span
                      className="mb-2 inline-block rounded-md bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-text-tertiary)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {TONE_LABELS[toneIndex]}
                    </span>
                    <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                      &ldquo;{text}&rdquo;
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Voice result badge */}
      {voiceProfile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 flex items-center justify-center gap-2"
        >
          <span className="text-sm text-[var(--color-text-secondary)]">Your voice:</span>
          <span className="rounded-full bg-[var(--color-accent)]/15 px-3 py-1 text-sm font-semibold text-[var(--color-accent)] capitalize">
            {voiceProfile}
          </span>
        </motion.div>
      )}

      {/* Narrative Prompts */}
      <div className="mb-10">
        <h3
          className="mb-2 text-center text-lg font-semibold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tell your story (optional)
        </h3>
        <p className="mb-6 text-center text-sm text-[var(--color-text-tertiary)]">
          These become raw material for your website copy.
        </p>

        <div className="space-y-4">
          {[
            { key: "come_because", prompt: "People usually come to us because ___" },
            { key: "frustrated_with", prompt: "They're usually frustrated with ___" },
            { key: "after_feel", prompt: "After working with us, they feel ___" },
          ].map((item) => (
            <div key={item.key}>
              <label
                htmlFor={`narrative-${item.key}`}
                className="mb-1.5 block text-sm text-[var(--color-text-secondary)]"
              >
                {item.prompt}
              </label>
              <input
                type="text"
                id={`narrative-${item.key}`}
                name={`narrative-${item.key}`}
                value={narrativePrompts[item.key] || ""}
                onChange={(e) => setNarrativePrompt(item.key, e.target.value)}
                placeholder="Type your answer..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] transition-colors duration-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto flex max-w-2xl justify-between">
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

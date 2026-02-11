"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  GraduationCap,
  Palette,
  Heart,
  Flame,
  Gem,
  Check,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIntakeStore } from "@/lib/stores/intake-store";
import {
  BRAND_ARCHETYPES,
  ANTI_REFERENCES,
  INDUSTRY_ANTI_REFERENCES,
} from "@/lib/types/brand-character";

const ARCHETYPE_ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  GraduationCap,
  Palette,
  Heart,
  Flame,
  Gem,
};

interface Step7CultureProps {
  onComplete: () => void;
  onBack: () => void;
}

export function Step7Culture({ onComplete, onBack }: Step7CultureProps): React.ReactElement {
  const { brandArchetype, setBrandArchetype, antiReferences, setAntiReferences, siteType } =
    useIntakeStore();

  // Get industry-specific anti-references for the current site type
  const industryRefs = (siteType ? INDUSTRY_ANTI_REFERENCES[siteType] : null) ?? [];

  const toggleAntiRef = useCallback(
    (id: string): void => {
      if (antiReferences.includes(id)) {
        setAntiReferences(antiReferences.filter((r) => r !== id));
      } else {
        setAntiReferences([...antiReferences, id]);
      }
    },
    [antiReferences, setAntiReferences]
  );

  const canProceed = brandArchetype !== null;

  return (
    <div className="mx-auto max-w-3xl">
      <h2
        className="mb-2 text-center text-2xl font-bold text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        What role does your brand play?
      </h2>
      <p className="mb-8 text-center text-[var(--color-text-secondary)]">
        Pick the character that best fits how you want clients to see you.
      </p>

      {/* Archetype Grid */}
      <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BRAND_ARCHETYPES.map((archetype, i) => {
          const isSelected = brandArchetype === archetype.id;
          const Icon = ARCHETYPE_ICON_MAP[archetype.icon] || Compass;

          return (
            <motion.button
              key={archetype.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => setBrandArchetype(archetype.id)}
              className={`group relative rounded-xl border p-5 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-accent)]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <Check className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
              )}
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `color-mix(in srgb, ${archetype.accent} 12%, transparent)` }}
                >
                  <Icon className="h-5 w-5" style={{ color: archetype.accent }} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {archetype.label}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">
                    {archetype.tagline}
                  </p>
                </div>
              </div>
              <p className="mb-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {archetype.description}
              </p>
              <p className="text-[11px] text-[var(--color-text-tertiary)] italic">
                {archetype.example}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Anti-References */}
      <div className="mb-10">
        <h3
          className="mb-2 text-center text-lg font-semibold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What should your site NEVER feel like?
        </h3>
        <p className="mb-5 text-center text-sm text-[var(--color-text-tertiary)]">
          Select any that apply. These act as constraints — we&apos;ll actively avoid them.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {ANTI_REFERENCES.map((ref) => {
            const isActive = antiReferences.includes(ref.id);

            return (
              <button
                key={ref.id}
                onClick={() => toggleAntiRef(ref.id)}
                className={`group inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                  isActive
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-red-500/30 hover:text-red-400"
                }`}
                title={ref.description}
              >
                {isActive && <X className="h-3 w-3" />}
                {ref.label}
              </button>
            );
          })}
        </div>

        {/* Industry-specific anti-references */}
        {industryRefs.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-center text-xs text-[var(--color-text-tertiary)]">
              For your industry specifically:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {industryRefs.map((ref) => {
                const isActive = antiReferences.includes(ref.id);

                return (
                  <button
                    key={ref.id}
                    onClick={() => toggleAntiRef(ref.id)}
                    className={`group inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                      isActive
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-amber-500/30 hover:text-amber-400"
                    }`}
                    title={ref.description}
                  >
                    {isActive && <X className="h-3 w-3" />}
                    {ref.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
          Continue to Discovery
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Glassmorphism Effect
 *
 * Frosted glass panel with backdrop-blur, semi-transparent background,
 * and subtle border. Pure CSS with graceful degradation.
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";

export const GLASSMORPHISM_MANIFEST: EffectManifest = {
  id: "border-shape/glassmorphism",
  category: "border-shape",
  name: "Glassmorphism",
  description: "Frosted glass panel with backdrop-blur and semi-transparent background",
  performance: "medium",
  requiresJS: false,
  consumedTokens: ["--color-surface", "--color-border-light", "--radius-lg"],
  tags: ["glass", "blur", "frosted", "panel", "card", "modern"],
};

export function glassmorphism(config?: EffectConfig): CSSEffectResult {
  const intensity = config?.intensity ?? 1;

  if (intensity === 0) {
    return {
      style: {
        background: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
      },
    };
  }

  const blurAmount = Math.round(12 * intensity);

  return {
    style: {
      background: `color-mix(in srgb, var(--color-surface) ${50 + intensity * 10}%, transparent)`,
      backdropFilter: `blur(${blurAmount}px)`,
      WebkitBackdropFilter: `blur(${blurAmount}px)`,
      border: "1px solid var(--color-border-light)",
      borderRadius: "var(--radius-lg)",
      boxShadow: `0 4px 30px rgba(0, 0, 0, ${0.05 * intensity})`,
    },
  };
}

/**
 * Gradient Divider Effect
 *
 * A fading gradient line used as a section separator.
 * Renders as a styled <hr>-like element via CSS.
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";

export const GRADIENT_DIVIDER_MANIFEST: EffectManifest = {
  id: "decorative/gradient-divider",
  category: "decorative",
  name: "Gradient Divider",
  description: "Fading gradient line for section separation",
  performance: "low",
  requiresJS: false,
  consumedTokens: ["--color-primary", "--color-accent"],
  tags: ["divider", "separator", "gradient", "decorative", "line"],
};

export function gradientDivider(config?: EffectConfig): CSSEffectResult {
  const primary = config?.colorPrimary ?? "var(--color-primary)";
  const accent = config?.colorAccent ?? "var(--color-accent, var(--color-primary-light))";
  const intensity = config?.intensity ?? 1;

  if (intensity === 0) {
    return {
      style: {
        height: "1px",
        background: "var(--color-border-light)",
      },
    };
  }

  const height = Math.max(1, Math.round(2 * intensity));

  return {
    style: {
      height: `${height}px`,
      background: `linear-gradient(90deg, transparent 0%, ${primary} 30%, ${accent} 70%, transparent 100%)`,
      border: "none",
      borderRadius: "9999px",
    },
  };
}

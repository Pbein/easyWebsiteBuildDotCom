/**
 * Gradient Text Effect
 *
 * Fills text with a gradient using background-clip.
 * Pure CSS — no JavaScript required.
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";

export const GRADIENT_TEXT_MANIFEST: EffectManifest = {
  id: "text/gradient-text",
  category: "text",
  name: "Gradient Text",
  description: "Fill text with a linear gradient using background-clip",
  performance: "low",
  requiresJS: false,
  consumedTokens: ["--color-primary", "--color-accent"],
  tags: ["text", "gradient", "heading", "decorative"],
};

export function gradientText(config?: EffectConfig): CSSEffectResult {
  const primary = config?.colorPrimary ?? "var(--color-primary)";
  const accent = config?.colorAccent ?? "var(--color-accent, var(--color-primary-light))";

  if (config?.reducedMotion || config?.intensity === 0) {
    return { style: { color: primary } };
  }

  return {
    style: {
      background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
  };
}

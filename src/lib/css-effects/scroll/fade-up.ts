/**
 * Fade Up Effect
 *
 * Provides initial + animated styles for a viewport entry animation.
 * Element starts translated down + transparent, fades up to normal position.
 *
 * Usage with framer-motion:
 * ```tsx
 * const effect = fadeUp();
 * <motion.div
 *   initial={effect.style}
 *   whileInView={effect.animatedStyle}
 *   viewport={{ once: true }}
 * />
 * ```
 *
 * Usage with CSS classes (apply initial, add .visible class on intersection):
 * ```css
 * .fade-up { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
 * .fade-up.visible { opacity: 1; transform: translateY(0); }
 * ```
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";
import type { CSSProperties } from "react";

export const FADE_UP_MANIFEST: EffectManifest = {
  id: "scroll/fade-up",
  category: "scroll",
  name: "Fade Up",
  description: "Viewport entry animation — fade in while translating up",
  performance: "low",
  requiresJS: true,
  consumedTokens: ["--transition-base", "--ease-default"],
  tags: ["scroll", "reveal", "fade", "entry", "animation", "viewport"],
};

export interface FadeUpResult extends CSSEffectResult {
  /** Styles for the animated/visible state. */
  animatedStyle: CSSProperties;
}

export function fadeUp(config?: EffectConfig): FadeUpResult {
  const intensity = config?.intensity ?? 1;

  if (config?.reducedMotion || intensity === 0) {
    return {
      style: { opacity: 1 },
      animatedStyle: { opacity: 1 },
    };
  }

  const translateY = Math.round(20 * intensity);
  const duration = intensity >= 2 ? "0.8s" : "0.6s";

  return {
    style: {
      opacity: 0,
      transform: `translateY(${translateY}px)`,
      transition: `opacity ${duration} var(--ease-default, ease-out), transform ${duration} var(--ease-default, ease-out)`,
    },
    animatedStyle: {
      opacity: 1,
      transform: "translateY(0)",
    },
  };
}

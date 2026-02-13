/**
 * Card Lift Effect
 *
 * Provides hover styles for card elevation: translateY + shadow increase.
 * Apply the base style normally, then spread hoverStyle on :hover via state or CSS.
 *
 * Usage with React state:
 * ```tsx
 * const effect = cardLift();
 * const [hovered, setHovered] = useState(false);
 * <div
 *   style={{ ...effect.style, ...(hovered ? effect.hoverStyle : {}) }}
 *   onMouseEnter={() => setHovered(true)}
 *   onMouseLeave={() => setHovered(false)}
 * />
 * ```
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";
import type { CSSProperties } from "react";

export const CARD_LIFT_MANIFEST: EffectManifest = {
  id: "hover/card-lift",
  category: "hover",
  name: "Card Lift",
  description: "Elevate cards on hover with translateY and shadow increase",
  performance: "low",
  requiresJS: false,
  consumedTokens: ["--shadow-md", "--shadow-lg", "--transition-base", "--ease-default"],
  tags: ["hover", "card", "elevation", "shadow", "interactive"],
};

export interface CardLiftResult extends CSSEffectResult {
  /** Styles to apply on hover state. */
  hoverStyle: CSSProperties;
}

export function cardLift(config?: EffectConfig): CardLiftResult {
  const intensity = config?.intensity ?? 1;

  if (config?.reducedMotion || intensity === 0) {
    return {
      style: {},
      hoverStyle: {
        boxShadow: "var(--shadow-lg)",
      },
    };
  }

  const translateY = -4 * intensity;

  return {
    style: {
      transition:
        "transform var(--transition-base) var(--ease-default), box-shadow var(--transition-base) var(--ease-default)",
      willChange: "transform",
    },
    hoverStyle: {
      transform: `translateY(${translateY}px)`,
      boxShadow: "var(--shadow-lg)",
    },
  };
}

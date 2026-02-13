/**
 * Float Effect
 *
 * Gentle floating animation — subtle vertical bobbing.
 * Ideal for decorative elements, icons, and accent shapes.
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";

export const FLOAT_MANIFEST: EffectManifest = {
  id: "motion/float",
  category: "motion",
  name: "Float",
  description: "Gentle vertical bobbing animation for decorative elements",
  performance: "low",
  requiresJS: false,
  consumedTokens: [],
  tags: ["motion", "float", "bob", "decorative", "gentle", "animation"],
};

const KEYFRAME_NAME = "ewb-float";
const KEYFRAMES = `@keyframes ${KEYFRAME_NAME} {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}`;

const KEYFRAME_NAME_EMPHASIZED = "ewb-float-emphasized";
const KEYFRAMES_EMPHASIZED = `@keyframes ${KEYFRAME_NAME_EMPHASIZED} {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}`;

export function float(config?: EffectConfig): CSSEffectResult {
  if (config?.reducedMotion || config?.intensity === 0) {
    return { style: {} };
  }

  const emphasized = (config?.intensity ?? 1) >= 2;
  const name = emphasized ? KEYFRAME_NAME_EMPHASIZED : KEYFRAME_NAME;
  const kf = emphasized ? KEYFRAMES_EMPHASIZED : KEYFRAMES;
  const duration = emphasized ? "4s" : "6s";

  return {
    style: {
      animation: `${name} ${duration} ease-in-out infinite`,
    },
    keyframes: kf,
    keyframeName: name,
  };
}

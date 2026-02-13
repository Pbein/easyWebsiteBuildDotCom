/**
 * Skeleton Shimmer Effect
 *
 * Loading skeleton with sweeping shimmer animation.
 * Uses a moving gradient overlay to indicate content loading.
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";

export const SKELETON_SHIMMER_MANIFEST: EffectManifest = {
  id: "loading/skeleton-shimmer",
  category: "loading",
  name: "Skeleton Shimmer",
  description: "Loading skeleton with animated sweeping shimmer gradient",
  performance: "low",
  requiresJS: false,
  consumedTokens: ["--color-surface", "--color-surface-elevated", "--radius-md"],
  tags: ["loading", "skeleton", "shimmer", "placeholder", "animation"],
};

const KEYFRAME_NAME = "ewb-skeleton-shimmer";
const KEYFRAMES = `@keyframes ${KEYFRAME_NAME} {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;

export function skeletonShimmer(config?: EffectConfig): CSSEffectResult {
  if (config?.reducedMotion || config?.intensity === 0) {
    return {
      style: {
        background: "var(--color-surface-elevated, var(--color-surface))",
        borderRadius: "var(--radius-md)",
      },
    };
  }

  const speed = config?.intensity === 2 ? "1.2s" : "1.8s";

  return {
    style: {
      background: `linear-gradient(
        90deg,
        var(--color-surface) 25%,
        var(--color-surface-elevated, var(--color-surface)) 50%,
        var(--color-surface) 75%
      )`,
      backgroundSize: "200% 100%",
      animation: `${KEYFRAME_NAME} ${speed} ease-in-out infinite`,
      borderRadius: "var(--radius-md)",
    },
    keyframes: KEYFRAMES,
    keyframeName: KEYFRAME_NAME,
  };
}

/**
 * CSS Effects Registry
 *
 * Central registry of all available CSS effects with their manifests
 * and generator functions. Used by the assembly engine to resolve
 * effect IDs to CSS styles.
 */

import type { EffectManifest, EffectGenerator, EffectCategory, EffectPerformance } from "./types";

/* ── Import manifests + generators ──────────────────────────── */
import { GRADIENT_TEXT_MANIFEST, gradientText } from "./text/gradient-text";
import { CARD_LIFT_MANIFEST, cardLift } from "./hover/card-lift";
import { GLASSMORPHISM_MANIFEST, glassmorphism } from "./border-shape/glassmorphism";
import { SKELETON_SHIMMER_MANIFEST, skeletonShimmer } from "./loading/skeleton-shimmer";
import { FLOAT_MANIFEST, float } from "./motion/float";
import { GRADIENT_DIVIDER_MANIFEST, gradientDivider } from "./decorative/gradient-divider";
import { GRAIN_TEXTURE_MANIFEST, grainTexture } from "./background/grain-texture";
import { FADE_UP_MANIFEST, fadeUp } from "./scroll/fade-up";

/** Registry entry — manifest + generator function. */
export interface EffectRegistryEntry {
  manifest: EffectManifest;
  generate: EffectGenerator;
}

/** The main effect registry, keyed by effect ID. */
export const EFFECT_REGISTRY: Record<string, EffectRegistryEntry> = {
  "text/gradient-text": { manifest: GRADIENT_TEXT_MANIFEST, generate: gradientText },
  "hover/card-lift": { manifest: CARD_LIFT_MANIFEST, generate: cardLift },
  "border-shape/glassmorphism": { manifest: GLASSMORPHISM_MANIFEST, generate: glassmorphism },
  "loading/skeleton-shimmer": { manifest: SKELETON_SHIMMER_MANIFEST, generate: skeletonShimmer },
  "motion/float": { manifest: FLOAT_MANIFEST, generate: float },
  "decorative/gradient-divider": { manifest: GRADIENT_DIVIDER_MANIFEST, generate: gradientDivider },
  "background/grain-texture": { manifest: GRAIN_TEXTURE_MANIFEST, generate: grainTexture },
  "scroll/fade-up": { manifest: FADE_UP_MANIFEST, generate: fadeUp },
};

/** Get all effect manifests. */
export function getAllEffectManifests(): EffectManifest[] {
  return Object.values(EFFECT_REGISTRY).map((entry) => entry.manifest);
}

/** Look up an effect by ID. Returns undefined if not found. */
export function getEffect(effectId: string): EffectRegistryEntry | undefined {
  return EFFECT_REGISTRY[effectId];
}

/** Check if an effect ID is registered. */
export function isEffectRegistered(effectId: string): boolean {
  return effectId in EFFECT_REGISTRY;
}

/** Get all effects in a category. */
export function getEffectsByCategory(category: EffectCategory): EffectRegistryEntry[] {
  return Object.values(EFFECT_REGISTRY).filter((entry) => entry.manifest.category === category);
}

/** Get all effects at or below a performance level. */
export function getEffectsByPerformance(maxLevel: EffectPerformance): EffectRegistryEntry[] {
  const levels: Record<EffectPerformance, number> = { low: 1, medium: 2, high: 3 };
  const threshold = levels[maxLevel];
  return Object.values(EFFECT_REGISTRY).filter(
    (entry) => levels[entry.manifest.performance] <= threshold
  );
}

/** Get all effects matching a tag. */
export function getEffectsByTag(tag: string): EffectRegistryEntry[] {
  return Object.values(EFFECT_REGISTRY).filter((entry) => entry.manifest.tags.includes(tag));
}

/** Get all registered effect IDs. */
export function getAllEffectIds(): string[] {
  return Object.keys(EFFECT_REGISTRY);
}

/**
 * CSS Creative Effects System
 *
 * Pure CSS generation functions for text effects, hover animations,
 * glassmorphism, scroll reveals, motion, and decorative treatments.
 *
 * Each effect returns CSSProperties + optional @keyframes.
 * No React components — just CSS generation consumed by components/renderer.
 */

/* ── Types ──────────────────────────────────────────────────── */
export type {
  CSSEffectResult,
  EffectConfig,
  EffectManifest,
  EffectGenerator,
  EffectCategory,
  EffectPerformance,
} from "./types";

/* ── Registry ───────────────────────────────────────────────── */
export {
  EFFECT_REGISTRY,
  getAllEffectManifests,
  getEffect,
  isEffectRegistered,
  getEffectsByCategory,
  getEffectsByPerformance,
  getEffectsByTag,
  getAllEffectIds,
} from "./registry";
export type { EffectRegistryEntry } from "./registry";

/* ── Keyframe Injection ─────────────────────────────────────── */
export { injectKeyframes, isKeyframeInjected, clearInjectedKeyframes } from "./inject-keyframes";

/* ── Reduced Motion Hook ────────────────────────────────────── */
export { useReducedMotion } from "./use-reduced-motion";

/* ── Text Effects ───────────────────────────────────────────── */
export { gradientText, GRADIENT_TEXT_MANIFEST } from "./text";

/* ── Hover Effects ──────────────────────────────────────────── */
export { cardLift, CARD_LIFT_MANIFEST } from "./hover";
export type { CardLiftResult } from "./hover";

/* ── Border & Shape Effects ─────────────────────────────────── */
export { glassmorphism, GLASSMORPHISM_MANIFEST } from "./border-shape";

/* ── Loading Effects ────────────────────────────────────────── */
export { skeletonShimmer, SKELETON_SHIMMER_MANIFEST } from "./loading";

/* ── Motion Effects ─────────────────────────────────────────── */
export { float, FLOAT_MANIFEST } from "./motion";

/* ── Decorative Effects ─────────────────────────────────────── */
export { gradientDivider, GRADIENT_DIVIDER_MANIFEST } from "./decorative";

/* ── Background Effects ─────────────────────────────────────── */
export { grainTexture, getGrainTextureBackground, GRAIN_TEXTURE_MANIFEST } from "./background";

/* ── Scroll Effects ─────────────────────────────────────────── */
export { fadeUp, FADE_UP_MANIFEST } from "./scroll";
export type { FadeUpResult } from "./scroll";

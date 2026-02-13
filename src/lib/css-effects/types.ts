/**
 * CSS Creative Effects System — Type Definitions
 *
 * Each effect is a pure function that returns CSSProperties + optional keyframes.
 * No React components — just CSS generation functions consumed by components/renderer.
 */

import type { CSSProperties } from "react";

/** Result returned by every effect generator function. */
export interface CSSEffectResult {
  /** Inline styles to apply to the element. */
  style: CSSProperties;
  /** Optional className to add (for pseudo-element effects). */
  className?: string;
  /** Raw @keyframes CSS to inject into a <style> tag. */
  keyframes?: string;
  /** Unique keyframe name for deduplication. */
  keyframeName?: string;
}

/** Configuration passed to every effect generator. */
export interface EffectConfig {
  /** Primary theme color (default: "var(--color-primary)"). */
  colorPrimary?: string;
  /** Secondary theme color (default: "var(--color-secondary, var(--color-primary-dark))"). */
  colorSecondary?: string;
  /** Accent color (default: "var(--color-accent, var(--color-primary-light))"). */
  colorAccent?: string;
  /** Whether the user prefers reduced motion (disables animations). */
  reducedMotion?: boolean;
  /** Intensity multiplier: 0 = disabled, 1 = normal, 2 = emphasized. */
  intensity?: number;
}

/** Performance impact classification. */
export type EffectPerformance = "low" | "medium" | "high";

/** Effect categories for the registry. */
export type EffectCategory =
  | "text"
  | "background"
  | "hover"
  | "scroll"
  | "border-shape"
  | "loading"
  | "motion"
  | "color-filter"
  | "micro-interaction"
  | "decorative"
  | "3d"
  | "layout";

/** Manifest describing an effect for the registry. */
export interface EffectManifest {
  /** Unique effect ID (e.g., "text/gradient-text"). */
  id: string;
  /** Effect category. */
  category: EffectCategory;
  /** Human-readable name. */
  name: string;
  /** Brief description of the visual effect. */
  description: string;
  /** Performance impact (GPU compositing, paint cost). */
  performance: EffectPerformance;
  /** Whether this effect requires JavaScript (e.g., IntersectionObserver). */
  requiresJS: boolean;
  /** CSS custom properties consumed by this effect. */
  consumedTokens: string[];
  /** Searchable tags for filtering. */
  tags: string[];
}

/** An effect generator function signature. */
export type EffectGenerator = (config?: EffectConfig) => CSSEffectResult;

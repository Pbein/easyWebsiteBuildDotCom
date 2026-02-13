/**
 * Visual configuration for a component placement.
 * Controls CSS patterns, dividers, and scroll effects.
 */
export interface VisualConfig {
  /** CSS background pattern (from css-patterns.ts). */
  pattern?: string;
  /** Section divider at the bottom edge. */
  dividerBottom?: "wave" | "angle" | "curve" | "zigzag" | "none";
  /** Whether to apply parallax scroll effect. */
  parallaxEnabled?: boolean;
  /** Scroll reveal intensity. */
  scrollRevealIntensity?: "none" | "subtle" | "moderate" | "dramatic";
  /** CSS effect IDs to apply (from css-effects registry). */
  effects?: string[];
}

/**
 * A placement of a single component within a page.
 */
export interface ComponentPlacement {
  componentId: string;
  variant: string;
  order: number;
  content: Record<string, unknown>;
  /** Visual configuration for CSS patterns, dividers, and effects. */
  visualConfig?: VisualConfig;
}

/**
 * A single page specification.
 */
export interface PageSpec {
  slug: string;
  title: string;
  purpose: string;
  components: ComponentPlacement[];
}

/**
 * The full Site Intent Document — output of the AI assembly step.
 * Describes everything needed to render a complete website preview.
 */
export interface SiteIntentDocument {
  sessionId: string;
  siteType: string;
  conversionGoal: string;
  personalityVector: number[];
  businessName: string;
  tagline: string;
  pages: PageSpec[];
  metadata: {
    generatedAt: number;
    method: "ai" | "deterministic";
  };
  /** Brand character data (optional for backward compatibility) */
  emotionalGoals?: string[];
  voiceProfile?: string;
  brandArchetype?: string;
  antiReferences?: string[];
  narrativePrompts?: Record<string, string>;
}

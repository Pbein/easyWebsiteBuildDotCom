/**
 * A placement of a single component within a page.
 */
export interface ComponentPlacement {
  componentId: string;
  variant: string;
  order: number;
  content: Record<string, unknown>;
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

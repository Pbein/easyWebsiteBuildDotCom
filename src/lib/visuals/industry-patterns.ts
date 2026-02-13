/**
 * Maps business types/sub-types to appropriate CSS patterns.
 *
 * Each mapping provides a primary and secondary pattern suggestion.
 * The deterministic fallback uses these; the AI path may override.
 */

export interface IndustryPatternMapping {
  /** Primary pattern for hero/full sections. */
  primaryPattern: string;
  /** Secondary pattern for alternating sections (or "none"). */
  secondaryPattern: string;
  /** Suggested opacity for the pattern overlay. */
  opacity: number;
}

/**
 * Default pattern mappings per business sub-type.
 * These represent sensible defaults — the AI path evaluates each decision in context.
 */
export const INDUSTRY_PATTERNS: Record<string, IndustryPatternMapping> = {
  // ── Restaurants ──────────────────────────────────────────
  restaurant: {
    primaryPattern: "herringbone",
    secondaryPattern: "waves",
    opacity: 0.06,
  },
  // Sub-types for restaurant cuisine
  mexican: {
    primaryPattern: "zigzag",
    secondaryPattern: "diamonds",
    opacity: 0.07,
  },
  japanese: {
    primaryPattern: "seigaiha",
    secondaryPattern: "dots",
    opacity: 0.05,
  },
  italian: {
    primaryPattern: "herringbone",
    secondaryPattern: "none",
    opacity: 0.06,
  },
  french: {
    primaryPattern: "cross-hatch",
    secondaryPattern: "none",
    opacity: 0.04,
  },
  bakery: {
    primaryPattern: "polka-dots",
    secondaryPattern: "waves",
    opacity: 0.07,
  },

  // ── Services ──────────────────────────────────────────────
  spa: {
    primaryPattern: "waves",
    secondaryPattern: "topography",
    opacity: 0.04,
  },
  photography: {
    primaryPattern: "none",
    secondaryPattern: "none",
    opacity: 0,
  },
  fitness: {
    primaryPattern: "diagonal-stripes",
    secondaryPattern: "none",
    opacity: 0.08,
  },
  gym: {
    primaryPattern: "diagonal-stripes",
    secondaryPattern: "dots",
    opacity: 0.1,
  },

  // ── Professional ──────────────────────────────────────────
  business: {
    primaryPattern: "dots",
    secondaryPattern: "none",
    opacity: 0.04,
  },
  "law-firm": {
    primaryPattern: "pinstripe",
    secondaryPattern: "none",
    opacity: 0.03,
  },
  consulting: {
    primaryPattern: "grid",
    secondaryPattern: "none",
    opacity: 0.03,
  },
  architecture: {
    primaryPattern: "grid",
    secondaryPattern: "none",
    opacity: 0.04,
  },

  // ── Tech ──────────────────────────────────────────────────
  tech: {
    primaryPattern: "circuit-dots",
    secondaryPattern: "none",
    opacity: 0.05,
  },
  startup: {
    primaryPattern: "circuit-dots",
    secondaryPattern: "dots",
    opacity: 0.05,
  },
  saas: {
    primaryPattern: "grid",
    secondaryPattern: "none",
    opacity: 0.04,
  },

  // ── Creative ──────────────────────────────────────────────
  portfolio: {
    primaryPattern: "none",
    secondaryPattern: "none",
    opacity: 0,
  },
  creative: {
    primaryPattern: "concentric-circles",
    secondaryPattern: "none",
    opacity: 0.06,
  },

  // ── Commerce ──────────────────────────────────────────────
  ecommerce: {
    primaryPattern: "dots",
    secondaryPattern: "none",
    opacity: 0.03,
  },

  // ── Education / Nonprofit ─────────────────────────────────
  educational: {
    primaryPattern: "grid",
    secondaryPattern: "none",
    opacity: 0.03,
  },
  nonprofit: {
    primaryPattern: "topography",
    secondaryPattern: "none",
    opacity: 0.04,
  },

  // ── Events ────────────────────────────────────────────────
  event: {
    primaryPattern: "diagonal-stripes",
    secondaryPattern: "none",
    opacity: 0.06,
  },

  // ── Landing / General ─────────────────────────────────────
  landing: {
    primaryPattern: "dots",
    secondaryPattern: "none",
    opacity: 0.04,
  },
  personal: {
    primaryPattern: "none",
    secondaryPattern: "none",
    opacity: 0,
  },
  booking: {
    primaryPattern: "dots",
    secondaryPattern: "none",
    opacity: 0.04,
  },
};

/**
 * Resolve the industry pattern mapping for a given sub-type.
 * Falls back to siteType, then a minimal default.
 */
export function getIndustryPattern(subType: string, siteType: string): IndustryPatternMapping {
  return (
    INDUSTRY_PATTERNS[subType] ??
    INDUSTRY_PATTERNS[siteType] ?? {
      primaryPattern: "none",
      secondaryPattern: "none",
      opacity: 0,
    }
  );
}

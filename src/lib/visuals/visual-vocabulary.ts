/**
 * Visual vocabulary system — maps business types to coherent visual language
 * including divider styles, accent shapes, overlays, and motion settings.
 *
 * AI path evaluates each choice in context; deterministic fallback uses these defaults.
 */

export type DividerStyle = "wave" | "angle" | "curve" | "zigzag" | "none";
export type AccentShape = "circle" | "rectangle" | "organic" | "diamond" | "none";
export type ImageOverlay = "none" | "gradient" | "vignette" | "duotone";
export type ScrollRevealIntensity = "none" | "subtle" | "moderate" | "dramatic";

export interface VisualVocabulary {
  sectionDivider: DividerStyle;
  accentShape: AccentShape;
  imageOverlay: ImageOverlay;
  decorativeOpacity: number;
  preferredImageAspect: "landscape" | "portrait" | "square";
  enableParallax: boolean;
  scrollRevealIntensity: ScrollRevealIntensity;
}

/**
 * Default visual vocabulary per business type / sub-type.
 * AI path can override any of these based on specific brand context.
 */
const VISUAL_VOCABULARIES: Record<string, VisualVocabulary> = {
  restaurant: {
    sectionDivider: "curve",
    accentShape: "organic",
    imageOverlay: "vignette",
    decorativeOpacity: 0.08,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "moderate",
  },
  bakery: {
    sectionDivider: "curve",
    accentShape: "circle",
    imageOverlay: "vignette",
    decorativeOpacity: 0.08,
    preferredImageAspect: "square",
    enableParallax: false,
    scrollRevealIntensity: "moderate",
  },
  spa: {
    sectionDivider: "wave",
    accentShape: "organic",
    imageOverlay: "gradient",
    decorativeOpacity: 0.05,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "subtle",
  },
  photography: {
    sectionDivider: "none",
    accentShape: "none",
    imageOverlay: "none",
    decorativeOpacity: 0,
    preferredImageAspect: "portrait",
    enableParallax: true,
    scrollRevealIntensity: "subtle",
  },
  business: {
    sectionDivider: "angle",
    accentShape: "rectangle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.04,
    preferredImageAspect: "landscape",
    enableParallax: false,
    scrollRevealIntensity: "subtle",
  },
  "law-firm": {
    sectionDivider: "none",
    accentShape: "rectangle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.03,
    preferredImageAspect: "landscape",
    enableParallax: false,
    scrollRevealIntensity: "subtle",
  },
  consulting: {
    sectionDivider: "angle",
    accentShape: "rectangle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.03,
    preferredImageAspect: "landscape",
    enableParallax: false,
    scrollRevealIntensity: "subtle",
  },
  tech: {
    sectionDivider: "angle",
    accentShape: "rectangle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.05,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "moderate",
  },
  startup: {
    sectionDivider: "angle",
    accentShape: "rectangle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.06,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "moderate",
  },
  fitness: {
    sectionDivider: "angle",
    accentShape: "diamond",
    imageOverlay: "gradient",
    decorativeOpacity: 0.1,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "dramatic",
  },
  gym: {
    sectionDivider: "angle",
    accentShape: "diamond",
    imageOverlay: "gradient",
    decorativeOpacity: 0.1,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "dramatic",
  },
  portfolio: {
    sectionDivider: "none",
    accentShape: "none",
    imageOverlay: "none",
    decorativeOpacity: 0,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "subtle",
  },
  creative: {
    sectionDivider: "zigzag",
    accentShape: "organic",
    imageOverlay: "duotone",
    decorativeOpacity: 0.06,
    preferredImageAspect: "square",
    enableParallax: true,
    scrollRevealIntensity: "moderate",
  },
  ecommerce: {
    sectionDivider: "none",
    accentShape: "rectangle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.03,
    preferredImageAspect: "square",
    enableParallax: false,
    scrollRevealIntensity: "subtle",
  },
  educational: {
    sectionDivider: "curve",
    accentShape: "circle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.04,
    preferredImageAspect: "landscape",
    enableParallax: false,
    scrollRevealIntensity: "subtle",
  },
  nonprofit: {
    sectionDivider: "wave",
    accentShape: "organic",
    imageOverlay: "gradient",
    decorativeOpacity: 0.04,
    preferredImageAspect: "landscape",
    enableParallax: false,
    scrollRevealIntensity: "moderate",
  },
  event: {
    sectionDivider: "zigzag",
    accentShape: "diamond",
    imageOverlay: "gradient",
    decorativeOpacity: 0.06,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "dramatic",
  },
  landing: {
    sectionDivider: "angle",
    accentShape: "rectangle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.04,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "moderate",
  },
  personal: {
    sectionDivider: "none",
    accentShape: "none",
    imageOverlay: "none",
    decorativeOpacity: 0,
    preferredImageAspect: "landscape",
    enableParallax: false,
    scrollRevealIntensity: "subtle",
  },
  booking: {
    sectionDivider: "curve",
    accentShape: "circle",
    imageOverlay: "gradient",
    decorativeOpacity: 0.04,
    preferredImageAspect: "landscape",
    enableParallax: false,
    scrollRevealIntensity: "moderate",
  },
};

/** Default visual vocabulary for unknown business types. */
const DEFAULT_VOCABULARY: VisualVocabulary = {
  sectionDivider: "none",
  accentShape: "none",
  imageOverlay: "none",
  decorativeOpacity: 0.03,
  preferredImageAspect: "landscape",
  enableParallax: false,
  scrollRevealIntensity: "subtle",
};

/**
 * Resolve the visual vocabulary for a given sub-type + siteType.
 * Falls back to siteType, then a minimal default.
 */
export function getVisualVocabulary(subType: string, siteType: string): VisualVocabulary {
  return VISUAL_VOCABULARIES[subType] ?? VISUAL_VOCABULARIES[siteType] ?? DEFAULT_VOCABULARY;
}

/**
 * Override the visual vocabulary based on brand archetype.
 * Archetype adjustments are layered on top of industry defaults.
 */
export function applyArchetypeOverrides(
  vocab: VisualVocabulary,
  archetype?: string
): VisualVocabulary {
  if (!archetype) return vocab;

  switch (archetype) {
    case "guide":
      return {
        ...vocab,
        accentShape: vocab.accentShape === "none" ? "none" : "rectangle",
        scrollRevealIntensity: "subtle",
      };
    case "creative":
      return {
        ...vocab,
        accentShape: vocab.accentShape === "none" ? "none" : "organic",
        scrollRevealIntensity: "moderate",
      };
    case "rebel":
      return {
        ...vocab,
        sectionDivider: vocab.sectionDivider === "none" ? "none" : "angle",
        scrollRevealIntensity: "dramatic",
      };
    case "artisan":
      return {
        ...vocab,
        sectionDivider: vocab.sectionDivider === "none" ? "none" : "curve",
        decorativeOpacity: Math.min(vocab.decorativeOpacity + 0.02, 0.12),
      };
    case "caretaker":
      return {
        ...vocab,
        sectionDivider: vocab.sectionDivider === "none" ? "none" : "wave",
        accentShape: vocab.accentShape === "none" ? "none" : "organic",
      };
    case "expert":
      return {
        ...vocab,
        decorativeOpacity: Math.max(vocab.decorativeOpacity - 0.02, 0),
        scrollRevealIntensity: "subtle",
      };
    default:
      return vocab;
  }
}

/**
 * Adjust visual vocabulary based on personality vector.
 * - calm_dynamic (axis 5) controls parallax and reveal intensity
 * - minimal_rich (axis 0) controls decorative opacity
 */
export function applyPersonalityOverrides(
  vocab: VisualVocabulary,
  personalityVector: number[]
): VisualVocabulary {
  const [minRich, , , , , calmDynamic] = personalityVector;

  let result = { ...vocab };

  // Calm personalities → no parallax, subtle reveals
  if (calmDynamic < 0.3) {
    result = { ...result, enableParallax: false, scrollRevealIntensity: "subtle" };
  } else if (calmDynamic > 0.6) {
    result = { ...result, enableParallax: true };
    if (result.scrollRevealIntensity === "subtle") {
      result.scrollRevealIntensity = "moderate";
    }
  }

  // Minimal personalities → reduce decorative opacity
  if (minRich < 0.3) {
    result.decorativeOpacity = Math.max(result.decorativeOpacity - 0.03, 0);
  } else if (minRich > 0.7) {
    result.decorativeOpacity = Math.min(result.decorativeOpacity + 0.02, 0.15);
  }

  return result;
}

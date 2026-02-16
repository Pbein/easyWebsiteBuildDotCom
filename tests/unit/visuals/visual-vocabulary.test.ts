import { describe, it, expect } from "vitest";
import {
  getVisualVocabulary,
  applyArchetypeOverrides,
  applyPersonalityOverrides,
} from "@/lib/visuals/visual-vocabulary";
import type { VisualVocabulary } from "@/lib/visuals/visual-vocabulary";

const KNOWN_BUSINESS_TYPES = [
  "restaurant",
  "bakery",
  "spa",
  "photography",
  "business",
  "law-firm",
  "consulting",
  "tech",
  "startup",
  "fitness",
  "gym",
  "portfolio",
  "creative",
  "ecommerce",
  "educational",
  "nonprofit",
  "event",
  "landing",
  "personal",
  "booking",
];

const VALID_DIVIDERS = ["wave", "angle", "curve", "zigzag", "none"];
const VALID_ACCENTS = ["circle", "rectangle", "organic", "diamond", "none"];
const VALID_OVERLAYS = ["none", "gradient", "vignette", "duotone"];
const VALID_REVEAL = ["none", "subtle", "moderate", "dramatic"];

describe("getVisualVocabulary", () => {
  it.each(KNOWN_BUSINESS_TYPES)(
    "returns a valid vocabulary for known business type '%s'",
    (type) => {
      const vocab = getVisualVocabulary(type, type);
      expect(vocab).toBeDefined();
      expect(VALID_DIVIDERS).toContain(vocab.sectionDivider);
      expect(VALID_ACCENTS).toContain(vocab.accentShape);
      expect(VALID_OVERLAYS).toContain(vocab.imageOverlay);
      expect(VALID_REVEAL).toContain(vocab.scrollRevealIntensity);
      expect(typeof vocab.decorativeOpacity).toBe("number");
      expect(vocab.decorativeOpacity).toBeGreaterThanOrEqual(0);
      expect(vocab.decorativeOpacity).toBeLessThanOrEqual(1);
      expect(typeof vocab.enableParallax).toBe("boolean");
      expect(["landscape", "portrait", "square"]).toContain(vocab.preferredImageAspect);
    }
  );

  it("returns default vocabulary for unknown business type", () => {
    const vocab = getVisualVocabulary("unknown-type", "also-unknown");
    expect(vocab).toBeDefined();
    expect(vocab.sectionDivider).toBe("none");
    expect(vocab.accentShape).toBe("none");
    expect(vocab.imageOverlay).toBe("none");
    expect(vocab.decorativeOpacity).toBe(0.03);
    expect(vocab.preferredImageAspect).toBe("landscape");
    expect(vocab.enableParallax).toBe(false);
    expect(vocab.scrollRevealIntensity).toBe("subtle");
  });

  it("falls back from subType to siteType when subType is unknown", () => {
    const vocab = getVisualVocabulary("unknown-subtype", "restaurant");
    expect(vocab.sectionDivider).toBe("curve"); // restaurant's divider
    expect(vocab.accentShape).toBe("organic"); // restaurant's accent
  });

  it("returns consistent results for the same inputs", () => {
    const a = getVisualVocabulary("spa", "spa");
    const b = getVisualVocabulary("spa", "spa");
    expect(a).toEqual(b);
  });

  it("returns different vocabularies for different business types", () => {
    const restaurant = getVisualVocabulary("restaurant", "restaurant");
    const photography = getVisualVocabulary("photography", "photography");
    // Photography has no dividers/accents, restaurant has them
    expect(restaurant.sectionDivider).not.toBe(photography.sectionDivider);
    expect(restaurant.accentShape).not.toBe(photography.accentShape);
  });
});

describe("applyArchetypeOverrides", () => {
  const baseVocab: VisualVocabulary = {
    sectionDivider: "curve",
    accentShape: "organic",
    imageOverlay: "gradient",
    decorativeOpacity: 0.06,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "moderate",
  };

  it("returns vocabulary unchanged when archetype is undefined", () => {
    const result = applyArchetypeOverrides(baseVocab, undefined);
    expect(result).toEqual(baseVocab);
  });

  it("returns vocabulary unchanged when archetype is unknown", () => {
    const result = applyArchetypeOverrides(baseVocab, "unknown-archetype");
    expect(result).toEqual(baseVocab);
  });

  it("guide archetype sets rectangle accent and subtle reveal", () => {
    const result = applyArchetypeOverrides(baseVocab, "guide");
    expect(result.accentShape).toBe("rectangle");
    expect(result.scrollRevealIntensity).toBe("subtle");
  });

  it("rebel archetype sets angle divider and dramatic reveal", () => {
    const result = applyArchetypeOverrides(baseVocab, "rebel");
    expect(result.sectionDivider).toBe("angle");
    expect(result.scrollRevealIntensity).toBe("dramatic");
  });

  it("artisan archetype sets curve divider and increases opacity", () => {
    const result = applyArchetypeOverrides(baseVocab, "artisan");
    expect(result.sectionDivider).toBe("curve");
    expect(result.decorativeOpacity).toBe(0.08); // 0.06 + 0.02
  });

  it("artisan archetype caps opacity at 0.12", () => {
    const highOpacityVocab = { ...baseVocab, decorativeOpacity: 0.11 };
    const result = applyArchetypeOverrides(highOpacityVocab, "artisan");
    expect(result.decorativeOpacity).toBe(0.12);
  });

  it("expert archetype reduces opacity and sets subtle reveal", () => {
    const result = applyArchetypeOverrides(baseVocab, "expert");
    expect(result.decorativeOpacity).toBeCloseTo(0.04); // 0.06 - 0.02
    expect(result.scrollRevealIntensity).toBe("subtle");
  });

  it("expert archetype floors opacity at 0", () => {
    const lowOpacityVocab = { ...baseVocab, decorativeOpacity: 0.01 };
    const result = applyArchetypeOverrides(lowOpacityVocab, "expert");
    expect(result.decorativeOpacity).toBe(0);
  });

  it("preserves 'none' accent when guide archetype is applied", () => {
    const noAccentVocab: VisualVocabulary = {
      ...baseVocab,
      accentShape: "none",
    };
    const result = applyArchetypeOverrides(noAccentVocab, "guide");
    expect(result.accentShape).toBe("none");
  });

  it("preserves 'none' divider when rebel archetype is applied", () => {
    const noDividerVocab: VisualVocabulary = {
      ...baseVocab,
      sectionDivider: "none",
    };
    const result = applyArchetypeOverrides(noDividerVocab, "rebel");
    expect(result.sectionDivider).toBe("none");
  });
});

describe("applyPersonalityOverrides", () => {
  const baseVocab: VisualVocabulary = {
    sectionDivider: "curve",
    accentShape: "organic",
    imageOverlay: "gradient",
    decorativeOpacity: 0.06,
    preferredImageAspect: "landscape",
    enableParallax: true,
    scrollRevealIntensity: "subtle",
  };

  it("calm personality (calmDynamic < 0.3) disables parallax and sets subtle reveal", () => {
    //                     [minRich, _, _, _, _, calmDynamic]
    const calmVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.2];
    const result = applyPersonalityOverrides(baseVocab, calmVector);
    expect(result.enableParallax).toBe(false);
    expect(result.scrollRevealIntensity).toBe("subtle");
  });

  it("dynamic personality (calmDynamic > 0.6) enables parallax and upgrades subtle to moderate", () => {
    const dynamicVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.8];
    const result = applyPersonalityOverrides(baseVocab, dynamicVector);
    expect(result.enableParallax).toBe(true);
    expect(result.scrollRevealIntensity).toBe("moderate");
  });

  it("minimal personality (minRich < 0.3) reduces decorative opacity", () => {
    const minimalVector = [0.1, 0.5, 0.5, 0.5, 0.5, 0.5];
    const result = applyPersonalityOverrides(baseVocab, minimalVector);
    expect(result.decorativeOpacity).toBe(0.03); // 0.06 - 0.03
  });

  it("rich personality (minRich > 0.7) increases decorative opacity", () => {
    const richVector = [0.9, 0.5, 0.5, 0.5, 0.5, 0.5];
    const result = applyPersonalityOverrides(baseVocab, richVector);
    expect(result.decorativeOpacity).toBe(0.08); // 0.06 + 0.02
  });

  it("rich personality caps opacity at 0.15", () => {
    const highOpacityVocab = { ...baseVocab, decorativeOpacity: 0.14 };
    const richVector = [0.9, 0.5, 0.5, 0.5, 0.5, 0.5];
    const result = applyPersonalityOverrides(highOpacityVocab, richVector);
    expect(result.decorativeOpacity).toBe(0.15);
  });

  it("minimal personality floors opacity at 0", () => {
    const lowOpacityVocab = { ...baseVocab, decorativeOpacity: 0.01 };
    const minimalVector = [0.1, 0.5, 0.5, 0.5, 0.5, 0.5];
    const result = applyPersonalityOverrides(lowOpacityVocab, minimalVector);
    expect(result.decorativeOpacity).toBe(0);
  });

  it("neutral personality (0.3-0.7 range) leaves vocabulary unchanged", () => {
    const neutralVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    const result = applyPersonalityOverrides(baseVocab, neutralVector);
    expect(result.decorativeOpacity).toBe(baseVocab.decorativeOpacity);
    expect(result.enableParallax).toBe(baseVocab.enableParallax);
    expect(result.scrollRevealIntensity).toBe(baseVocab.scrollRevealIntensity);
  });
});

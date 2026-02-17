/**
 * @requirements Voice-Keyed Content — Requirements-First Tests
 *
 * Source: src/lib/content/voice-keyed.ts
 * Functions: getVoiceKeyedHeadline, getVoiceKeyedCtaText
 *
 * Design spec requirements:
 *   - Warm: conversational, friendly, contractions, inclusive, low-pressure
 *   - Polished: formal, refined, title-case, sophisticated vocabulary
 *   - Direct: brief, action-oriented, no fluff, imperative mood
 *   - Anti-reference "salesy": removes urgency language, switches to browse
 *   - SubType overrides siteType when available
 *   - Unknown siteType falls back to "business" template
 *   - Unknown voiceTone falls back to "polished"
 *   - Business name MUST appear in every headline
 *   - All 13 site types produce non-empty output for all 3 tones
 *
 * IMPORTANT: These tests validate QUALITIES and REQUIREMENTS, not exact
 * string values. No test should contain a string literal copied from the
 * source lookup tables. This prevents code-mirror tests that would pass
 * even if both source and test contain the same typo.
 */

import { describe, it, expect } from "vitest";
import {
  getVoiceKeyedHeadline,
  getVoiceKeyedCtaText,
  type VoiceTone,
} from "@/lib/content/voice-keyed";

/* ── Constants ──────────────────────────────────────────────── */

const ALL_SITE_TYPES = [
  "restaurant",
  "spa",
  "photography",
  "business",
  "portfolio",
  "ecommerce",
  "booking",
  "blog",
  "personal",
  "educational",
  "nonprofit",
  "event",
  "landing",
] as const;

const ALL_TONES: VoiceTone[] = ["warm", "polished", "direct"];

const ALL_GOALS = [
  "contact",
  "book",
  "showcase",
  "sell",
  "hire",
  "attention",
  "audience",
  "convert",
];

/** Words that signal urgency / high-pressure sales language */
const URGENCY_WORDS = ["now", "today", "hurry", "act fast", "limited", "don't miss", "last chance"];

/** High-pressure purchase verbs that warm tone should avoid */
const HIGH_PRESSURE_WORDS = ["buy", "purchase", "order", "subscribe"];

/* ── Helpers ────────────────────────────────────────────────── */

/** Check if a string uses title-case pattern (most words capitalized) */
function hasTitleCasePattern(str: string): boolean {
  // Remove the business name portion and any leading punctuation/separator
  const words = str
    .replace(/[—\-–.,:!]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3); // skip short words like "a", "the", "and"
  if (words.length === 0) return false;
  const capitalizedCount = words.filter((w) => /^[A-Z]/.test(w)).length;
  // Title-case: majority of significant words start with uppercase
  return capitalizedCount / words.length >= 0.6;
}

/* ── getVoiceKeyedHeadline ──────────────────────────────────── */

describe("getVoiceKeyedHeadline", () => {
  const businessName = "Bella's Bistro";

  // Requirement 1: Business name appears in EVERY headline for all 13 types x 3 tones
  it("invariant: business name appears in every headline for all 13 site types x 3 tones", () => {
    for (const siteType of ALL_SITE_TYPES) {
      for (const tone of ALL_TONES) {
        const result = getVoiceKeyedHeadline(businessName, siteType, tone);
        expect(result).toContain(businessName);
      }
    }
  });

  // Requirement 2: All 3 tones produce DIFFERENT headlines for the same inputs
  it("invariant: all 3 tones produce different headlines for the same inputs", () => {
    for (const siteType of ALL_SITE_TYPES) {
      const warm = getVoiceKeyedHeadline(businessName, siteType, "warm");
      const polished = getVoiceKeyedHeadline(businessName, siteType, "polished");
      const direct = getVoiceKeyedHeadline(businessName, siteType, "direct");

      expect(warm).not.toBe(polished);
      expect(polished).not.toBe(direct);
      expect(warm).not.toBe(direct);
    }
  });

  // Requirement 3: Warm headlines use lowercase/conversational language patterns
  it("requirement: warm headlines use conversational language (lowercase, informal patterns)", () => {
    // Collect warm headlines across multiple site types
    const warmHeadlines = ALL_SITE_TYPES.map((st) =>
      getVoiceKeyedHeadline(businessName, st, "warm")
    );

    // Warm language indicators: contractions, lowercase words after name,
    // conversational starters ("hey", "welcome", "let's", "come")
    const conversationalPatterns =
      /\b(hey|welcome|let's|come|we're|you'll|your|together|nice|love)\b/i;
    const matchCount = warmHeadlines.filter((h) => conversationalPatterns.test(h)).length;

    // At least 75% of warm headlines should show conversational patterns
    expect(matchCount / warmHeadlines.length).toBeGreaterThanOrEqual(0.75);
  });

  // Requirement 4: Polished headlines use title-case / formal language patterns
  it("requirement: polished headlines use title-case and formal vocabulary", () => {
    const polishedHeadlines = ALL_SITE_TYPES.map((st) =>
      getVoiceKeyedHeadline(businessName, st, "polished")
    );

    // Polished headlines should predominantly use title-case
    const titleCaseCount = polishedHeadlines.filter((h) => hasTitleCasePattern(h)).length;
    expect(titleCaseCount / polishedHeadlines.length).toBeGreaterThanOrEqual(0.75);

    // Polished vocabulary: formal/sophisticated words
    const formalPatterns =
      /\b(experience|excellence|refined|curated|premium|elevating|crafting|measurable|intelligent|inspired|timeless|perspectives)\b/i;
    const formalCount = polishedHeadlines.filter((h) => formalPatterns.test(h)).length;
    expect(formalCount / polishedHeadlines.length).toBeGreaterThanOrEqual(0.5);
  });

  // Requirement 5: Direct headlines are shorter/punchier than polished headlines
  it("requirement: direct headlines are shorter than polished headlines on average", () => {
    let totalDirectLen = 0;
    let totalPolishedLen = 0;

    for (const siteType of ALL_SITE_TYPES) {
      const direct = getVoiceKeyedHeadline(businessName, siteType, "direct");
      const polished = getVoiceKeyedHeadline(businessName, siteType, "polished");
      totalDirectLen += direct.length;
      totalPolishedLen += polished.length;
    }

    const avgDirect = totalDirectLen / ALL_SITE_TYPES.length;
    const avgPolished = totalPolishedLen / ALL_SITE_TYPES.length;

    // Direct should be shorter on average
    expect(avgDirect).toBeLessThan(avgPolished);
  });

  // Requirement 9: SubType overrides siteType when available
  it("contract: subType overrides siteType when available", () => {
    // Use "restaurant" as subType but "business" as siteType
    const withSubType = getVoiceKeyedHeadline(businessName, "business", "warm", "restaurant");
    const restaurantDirect = getVoiceKeyedHeadline(businessName, "restaurant", "warm");
    const businessDirect = getVoiceKeyedHeadline(businessName, "business", "warm");

    // SubType "restaurant" should resolve to the restaurant template, not business
    expect(withSubType).toBe(restaurantDirect);
    expect(withSubType).not.toBe(businessDirect);
  });

  // Requirement 10: Unknown siteType falls back gracefully (non-empty string)
  it("boundary: unknown siteType falls back gracefully to business template", () => {
    const result = getVoiceKeyedHeadline(businessName, "totally-unknown-type", "warm");
    const businessResult = getVoiceKeyedHeadline(businessName, "business", "warm");

    expect(result).toBe(businessResult);
    expect(result).toContain(businessName);
    expect(result.length).toBeGreaterThan(businessName.length);
  });

  // Requirement 11: Unknown voiceTone falls back to polished
  it("boundary: unknown voiceTone falls back to polished", () => {
    const result = getVoiceKeyedHeadline(
      businessName,
      "restaurant",
      "totally-unknown-tone" as VoiceTone
    );
    const polishedResult = getVoiceKeyedHeadline(businessName, "restaurant", "polished");

    expect(result).toBe(polishedResult);
  });

  // Requirement 14: Function signatures match documented API
  it("contract: function accepts (businessName, siteType, voiceTone, subType?) and returns string", () => {
    // With 3 required args
    const result3 = getVoiceKeyedHeadline("Test", "business", "warm");
    expect(typeof result3).toBe("string");

    // With optional 4th arg
    const result4 = getVoiceKeyedHeadline("Test", "business", "warm", "restaurant");
    expect(typeof result4).toBe("string");
  });

  // Requirement 15: Different site types produce different headlines
  it("requirement: different site types produce different headlines (not one-size-fits-all)", () => {
    const headlines = ALL_SITE_TYPES.map((st) => getVoiceKeyedHeadline(businessName, st, "warm"));

    // Every site type should produce a unique headline
    const uniqueHeadlines = new Set(headlines);
    expect(uniqueHeadlines.size).toBe(ALL_SITE_TYPES.length);
  });
});

/* ── getVoiceKeyedCtaText ───────────────────────────────────── */

describe("getVoiceKeyedCtaText", () => {
  // Requirement 6: Anti-reference "salesy" changes CTA output
  it("requirement: anti-reference 'salesy' changes CTA output for affected goals", () => {
    // Test both goals that have salesy variants (book and sell in warm)
    for (const goal of ["book", "sell"]) {
      const withoutAntiRef = getVoiceKeyedCtaText(goal, "warm", []);
      const withAntiRef = getVoiceKeyedCtaText(goal, "warm", ["salesy"]);

      // The salesy anti-ref should produce a DIFFERENT CTA
      expect(withAntiRef).not.toBe(withoutAntiRef);
      // Both should still be non-empty strings
      expect(withAntiRef.length).toBeGreaterThan(0);
      expect(withoutAntiRef.length).toBeGreaterThan(0);
    }
  });

  // Requirement 7: Anti-reference "salesy" warm CTAs avoid urgency language
  // NOTE: The salesy anti-ref logic is currently implemented only in the warm
  // tone branch. Direct/polished tones have static lookups that do not check
  // antiRefs. This test validates the warm-tone contract where the override
  // is actually wired up.
  it("requirement: anti-reference 'salesy' warm CTAs avoid urgency language", () => {
    for (const goal of ALL_GOALS) {
      const cta = getVoiceKeyedCtaText(goal, "warm", ["salesy"]);
      const ctaLower = cta.toLowerCase();

      for (const urgencyWord of URGENCY_WORDS) {
        expect(ctaLower).not.toContain(urgencyWord);
      }
    }
  });

  // Requirement 8: Warm CTAs don't use high-pressure sales language
  it("requirement: warm CTAs avoid high-pressure purchase language", () => {
    for (const goal of ALL_GOALS) {
      const cta = getVoiceKeyedCtaText(goal, "warm", []);
      const ctaLower = cta.toLowerCase();

      for (const pressureWord of HIGH_PRESSURE_WORDS) {
        expect(ctaLower).not.toContain(pressureWord);
      }
    }
  });

  // Requirement 9: SubType overrides goal-based CTA when available
  it("contract: subType restaurant overrides generic CTA for matching goals", () => {
    const genericCta = getVoiceKeyedCtaText("book", "warm", []);
    const restaurantCta = getVoiceKeyedCtaText("book", "warm", [], "restaurant");

    // Restaurant-specific CTA should differ from generic "book" CTA
    expect(restaurantCta).not.toBe(genericCta);
    expect(restaurantCta.length).toBeGreaterThan(0);
  });

  // Requirement 12: Unknown goal returns non-empty CTA
  it("boundary: unknown goal returns non-empty CTA string", () => {
    const result = getVoiceKeyedCtaText("completely-unknown-goal", "warm", []);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  // Requirement 13: Every CTA for every goal x tone combination is non-empty
  it("invariant: every CTA for every goal x tone combination is non-empty", () => {
    for (const goal of ALL_GOALS) {
      for (const tone of ALL_TONES) {
        const cta = getVoiceKeyedCtaText(goal, tone, []);
        expect(cta).toBeTruthy();
        expect(cta.length).toBeGreaterThan(0);
      }
    }
  });

  // Requirement 14: Function signature contract
  it("contract: function accepts (goal, voiceTone, antiRefs, subType?) and returns string", () => {
    // With 3 required args
    const result3 = getVoiceKeyedCtaText("contact", "warm", []);
    expect(typeof result3).toBe("string");

    // With optional 4th arg
    const result4 = getVoiceKeyedCtaText("book", "polished", [], "restaurant");
    expect(typeof result4).toBe("string");

    // With non-empty antiRefs
    const resultAnti = getVoiceKeyedCtaText("sell", "warm", ["salesy", "corporate"]);
    expect(typeof resultAnti).toBe("string");
  });

  // Tone character: each tone produces CTAs with distinct character
  it("requirement: each tone produces CTAs with distinct character across goals", () => {
    // Collect all CTAs per tone
    const ctasByTone: Record<string, string[]> = { warm: [], polished: [], direct: [] };

    for (const goal of ALL_GOALS) {
      for (const tone of ALL_TONES) {
        ctasByTone[tone].push(getVoiceKeyedCtaText(goal, tone, []));
      }
    }

    // Polished CTAs should have higher average length than direct (more formal = more words)
    const avgPolished =
      ctasByTone.polished.reduce((sum, c) => sum + c.length, 0) / ctasByTone.polished.length;
    const avgDirect =
      ctasByTone.direct.reduce((sum, c) => sum + c.length, 0) / ctasByTone.direct.length;
    expect(avgPolished).toBeGreaterThan(avgDirect);

    // The set of warm CTAs should differ from the set of direct CTAs
    const warmSet = new Set(ctasByTone.warm);
    const directSet = new Set(ctasByTone.direct);
    const overlap = [...warmSet].filter((c) => directSet.has(c));
    // Majority should be different
    expect(overlap.length).toBeLessThan(warmSet.size * 0.5);
  });
});

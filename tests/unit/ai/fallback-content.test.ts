import { describe, it, expect } from "vitest";
import {
  generateDeterministicSpec,
  getVoiceKeyedHeadline,
  getVoiceKeyedCtaText,
  getStatsForSiteType,
  getServicesForSiteType,
  getTeamForSiteType,
  SUPPORTED_SITE_TYPES,
  type DeterministicSpecArgs,
} from "@/lib/assembly/deterministic-fallback";
import {
  assertValidSpec,
  assertBusinessNameUsed,
  assertCTAMatchesGoal,
} from "../../helpers/assertions";

function makeArgs(overrides: Partial<DeterministicSpecArgs> = {}): DeterministicSpecArgs {
  return {
    sessionId: "test_session_123",
    siteType: "business",
    goal: "contact",
    businessName: "TestBiz",
    description: "A great consulting firm",
    personality: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    aiResponses: {},
    ...overrides,
  };
}

describe("generateDeterministicSpec", () => {
  it("generates a valid spec", () => {
    const spec = generateDeterministicSpec(makeArgs());
    assertValidSpec(spec);
  });

  it("includes the business name in the hero headline", () => {
    const spec = generateDeterministicSpec(makeArgs());
    assertBusinessNameUsed(spec, "TestBiz");
  });

  it("includes a CTA banner with text", () => {
    const spec = generateDeterministicSpec(makeArgs());
    assertCTAMatchesGoal(spec);
  });

  it("always includes nav, hero, content-text, content-features, testimonials, cta, footer", () => {
    const spec = generateDeterministicSpec(makeArgs());
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("nav-sticky");
    expect(ids).toContain("content-text");
    expect(ids).toContain("content-features");
    expect(ids).toContain("proof-testimonials");
    expect(ids).toContain("cta-banner");
    expect(ids).toContain("footer-standard");
    expect(ids.some((id) => id === "hero-centered" || id === "hero-split")).toBe(true);
  });

  it("adds content-stats for business site type", () => {
    const spec = generateDeterministicSpec(makeArgs({ siteType: "business" }));
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("content-stats");
  });

  it("adds commerce-services for booking site type", () => {
    const spec = generateDeterministicSpec(makeArgs({ siteType: "booking" }));
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("commerce-services");
  });

  it("adds team-grid for business site type", () => {
    const spec = generateDeterministicSpec(makeArgs({ siteType: "business" }));
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("team-grid");
  });

  it("adds content-logos for educational site type", () => {
    const spec = generateDeterministicSpec(makeArgs({ siteType: "educational" }));
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("content-logos");
  });

  it("adds content-accordion for booking site type", () => {
    const spec = generateDeterministicSpec(makeArgs({ siteType: "booking" }));
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("content-accordion");
  });

  it("adds form-contact for contact goal", () => {
    const spec = generateDeterministicSpec(makeArgs({ goal: "contact" }));
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("form-contact");
  });

  it("does NOT add form-contact for showcase goal", () => {
    const spec = generateDeterministicSpec(makeArgs({ goal: "showcase" }));
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).not.toContain("form-contact");
  });

  it("uses hero-centered when warmCool < 0.5", () => {
    const spec = generateDeterministicSpec(
      makeArgs({ personality: [0.5, 0.5, 0.3, 0.5, 0.5, 0.5] })
    );
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("hero-centered");
  });

  it("uses hero-split when warmCool >= 0.5", () => {
    const spec = generateDeterministicSpec(
      makeArgs({ personality: [0.5, 0.5, 0.7, 0.5, 0.5, 0.5] })
    );
    const ids = spec.pages[0].components.map((c) => c.componentId);
    expect(ids).toContain("hero-split");
  });

  it("preserves brand character data in output", () => {
    const spec = generateDeterministicSpec(
      makeArgs({
        emotionalGoals: ["trust", "excitement"],
        voiceProfile: "warm",
        brandArchetype: "innovator",
        antiReferences: ["salesy"],
        narrativePrompts: { mission: "We help people" },
      })
    );
    expect(spec.emotionalGoals).toEqual(["trust", "excitement"]);
    expect(spec.voiceProfile).toBe("warm");
    expect(spec.brandArchetype).toBe("innovator");
    expect(spec.antiReferences).toEqual(["salesy"]);
    expect(spec.narrativePrompts).toEqual({ mission: "We help people" });
  });

  it("sets metadata method to deterministic", () => {
    const spec = generateDeterministicSpec(makeArgs());
    expect(spec.metadata.method).toBe("deterministic");
  });

  it("generates spec for all 10 supported site types without errors", () => {
    for (const siteType of SUPPORTED_SITE_TYPES) {
      const spec = generateDeterministicSpec(makeArgs({ siteType }));
      expect(spec.pages[0].components.length).toBeGreaterThan(0);
    }
  });
});

describe("getVoiceKeyedHeadline", () => {
  it("returns warm headline for warm voice", () => {
    const headline = getVoiceKeyedHeadline("TestBiz", "business", "warm");
    expect(headline.toLowerCase()).toContain("testbiz");
    expect(headline.toLowerCase()).toContain("welcome");
  });

  it("returns polished headline for polished voice", () => {
    const headline = getVoiceKeyedHeadline("TestBiz", "business", "polished");
    expect(headline).toContain("TestBiz");
    // Polished voice uses formal vocabulary — title-case words, no contractions
    const words = headline.split(/\s+/);
    const hasTitleCaseWord = words.some((w) => w !== "TestBiz" && /^[A-Z][a-z]/.test(w));
    expect(hasTitleCaseWord).toBe(true);
    expect(headline).not.toMatch(/\b(n't|'re|'ve|'ll|let's)\b/i);
  });

  it("returns direct headline for direct voice", () => {
    const headline = getVoiceKeyedHeadline("TestBiz", "business", "direct");
    expect(headline).toContain("TestBiz");
  });

  it("falls back to polished business for unknown site type", () => {
    const headline = getVoiceKeyedHeadline("TestBiz", "unknown", "warm");
    expect(headline).toBeTruthy();
  });
});
describe("getVoiceKeyedCtaText", () => {
  it("returns warm CTA for contact goal", () => {
    const cta = getVoiceKeyedCtaText("contact", "warm", []);
    // Warm CTAs use conversational, approachable language — not formal or sales-heavy
    expect(cta.length).toBeGreaterThan(0);
    expect(cta.length).toBeLessThanOrEqual(40);
    expect(cta).not.toMatch(/\b(buy|purchase|order now|subscribe)\b/i);
    // Warm voice favors lowercase-style or casual phrasing
    const hasConversationalTone = /[a-z]/.test(cta.charAt(cta.length - 1)) || cta.includes("'");
    expect(hasConversationalTone).toBe(true);
  });

  it("returns polished CTA for contact goal", () => {
    const cta = getVoiceKeyedCtaText("contact", "polished", []);
    // Polished CTAs use formal, title-case language
    expect(cta.length).toBeGreaterThan(0);
    expect(cta.length).toBeLessThanOrEqual(40);
    // Should have title-case words (first letter capitalized)
    const words = cta.split(/\s+/);
    const titleCaseCount = words.filter((w) => /^[A-Z]/.test(w)).length;
    expect(titleCaseCount).toBeGreaterThanOrEqual(Math.ceil(words.length / 2));
    // Should not contain contractions (polished = formal)
    expect(cta).not.toMatch(/\b(n't|'re|'ve|'ll|let's)\b/i);
  });

  it("modifies CTA when salesy anti-reference is present", () => {
    const withSalesy = getVoiceKeyedCtaText("book", "warm", ["salesy"]);
    const withoutSalesy = getVoiceKeyedCtaText("book", "warm", []);
    expect(withSalesy).not.toBe(withoutSalesy);
  });
});

describe("getStatsForSiteType", () => {
  it("returns stats for business type", () => {
    const stats = getStatsForSiteType("business");
    expect(stats.length).toBe(4);
    expect(stats[0].value).toBeTypeOf("number");
    expect(stats[0].label).toBeTruthy();
  });

  it("returns different stats for different site types", () => {
    const businessStats = getStatsForSiteType("business");
    const bookingStats = getStatsForSiteType("booking");
    expect(businessStats[0].label).not.toBe(bookingStats[0].label);
  });

  it("falls back to business stats for unknown type", () => {
    const stats = getStatsForSiteType("unknown");
    expect(stats).toEqual(getStatsForSiteType("business"));
  });
});

describe("getServicesForSiteType", () => {
  it("returns booking-specific services", () => {
    const services = getServicesForSiteType("booking");
    expect(services.length).toBe(4);
    expect(services[0].name).toBeTruthy();
  });

  it("returns default services for non-booking types", () => {
    const services = getServicesForSiteType("business");
    expect(services.length).toBe(3);
  });
});

describe("getTeamForSiteType", () => {
  it("returns personal-specific team", () => {
    const team = getTeamForSiteType("personal");
    expect(team.length).toBe(3);
  });

  it("returns default team for business type", () => {
    const team = getTeamForSiteType("business");
    expect(team.length).toBe(4);
  });
});

describe("SUPPORTED_SITE_TYPES", () => {
  it("contains 10 site types", () => {
    expect(SUPPORTED_SITE_TYPES).toHaveLength(10);
  });

  it("includes all expected types", () => {
    const expected = [
      "business",
      "booking",
      "ecommerce",
      "portfolio",
      "blog",
      "personal",
      "educational",
      "nonprofit",
      "event",
      "landing",
    ];
    for (const type of expected) {
      expect(SUPPORTED_SITE_TYPES).toContain(type);
    }
  });
});

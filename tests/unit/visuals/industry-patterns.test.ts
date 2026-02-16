import { describe, it, expect } from "vitest";
import { INDUSTRY_PATTERNS, getIndustryPattern } from "@/lib/visuals/industry-patterns";
import { CSS_PATTERNS } from "@/lib/visuals/css-patterns";

const KNOWN_INDUSTRIES = [
  "restaurant",
  "mexican",
  "japanese",
  "italian",
  "french",
  "bakery",
  "spa",
  "photography",
  "fitness",
  "gym",
  "business",
  "law-firm",
  "consulting",
  "architecture",
  "tech",
  "startup",
  "saas",
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

describe("INDUSTRY_PATTERNS registry", () => {
  it("contains mappings for all expected industries", () => {
    for (const industry of KNOWN_INDUSTRIES) {
      expect(INDUSTRY_PATTERNS[industry]).toBeDefined();
    }
  });

  it("each mapping has primaryPattern, secondaryPattern, and opacity", () => {
    for (const [key, mapping] of Object.entries(INDUSTRY_PATTERNS)) {
      expect(typeof mapping.primaryPattern).toBe("string");
      expect(typeof mapping.secondaryPattern).toBe("string");
      expect(typeof mapping.opacity).toBe("number");
      expect(mapping.opacity).toBeGreaterThanOrEqual(0);
      expect(mapping.opacity).toBeLessThanOrEqual(1);
    }
  });

  it("all non-none primary patterns are valid CSS pattern IDs", () => {
    const validPatternIds = Object.keys(CSS_PATTERNS);
    for (const mapping of Object.values(INDUSTRY_PATTERNS)) {
      if (mapping.primaryPattern !== "none") {
        expect(validPatternIds).toContain(mapping.primaryPattern);
      }
    }
  });

  it("all non-none secondary patterns are valid CSS pattern IDs", () => {
    const validPatternIds = Object.keys(CSS_PATTERNS);
    for (const mapping of Object.values(INDUSTRY_PATTERNS)) {
      if (mapping.secondaryPattern !== "none") {
        expect(validPatternIds).toContain(mapping.secondaryPattern);
      }
    }
  });
});

describe("getIndustryPattern", () => {
  it("returns the correct mapping for a known subType", () => {
    const result = getIndustryPattern("japanese", "restaurant");
    expect(result.primaryPattern).toBe("seigaiha");
    expect(result.secondaryPattern).toBe("dots");
    expect(result.opacity).toBe(0.05);
  });

  it("falls back from unknown subType to siteType", () => {
    const result = getIndustryPattern("unknown-cuisine", "restaurant");
    expect(result.primaryPattern).toBe("herringbone");
    expect(result.secondaryPattern).toBe("waves");
    expect(result.opacity).toBe(0.06);
  });

  it("returns default (none/none/0) for completely unknown types", () => {
    const result = getIndustryPattern("alien-business", "unknown-site");
    expect(result.primaryPattern).toBe("none");
    expect(result.secondaryPattern).toBe("none");
    expect(result.opacity).toBe(0);
  });

  it("subType takes priority over siteType", () => {
    // japanese subType should override restaurant siteType
    const subResult = getIndustryPattern("japanese", "restaurant");
    const siteResult = getIndustryPattern("restaurant", "restaurant");
    expect(subResult.primaryPattern).toBe("seigaiha");
    expect(siteResult.primaryPattern).toBe("herringbone");
    expect(subResult.primaryPattern).not.toBe(siteResult.primaryPattern);
  });
});

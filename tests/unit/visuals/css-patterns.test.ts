import { describe, it, expect } from "vitest";
import {
  CSS_PATTERNS,
  generatePattern,
  getPatternSize,
  getPatternPosition,
} from "@/lib/visuals/css-patterns";

// All 14 registered pattern IDs
const ALL_PATTERN_IDS = [
  "pinstripe",
  "diagonal-stripes",
  "dots",
  "grid",
  "herringbone",
  "cross-hatch",
  "zigzag",
  "waves",
  "concentric-circles",
  "seigaiha",
  "topography",
  "diamonds",
  "circuit-dots",
  "polka-dots",
];

describe("CSS_PATTERNS registry", () => {
  it("contains exactly 14 registered patterns", () => {
    expect(Object.keys(CSS_PATTERNS)).toHaveLength(14);
  });

  it("has all expected pattern IDs", () => {
    for (const id of ALL_PATTERN_IDS) {
      expect(CSS_PATTERNS[id]).toBeDefined();
    }
  });

  it("each entry has id, label, and generate function", () => {
    for (const [key, pattern] of Object.entries(CSS_PATTERNS)) {
      expect(pattern.id).toBe(key);
      expect(typeof pattern.label).toBe("string");
      expect(pattern.label.length).toBeGreaterThan(0);
      expect(typeof pattern.generate).toBe("function");
    }
  });

  it("each label is a non-empty human-readable string", () => {
    for (const pattern of Object.values(CSS_PATTERNS)) {
      expect(pattern.label).toMatch(/^[A-Z]/); // starts with uppercase
      expect(pattern.label.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("generatePattern", () => {
  it.each(ALL_PATTERN_IDS)("generates a non-empty CSS string for pattern '%s'", (patternId) => {
    const result = generatePattern(patternId, "#ff0000");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty string for 'none' pattern ID", () => {
    expect(generatePattern("none", "#ff0000")).toBe("");
  });

  it("returns empty string for empty string pattern ID", () => {
    expect(generatePattern("", "#ff0000")).toBe("");
  });

  it("returns empty string for an unknown pattern ID", () => {
    expect(generatePattern("nonexistent-pattern", "#ff0000")).toBe("");
  });

  it("includes the provided color in the output for gradient-based patterns", () => {
    const color = "#3ecfb4";
    const result = generatePattern("pinstripe", color);
    expect(result).toContain(color);
  });

  it("includes the color in SVG-based patterns (double URL-encoded)", () => {
    const color = "#e8a849";
    const result = generatePattern("zigzag", color);
    // The SVG string encodes the color once, then the entire SVG is encodeURIComponent'd
    // so # becomes %23 inside the SVG, then %23 becomes %2523 in the final URI
    expect(result).toContain("data:image/svg+xml");
    expect(result).toContain(encodeURIComponent(encodeURIComponent(color)));
  });

  it("gradient patterns contain gradient syntax", () => {
    const result = generatePattern("dots", "#333");
    expect(result).toContain("gradient");
  });

  it("SVG patterns contain data:image/svg+xml URI", () => {
    const result = generatePattern("waves", "#333");
    expect(result).toContain("data:image/svg+xml");
  });

  it("multi-layer patterns contain commas separating layers", () => {
    const result = generatePattern("grid", "#000");
    // grid uses two repeating-linear-gradient layers joined by comma
    expect(result).toContain(",");
    expect(result.split("repeating-linear-gradient").length).toBe(3); // 2 gradients + 1 leading
  });
});

describe("getPatternSize", () => {
  it("returns specific sizes for gradient-based patterns", () => {
    expect(getPatternSize("dots")).toBe("20px 20px");
    expect(getPatternSize("grid")).toBe("50px 50px");
    expect(getPatternSize("pinstripe")).toBe("40px 40px");
    expect(getPatternSize("diagonal-stripes")).toBe("16px 16px");
    expect(getPatternSize("herringbone")).toBe("12px 12px");
    expect(getPatternSize("cross-hatch")).toBe("20px 20px");
  });

  it("returns multi-layer sizes for circuit-dots and polka-dots", () => {
    expect(getPatternSize("circuit-dots")).toBe("30px 30px, 30px 30px");
    expect(getPatternSize("polka-dots")).toBe("30px 30px, 30px 30px");
  });

  it("returns 'auto' for SVG-based patterns without explicit sizing", () => {
    expect(getPatternSize("zigzag")).toBe("auto");
    expect(getPatternSize("waves")).toBe("auto");
    expect(getPatternSize("seigaiha")).toBe("auto");
    expect(getPatternSize("topography")).toBe("auto");
    expect(getPatternSize("diamonds")).toBe("auto");
    expect(getPatternSize("concentric-circles")).toBe("auto");
  });

  it("returns 'auto' for unknown pattern IDs", () => {
    expect(getPatternSize("nonexistent")).toBe("auto");
    expect(getPatternSize("")).toBe("auto");
  });
});

describe("getPatternPosition", () => {
  it("returns offset positions for multi-layer patterns", () => {
    expect(getPatternPosition("circuit-dots")).toBe("0 0, 15px 15px");
    expect(getPatternPosition("polka-dots")).toBe("0 0, 15px 15px");
  });

  it("returns '0 0' for single-layer patterns", () => {
    expect(getPatternPosition("dots")).toBe("0 0");
    expect(getPatternPosition("grid")).toBe("0 0");
    expect(getPatternPosition("pinstripe")).toBe("0 0");
  });

  it("returns '0 0' for unknown pattern IDs", () => {
    expect(getPatternPosition("nonexistent")).toBe("0 0");
    expect(getPatternPosition("")).toBe("0 0");
  });
});

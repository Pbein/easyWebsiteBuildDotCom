import { describe, it, expect } from "vitest";
import {
  THEME_PRESETS,
  LUXURY_DARK,
  MODERN_CLEAN,
  WARM_PROFESSIONAL,
  BOLD_CREATIVE,
  EDITORIAL,
  TECH_FORWARD,
  ORGANIC_NATURAL,
  getPresetById,
} from "@/lib/theme/presets";

describe("THEME_PRESETS", () => {
  it("contains exactly 7 presets", () => {
    expect(THEME_PRESETS).toHaveLength(7);
  });

  it("each preset has a unique id", () => {
    const ids = THEME_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(7);
  });

  it("each preset has required fields", () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.personalityVector).toHaveLength(6);
      expect(preset.tokens).toBeDefined();
      expect(preset.tokens.colorPrimary).toBeTruthy();
      expect(preset.tokens.fontHeading).toBeTruthy();
      expect(preset.tokens.fontBody).toBeTruthy();
    }
  });

  it("all personality vector values are between 0 and 1", () => {
    for (const preset of THEME_PRESETS) {
      for (const val of preset.personalityVector) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("individual presets", () => {
  it("LUXURY_DARK has dark background and gold primary", () => {
    expect(LUXURY_DARK.tokens.colorPrimary).toBe("#c9a55c");
    expect(LUXURY_DARK.tokens.colorBackground).toBe("#0c0f17");
    expect(LUXURY_DARK.tokens.fontHeading).toContain("Cormorant Garamond");
  });

  it("MODERN_CLEAN has white-ish background and blue primary", () => {
    expect(MODERN_CLEAN.tokens.colorPrimary).toBe("#2563eb");
    expect(MODERN_CLEAN.tokens.colorBackground).toBe("#fafafa");
    expect(MODERN_CLEAN.tokens.fontHeading).toContain("Sora");
  });

  it("WARM_PROFESSIONAL has warm tones", () => {
    expect(WARM_PROFESSIONAL.tokens.colorPrimary).toBe("#c67a4a");
    expect(WARM_PROFESSIONAL.tokens.fontHeading).toContain("Lora");
  });

  it("BOLD_CREATIVE has zero radius and vibrant colors", () => {
    expect(BOLD_CREATIVE.tokens.radiusMd).toBe("0px");
    expect(BOLD_CREATIVE.tokens.colorPrimary).toBe("#e040fb");
    expect(BOLD_CREATIVE.tokens.fontHeading).toContain("Oswald");
  });

  it("EDITORIAL has zero radius and red accent", () => {
    expect(EDITORIAL.tokens.radiusMd).toBe("0px");
    expect(EDITORIAL.tokens.colorPrimary).toBe("#d63031");
    expect(EDITORIAL.tokens.fontHeading).toContain("Libre Baskerville");
  });

  it("TECH_FORWARD has dark background and indigo primary", () => {
    expect(TECH_FORWARD.tokens.colorPrimary).toBe("#6366f1");
    expect(TECH_FORWARD.tokens.colorBackground).toBe("#0f1117");
    expect(TECH_FORWARD.tokens.fontAccent).toContain("JetBrains Mono");
  });

  it("ORGANIC_NATURAL has warm background and sage primary", () => {
    expect(ORGANIC_NATURAL.tokens.colorPrimary).toBe("#5f7a5e");
    expect(ORGANIC_NATURAL.tokens.fontHeading).toContain("Crimson Pro");
    expect(ORGANIC_NATURAL.tokens.radiusMd).toBe("12px");
  });
});

describe("getPresetById", () => {
  it("returns correct preset by ID", () => {
    expect(getPresetById("luxury-dark")).toBe(LUXURY_DARK);
    expect(getPresetById("modern-clean")).toBe(MODERN_CLEAN);
    expect(getPresetById("tech-forward")).toBe(TECH_FORWARD);
  });

  it("returns undefined for unknown ID", () => {
    expect(getPresetById("nonexistent")).toBeUndefined();
    expect(getPresetById("")).toBeUndefined();
  });

  it("finds all 7 presets by their IDs", () => {
    const ids = [
      "luxury-dark",
      "modern-clean",
      "warm-professional",
      "bold-creative",
      "editorial",
      "tech-forward",
      "organic-natural",
    ];
    for (const id of ids) {
      expect(getPresetById(id)).toBeDefined();
    }
  });
});

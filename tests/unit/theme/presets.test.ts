// tests/unit/theme/presets.test.ts
//
// Requirements-first tests for the theme preset system.
//
// @requirements
// - THEME_PRESETS contains exactly 7 presets with unique IDs
// - Each preset has all required token fields (colors, fonts) that are truthy
// - All personality vectors have 6 values, each between 0 and 1
// - All color tokens are valid CSS hex colors (#xxxxxx format)
// - All font tokens are non-empty strings
// - Dark presets have light text; light presets have dark text (readability invariant)
// - No two presets share the same primary color (visual distinctness)
// - All descriptions are meaningful (>20 chars, not placeholder)
// - getPresetById returns correct preset by ID, undefined for unknown/empty

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

/* ================================================================
 * Helper utilities
 * ================================================================ */

/** Validates that a string is a 7-character hex color (#rrggbb). */
function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

/**
 * Returns the relative luminance of a hex color (0 = black, 1 = white).
 * Used to determine whether a color is "light" or "dark" for readability checks.
 * Formula: sRGB linearization + ITU-R BT.709 luminance coefficients.
 */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearize = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** Returns true if a hex color is perceptually "dark" (luminance < 0.4). */
function isDarkColor(hex: string): boolean {
  return relativeLuminance(hex) < 0.4;
}

/** Returns true if a hex color is perceptually "light" (luminance > 0.4). */
function isLightColor(hex: string): boolean {
  return relativeLuminance(hex) > 0.4;
}

/* ================================================================
 * THEME_PRESETS collection contracts
 * ================================================================ */

describe("THEME_PRESETS collection", () => {
  // @requirement The system ships exactly 7 curated presets
  it("contains exactly 7 presets", () => {
    expect(THEME_PRESETS).toHaveLength(7);
  });

  // @requirement Each preset must have a unique identifier for lookup and selection
  it("each preset has a unique id", () => {
    const ids = THEME_PRESETS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(THEME_PRESETS.length);
  });

  // @requirement Every preset must produce a complete, usable theme
  // colorPrimary, colorBackground, fontHeading, fontBody are the minimum for rendering
  it("each preset has all required token fields (colorPrimary, colorBackground, fontHeading, fontBody)", () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.tokens.colorPrimary).toBeTruthy();
      expect(preset.tokens.colorBackground).toBeTruthy();
      expect(preset.tokens.fontHeading).toBeTruthy();
      expect(preset.tokens.fontBody).toBeTruthy();
    }
  });

  // @invariant Personality vectors drive theme generation; all 6 axes must be valid [0, 1]
  it("all personality vector values are between 0 and 1", () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.personalityVector).toHaveLength(6);
      for (const val of preset.personalityVector) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      }
    }
  });
});

/* ================================================================
 * Preset quality contracts
 *
 * These tests verify that presets produce valid, high-quality output
 * WITHOUT hardcoding exact hex values. If a preset's colors change
 * during tuning, these tests still pass as long as the output is valid.
 * ================================================================ */

describe("Preset quality contracts", () => {
  // @requirement All color tokens must be valid CSS hex colors for use in CSS variables
  // This catches accidental empty strings, typos, or non-hex format values.
  it("all color tokens are valid hex colors (#rrggbb)", () => {
    const colorTokenKeys = [
      "colorPrimary",
      "colorPrimaryLight",
      "colorPrimaryDark",
      "colorSecondary",
      "colorSecondaryLight",
      "colorAccent",
      "colorBackground",
      "colorSurface",
      "colorSurfaceElevated",
      "colorText",
      "colorTextSecondary",
      "colorTextOnPrimary",
      "colorTextOnDark",
      "colorBorder",
      "colorBorderLight",
    ] as const;

    for (const preset of THEME_PRESETS) {
      for (const key of colorTokenKeys) {
        const value = preset.tokens[key];
        expect(
          isValidHexColor(value),
          `${preset.id}.${key} = "${value}" is not a valid hex color`
        ).toBe(true);
      }
    }
  });

  // @requirement Font tokens must contain a real font family name, not be empty
  it("all font tokens are non-empty strings containing a font family name", () => {
    const fontTokenKeys = ["fontHeading", "fontBody", "fontAccent"] as const;

    for (const preset of THEME_PRESETS) {
      for (const key of fontTokenKeys) {
        const value = preset.tokens[key];
        expect(value.length).toBeGreaterThan(0);
        // Font values should contain a quoted or unquoted font family name
        // e.g., "'Cormorant Garamond', serif" or "'DM Sans', sans-serif"
        expect(
          value.includes(",") || value.length > 3,
          `${preset.id}.${key} = "${value}" doesn't look like a valid font stack`
        ).toBe(true);
      }
    }
  });

  // @invariant Dark-background presets must have light text for readability
  // If text is dark on a dark background, the site is unreadable.
  // Known dark presets: luxury-dark (#0c0f17), bold-creative (#0a0a0f), tech-forward (#0f1117)
  it("dark-background presets have light text color", () => {
    const darkPresets = [LUXURY_DARK, BOLD_CREATIVE, TECH_FORWARD];

    for (const preset of darkPresets) {
      expect(
        isDarkColor(preset.tokens.colorBackground),
        `${preset.id} background "${preset.tokens.colorBackground}" should be dark`
      ).toBe(true);
      expect(
        isLightColor(preset.tokens.colorText),
        `${preset.id} text "${preset.tokens.colorText}" should be light on dark background`
      ).toBe(true);
    }
  });

  // @invariant Light-background presets must have dark text for readability
  // Known light presets: modern-clean, warm-professional, editorial, organic-natural
  it("light-background presets have dark text color", () => {
    const lightPresets = [MODERN_CLEAN, WARM_PROFESSIONAL, EDITORIAL, ORGANIC_NATURAL];

    for (const preset of lightPresets) {
      expect(
        isLightColor(preset.tokens.colorBackground),
        `${preset.id} background "${preset.tokens.colorBackground}" should be light`
      ).toBe(true);
      expect(
        isDarkColor(preset.tokens.colorText),
        `${preset.id} text "${preset.tokens.colorText}" should be dark on light background`
      ).toBe(true);
    }
  });

  // @requirement Each preset must have a visually distinct primary color
  // If two presets share a primary color, they look too similar to users.
  it("each preset produces a distinct primary color (no two share the same)", () => {
    const primaries = THEME_PRESETS.map((p) => p.tokens.colorPrimary.toLowerCase());
    const uniquePrimaries = new Set(primaries);
    expect(uniquePrimaries.size).toBe(THEME_PRESETS.length);
  });

  // @invariant Descriptions should be meaningful, not placeholder text
  // A meaningful description helps users choose the right preset for their brand.
  it("all presets have descriptions longer than 20 characters", () => {
    for (const preset of THEME_PRESETS) {
      expect(
        preset.description.length,
        `${preset.id} description is too short (${preset.description.length} chars): "${preset.description}"`
      ).toBeGreaterThan(20);
    }
  });
});

/* ================================================================
 * getPresetById
 * ================================================================ */

describe("getPresetById", () => {
  // @requirement Must be able to look up each of the 7 presets by their known ID
  it("returns correct preset for each of the 7 known IDs", () => {
    const expectedMapping: Record<string, typeof LUXURY_DARK> = {
      "luxury-dark": LUXURY_DARK,
      "modern-clean": MODERN_CLEAN,
      "warm-professional": WARM_PROFESSIONAL,
      "bold-creative": BOLD_CREATIVE,
      editorial: EDITORIAL,
      "tech-forward": TECH_FORWARD,
      "organic-natural": ORGANIC_NATURAL,
    };

    for (const [id, expectedPreset] of Object.entries(expectedMapping)) {
      const result = getPresetById(id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(id);
      expect(result!.name).toBe(expectedPreset.name);
    }
  });

  // @boundary Unknown ID should return undefined, not throw
  it("returns undefined for unknown ID", () => {
    expect(getPresetById("nonexistent")).toBeUndefined();
    expect(getPresetById("dark-luxury")).toBeUndefined(); // reversed name
  });

  // @boundary Empty string should return undefined
  it("returns undefined for empty string", () => {
    expect(getPresetById("")).toBeUndefined();
  });

  // @requirement Returned preset is the SAME reference as the named export (not a copy)
  // This ensures getPresetById is a true lookup into the canonical THEME_PRESETS array,
  // and that modifications to the result would affect the original (or more importantly,
  // equality checks work with reference comparison).
  it("returned preset is the same reference as the named export", () => {
    expect(getPresetById("luxury-dark")).toBe(LUXURY_DARK);
    expect(getPresetById("modern-clean")).toBe(MODERN_CLEAN);
    expect(getPresetById("warm-professional")).toBe(WARM_PROFESSIONAL);
    expect(getPresetById("bold-creative")).toBe(BOLD_CREATIVE);
    expect(getPresetById("editorial")).toBe(EDITORIAL);
    expect(getPresetById("tech-forward")).toBe(TECH_FORWARD);
    expect(getPresetById("organic-natural")).toBe(ORGANIC_NATURAL);
  });
});

import { describe, it, expect } from "vitest";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import { deriveThemeFromPrimaryColor } from "@/lib/theme/derive-from-primary";
import { applyEmotionalOverrides } from "@/lib/theme/emotional-overrides";
import type { ThemeTokens, PersonalityVector } from "@/lib/theme/theme.types";

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;
const neutralVector: PersonalityVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

/** Helper: parse a CSS value like "5.75rem" or "300ms" into its numeric part */
function parseNumeric(value: string): number {
  return parseFloat(value);
}

describe("Theme Composition", () => {
  // ── generateThemeFromVector ──────────────────────────────────

  it("generates valid ThemeTokens with all required fields from a neutral vector", () => {
    const tokens = generateThemeFromVector(neutralVector);

    // Verify it has all the required ThemeTokens keys
    const requiredKeys: (keyof ThemeTokens)[] = [
      "colorPrimary",
      "colorBackground",
      "colorText",
      "fontHeading",
      "fontBody",
      "spaceSection",
      "spaceComponent",
      "spaceElement",
      "radiusSm",
      "radiusMd",
      "radiusLg",
      "shadowSm",
      "shadowMd",
      "transitionFast",
      "transitionBase",
      "transitionSlow",
      "easeDefault",
      "animationDistance",
      "animationScale",
    ];

    for (const key of requiredKeys) {
      expect(tokens[key]).toBeDefined();
      expect(typeof tokens[key]).toBe("string");
    }
  });

  it("tokens include required color fields as valid hex values", () => {
    const tokens = generateThemeFromVector(neutralVector);

    const colorFields: (keyof ThemeTokens)[] = [
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
      "colorBorder",
      "colorBorderLight",
    ];

    for (const field of colorFields) {
      expect(tokens[field]).toMatch(HEX_REGEX);
    }
  });

  it("tokens include required font fields as non-empty strings", () => {
    const tokens = generateThemeFromVector(neutralVector);

    expect(tokens.fontHeading).toBeTruthy();
    expect(tokens.fontHeading.length).toBeGreaterThan(0);
    expect(tokens.fontBody).toBeTruthy();
    expect(tokens.fontBody.length).toBeGreaterThan(0);
  });

  it("tokens include required spacing fields as valid rem values", () => {
    const tokens = generateThemeFromVector(neutralVector);

    expect(tokens.spaceSection).toMatch(/^[\d.]+rem$/);
    expect(tokens.spaceComponent).toMatch(/^[\d.]+rem$/);
    expect(tokens.spaceElement).toMatch(/^[\d.]+rem$/);
    expect(tokens.spaceTight).toMatch(/^[\d.]+rem$/);
  });

  // ── deriveThemeFromPrimaryColor ──────────────────────────────

  it("derives a theme from primary color with colorPrimary matching input hex", () => {
    const derived = deriveThemeFromPrimaryColor("#ff0000", neutralVector);

    expect(derived.colorPrimary).toBe("#ff0000");
  });

  it("derived theme includes harmonious colors that are valid hex values", () => {
    const derived = deriveThemeFromPrimaryColor("#ff0000", neutralVector);

    // These should all exist and be valid hex
    expect(derived.colorAccent).toBeDefined();
    expect(derived.colorAccent).toMatch(HEX_REGEX);

    expect(derived.colorBackground).toBeDefined();
    expect(derived.colorBackground).toMatch(HEX_REGEX);

    expect(derived.colorSurface).toBeDefined();
    expect(derived.colorSurface).toMatch(HEX_REGEX);

    expect(derived.colorSecondary).toBeDefined();
    expect(derived.colorSecondary).toMatch(HEX_REGEX);

    expect(derived.colorSecondaryLight).toBeDefined();
    expect(derived.colorSecondaryLight).toMatch(HEX_REGEX);
  });

  // ── applyEmotionalOverrides ──────────────────────────────────

  it("luxury emotional goal increases spacing values", () => {
    const base = generateThemeFromVector(neutralVector);
    const luxuryTokens = applyEmotionalOverrides(base, ["luxury"], []);

    // Luxury applies 1.15x to spaceSection and 1.1x to spaceComponent
    const baseSection = parseNumeric(base.spaceSection);
    const luxurySection = parseNumeric(luxuryTokens.spaceSection);
    expect(luxurySection).toBeGreaterThan(baseSection);

    const baseComponent = parseNumeric(base.spaceComponent);
    const luxuryComponent = parseNumeric(luxuryTokens.spaceComponent);
    expect(luxuryComponent).toBeGreaterThan(baseComponent);
  });

  it("energized emotional goal decreases transition times", () => {
    const base = generateThemeFromVector(neutralVector);
    const energizedTokens = applyEmotionalOverrides(base, ["energized"], []);

    // Energized applies 0.8x to transitionBase and 0.75x to transitionFast
    const baseTransition = parseNumeric(base.transitionBase);
    const energizedTransition = parseNumeric(energizedTokens.transitionBase);
    expect(energizedTransition).toBeLessThan(baseTransition);

    const baseFast = parseNumeric(base.transitionFast);
    const energizedFast = parseNumeric(energizedTokens.transitionFast);
    expect(energizedFast).toBeLessThan(baseFast);
  });

  it("corporate anti-reference adjusts radius to be rounder", () => {
    const base = generateThemeFromVector(neutralVector);
    const antiCorporateTokens = applyEmotionalOverrides(base, [], ["corporate"]);

    // Corporate anti-ref applies 1.3x to radiusSm and 1.25x to radiusMd
    const baseRadiusSm = parseNumeric(base.radiusSm);
    const overriddenRadiusSm = parseNumeric(antiCorporateTokens.radiusSm);
    expect(overriddenRadiusSm).toBeGreaterThan(baseRadiusSm);

    const baseRadiusMd = parseNumeric(base.radiusMd);
    const overriddenRadiusMd = parseNumeric(antiCorporateTokens.radiusMd);
    expect(overriddenRadiusMd).toBeGreaterThan(baseRadiusMd);
  });

  // ── Full 5-layer composition ──────────────────────────────────

  it("full composition: base -> emotional overrides -> derive from primary produces valid themed result", () => {
    // Layer 1: Generate base theme from personality vector
    const baseTokens = generateThemeFromVector(neutralVector);
    expect(baseTokens.colorPrimary).toMatch(HEX_REGEX);

    // Layer 2: Apply emotional overrides (luxury + trust goals, anti-corporate)
    const emotionalTokens = applyEmotionalOverrides(baseTokens, ["luxury"], ["corporate"]);

    // Verify emotional overrides increased spacing
    expect(parseNumeric(emotionalTokens.spaceSection)).toBeGreaterThan(
      parseNumeric(baseTokens.spaceSection)
    );
    // Verify anti-corporate increased radius
    expect(parseNumeric(emotionalTokens.radiusSm)).toBeGreaterThan(
      parseNumeric(baseTokens.radiusSm)
    );

    // Layer 3: Derive from a user-chosen primary color
    const userColor = "#2563eb"; // A blue
    const colorOverrides = deriveThemeFromPrimaryColor(userColor, neutralVector);
    expect(colorOverrides.colorPrimary).toBe(userColor);

    // Layer 4: Merge everything (simulating what AssemblyRenderer does)
    const finalTokens: ThemeTokens = {
      ...emotionalTokens,
      ...colorOverrides,
    };

    // Verify the final result has the user's primary color
    expect(finalTokens.colorPrimary).toBe(userColor);

    // Verify emotional overrides were preserved for non-color tokens
    expect(finalTokens.spaceSection).toBe(emotionalTokens.spaceSection);
    expect(finalTokens.radiusSm).toBe(emotionalTokens.radiusSm);

    // Verify all final tokens are valid
    expect(finalTokens.colorPrimary).toMatch(HEX_REGEX);
    expect(finalTokens.colorBackground).toMatch(HEX_REGEX);
    expect(finalTokens.colorText).toMatch(HEX_REGEX);
    expect(finalTokens.fontHeading.length).toBeGreaterThan(0);
    expect(finalTokens.fontBody.length).toBeGreaterThan(0);
    expect(finalTokens.spaceSection).toMatch(/^[\d.]+rem$/);
  });
});

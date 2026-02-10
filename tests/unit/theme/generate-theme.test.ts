import { describe, it, expect } from "vitest";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import type { PersonalityVector } from "@/lib/theme/theme.types";
import { PERSONALITY_VECTORS } from "../../helpers/fixtures";

describe("generateThemeFromVector", () => {
  it("returns a ThemeTokens object with all 66 required keys", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    const keys = Object.keys(tokens);
    expect(keys.length).toBe(66);
  });

  it("generates valid hex colors for all color tokens", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    const hexRegex = /^#[0-9a-f]{6}$/i;
    expect(tokens.colorPrimary).toMatch(hexRegex);
    expect(tokens.colorBackground).toMatch(hexRegex);
    expect(tokens.colorText).toMatch(hexRegex);
    expect(tokens.colorSecondary).toMatch(hexRegex);
    expect(tokens.colorAccent).toMatch(hexRegex);
  });

  it("produces dark backgrounds when lightBold >= 0.6", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.bold);
    // Dark backgrounds have low lightness values — the hex should be dark
    const bgHex = tokens.colorBackground;
    // Convert hex to rough brightness
    const r = parseInt(bgHex.slice(1, 3), 16);
    const g = parseInt(bgHex.slice(3, 5), 16);
    const b = parseInt(bgHex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    expect(brightness).toBeLessThan(80); // dark background
  });

  it("produces light backgrounds when lightBold < 0.6", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.light);
    const bgHex = tokens.colorBackground;
    const r = parseInt(bgHex.slice(1, 3), 16);
    const g = parseInt(bgHex.slice(3, 5), 16);
    const b = parseInt(bgHex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    expect(brightness).toBeGreaterThan(200); // light background
  });

  it("applies seed hue override", () => {
    const tokensA = generateThemeFromVector(PERSONALITY_VECTORS.balanced, { seedHue: 0 });
    const tokensB = generateThemeFromVector(PERSONALITY_VECTORS.balanced, { seedHue: 180 });
    expect(tokensA.colorPrimary).not.toBe(tokensB.colorPrimary);
  });

  it("applies token overrides", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced, {
      overrides: { colorPrimary: "#ff0000", fontHeading: "'CustomFont', serif" },
    });
    expect(tokens.colorPrimary).toBe("#ff0000");
    expect(tokens.fontHeading).toBe("'CustomFont', serif");
  });

  it("generates rem-based typography sizes", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    expect(tokens.textBase).toMatch(/rem$/);
    expect(tokens.textXs).toMatch(/rem$/);
    expect(tokens.text7xl).toMatch(/rem$/);
  });

  it("generates font family strings with fallbacks", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    expect(tokens.fontHeading).toContain(",");
    expect(tokens.fontBody).toContain(",");
  });

  it("produces faster transitions for dynamic personality", () => {
    const calmTokens = generateThemeFromVector([0.5, 0.5, 0.5, 0.5, 0.5, 0.0] as PersonalityVector);
    const dynamicTokens = generateThemeFromVector([
      0.5, 0.5, 0.5, 0.5, 0.5, 1.0,
    ] as PersonalityVector);
    const calmMs = parseInt(calmTokens.transitionBase);
    const dynamicMs = parseInt(dynamicTokens.transitionBase);
    expect(dynamicMs).toBeLessThan(calmMs);
  });

  it("produces larger radius for playful personality", () => {
    const playfulTokens = generateThemeFromVector(PERSONALITY_VECTORS.playful);
    const seriousTokens = generateThemeFromVector(PERSONALITY_VECTORS.serious);
    const playfulRadius = parseInt(playfulTokens.radiusMd);
    const seriousRadius = parseInt(seriousTokens.radiusMd);
    expect(playfulRadius).toBeGreaterThan(seriousRadius);
  });

  it("is deterministic — same input produces same output", () => {
    const tokensA = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    const tokensB = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    expect(tokensA).toEqual(tokensB);
  });

  it("generates valid spacing tokens in rem", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    expect(tokens.spaceSection).toMatch(/rem$/);
    expect(tokens.spaceComponent).toMatch(/rem$/);
    expect(tokens.spaceElement).toMatch(/rem$/);
    expect(tokens.spaceTight).toMatch(/rem$/);
  });

  it("generates container widths in px", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    expect(tokens.containerMax).toMatch(/px$/);
    expect(tokens.containerNarrow).toMatch(/px$/);
  });
});

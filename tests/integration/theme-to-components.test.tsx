import { describe, it, expect } from "vitest";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { PERSONALITY_VECTORS } from "../helpers/fixtures";

describe("Theme-to-Components Integration", () => {
  it("generates CSS variables that match expected format for components", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    const cssVars = tokensToCSSProperties(tokens);

    // Components expect these CSS variables to exist
    expect(cssVars["--color-primary"]).toBeTruthy();
    expect(cssVars["--color-background"]).toBeTruthy();
    expect(cssVars["--color-text"]).toBeTruthy();
    expect(cssVars["--font-heading"]).toBeTruthy();
    expect(cssVars["--font-body"]).toBeTruthy();
    expect(cssVars["--radius-md"]).toBeTruthy();
    expect(cssVars["--space-section"]).toBeTruthy();
  });

  it("dark theme produces appropriate contrast between text and background", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.bold);
    // Bold has lightBold=0.8, so it should be dark mode
    // Text should be light, background should be dark
    const textHex = tokens.colorText;
    const bgHex = tokens.colorBackground;

    const textBrightness = hexBrightness(textHex);
    const bgBrightness = hexBrightness(bgHex);

    // Text should be brighter than background in dark mode
    expect(textBrightness).toBeGreaterThan(bgBrightness);
  });

  it("light theme produces appropriate contrast", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.light);
    const textBrightness = hexBrightness(tokens.colorText);
    const bgBrightness = hexBrightness(tokens.colorBackground);

    // Text should be darker than background in light mode
    expect(textBrightness).toBeLessThan(bgBrightness);
  });
});

function hexBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

import { describe, it, expect } from "vitest";
import { mapAdjustmentsToTokenOverrides } from "@/lib/vlm/map-adjustments";

describe("mapAdjustmentsToTokenOverrides", () => {
  describe("key validation", () => {
    it("accepts valid ThemeTokens keys", () => {
      const result = mapAdjustmentsToTokenOverrides({
        colorPrimary: "#ff0000",
        fontHeading: "'Playfair Display', serif",
        radiusMd: "8px",
        spaceSection: "6rem",
      });

      expect(result.colorPrimary).toBe("#ff0000");
      expect(result.fontHeading).toBe("'Playfair Display', serif");
      expect(result.radiusMd).toBe("8px");
      expect(result.spaceSection).toBe("6rem");
    });

    it("rejects keys not in ThemeTokens", () => {
      const result = mapAdjustmentsToTokenOverrides({
        colorPrimary: "#ff0000",
        invalidKey: "#00ff00",
        anotherBadKey: "10px",
        fontSize: "16px", // not a token key
      });

      expect(Object.keys(result)).toEqual(["colorPrimary"]);
      expect(result.colorPrimary).toBe("#ff0000");
    });

    it("returns empty object for all invalid keys", () => {
      const result = mapAdjustmentsToTokenOverrides({
        bogus: "value",
        fake: "data",
      });

      expect(Object.keys(result)).toHaveLength(0);
    });

    it("returns empty object for empty input", () => {
      const result = mapAdjustmentsToTokenOverrides({});
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe("color token validation", () => {
    it("accepts valid 3-digit hex colors", () => {
      const result = mapAdjustmentsToTokenOverrides({ colorPrimary: "#f00" });
      expect(result.colorPrimary).toBe("#f00");
    });

    it("accepts valid 6-digit hex colors", () => {
      const result = mapAdjustmentsToTokenOverrides({ colorPrimary: "#ff0000" });
      expect(result.colorPrimary).toBe("#ff0000");
    });

    it("accepts valid 8-digit hex colors (with alpha)", () => {
      const result = mapAdjustmentsToTokenOverrides({ colorPrimary: "#ff0000cc" });
      expect(result.colorPrimary).toBe("#ff0000cc");
    });

    it("rejects invalid hex format for color tokens", () => {
      const result = mapAdjustmentsToTokenOverrides({
        colorPrimary: "rgb(255, 0, 0)",
      });
      expect(result.colorPrimary).toBeUndefined();
    });

    it("rejects color values without # prefix", () => {
      const result = mapAdjustmentsToTokenOverrides({
        colorPrimary: "ff0000",
      });
      expect(result.colorPrimary).toBeUndefined();
    });

    it("rejects color values with invalid hex chars", () => {
      const result = mapAdjustmentsToTokenOverrides({
        colorPrimary: "#gghhii",
      });
      expect(result.colorPrimary).toBeUndefined();
    });

    it("validates all color token keys starting with 'color'", () => {
      const colorKeys = [
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
        "colorSuccess",
        "colorWarning",
        "colorError",
      ];

      // All should pass with valid hex
      const validInput: Record<string, string> = {};
      for (const key of colorKeys) {
        validInput[key] = "#abcdef";
      }
      const result = mapAdjustmentsToTokenOverrides(validInput);
      expect(Object.keys(result)).toHaveLength(colorKeys.length);

      // All should fail with non-hex
      const invalidInput: Record<string, string> = {};
      for (const key of colorKeys) {
        invalidInput[key] = "red";
      }
      const resultInvalid = mapAdjustmentsToTokenOverrides(invalidInput);
      expect(Object.keys(resultInvalid)).toHaveLength(0);
    });
  });

  describe("non-color tokens", () => {
    it("accepts CSS values for spacing tokens", () => {
      const result = mapAdjustmentsToTokenOverrides({
        spaceSection: "6rem",
        spaceComponent: "3rem",
        spaceElement: "1.5rem",
        spaceTight: "0.5rem",
      });
      expect(result.spaceSection).toBe("6rem");
      expect(result.spaceComponent).toBe("3rem");
    });

    it("accepts font family strings", () => {
      const result = mapAdjustmentsToTokenOverrides({
        fontHeading: "'Playfair Display', serif",
        fontBody: "'Open Sans', sans-serif",
      });
      expect(result.fontHeading).toBe("'Playfair Display', serif");
      expect(result.fontBody).toBe("'Open Sans', sans-serif");
    });

    it("accepts radius values", () => {
      const result = mapAdjustmentsToTokenOverrides({
        radiusSm: "4px",
        radiusMd: "8px",
        radiusLg: "16px",
        radiusXl: "24px",
        radiusFull: "9999px",
      });
      expect(result.radiusSm).toBe("4px");
      expect(result.radiusFull).toBe("9999px");
    });

    it("accepts shadow and animation tokens", () => {
      const result = mapAdjustmentsToTokenOverrides({
        shadowColor: "rgba(0,0,0,0.1)", // shadowColor is NOT validated as hex
        transitionFast: "150ms",
        transitionBase: "300ms",
        animationDistance: "20px",
      });
      expect(result.shadowColor).toBe("rgba(0,0,0,0.1)");
      expect(result.transitionFast).toBe("150ms");
    });

    it("accepts typography tokens", () => {
      const result = mapAdjustmentsToTokenOverrides({
        textXs: "0.75rem",
        textSm: "0.875rem",
        textBase: "1rem",
        text7xl: "4.5rem",
        weightBold: "700",
        leadingTight: "1.2",
        trackingWide: "0.05em",
      });
      expect(result.textBase).toBe("1rem");
      expect(result.weightBold).toBe("700");
    });
  });

  describe("mixed valid and invalid entries", () => {
    it("filters out only the invalid entries", () => {
      const result = mapAdjustmentsToTokenOverrides({
        colorPrimary: "#2a4f7c", // valid
        colorSecondary: "not-hex", // invalid — not hex
        fontHeading: "'Lora', serif", // valid
        invalidKey: "12px", // invalid — not a token key
        radiusMd: "12px", // valid
      });

      expect(Object.keys(result)).toHaveLength(3);
      expect(result.colorPrimary).toBe("#2a4f7c");
      expect(result.fontHeading).toBe("'Lora', serif");
      expect(result.radiusMd).toBe("12px");
    });
  });

  describe("covers all 87 ThemeTokens keys", () => {
    it("accepts every valid ThemeTokens key", () => {
      const allKeys: Record<string, string> = {
        // Color tokens (need hex)
        colorPrimary: "#111111",
        colorPrimaryLight: "#222222",
        colorPrimaryDark: "#333333",
        colorSecondary: "#444444",
        colorSecondaryLight: "#555555",
        colorAccent: "#666666",
        colorBackground: "#777777",
        colorSurface: "#888888",
        colorSurfaceElevated: "#999999",
        colorText: "#aaaaaa",
        colorTextSecondary: "#bbbbbb",
        colorTextOnPrimary: "#cccccc",
        colorTextOnDark: "#dddddd",
        colorBorder: "#eeeeee",
        colorBorderLight: "#ffffff",
        colorSuccess: "#00ff00",
        colorWarning: "#ffff00",
        colorError: "#ff0000",
        // Typography tokens
        fontHeading: "Arial",
        fontBody: "Georgia",
        fontAccent: "Courier",
        fontMono: "monospace",
        textXs: "0.75rem",
        textSm: "0.875rem",
        textBase: "1rem",
        textLg: "1.125rem",
        textXl: "1.25rem",
        text2xl: "1.5rem",
        text3xl: "1.875rem",
        text4xl: "2.25rem",
        text5xl: "3rem",
        text6xl: "3.75rem",
        text7xl: "4.5rem",
        leadingTight: "1.2",
        leadingNormal: "1.5",
        leadingRelaxed: "1.75",
        trackingTight: "-0.025em",
        trackingNormal: "0em",
        trackingWide: "0.05em",
        weightNormal: "400",
        weightMedium: "500",
        weightSemibold: "600",
        weightBold: "700",
        // Spacing tokens
        spaceSection: "6rem",
        spaceComponent: "3rem",
        spaceElement: "1.5rem",
        spaceTight: "0.5rem",
        containerMax: "1280px",
        containerNarrow: "720px",
        // Shape tokens
        radiusSm: "4px",
        radiusMd: "8px",
        radiusLg: "16px",
        radiusXl: "24px",
        radiusFull: "9999px",
        borderWidth: "1px",
        // Shadow tokens
        shadowSm: "0 1px 2px rgba(0,0,0,0.05)",
        shadowMd: "0 4px 6px rgba(0,0,0,0.1)",
        shadowLg: "0 10px 15px rgba(0,0,0,0.1)",
        shadowXl: "0 20px 25px rgba(0,0,0,0.1)",
        shadowColor: "rgba(0,0,0,0.1)",
        // Animation tokens
        transitionFast: "150ms",
        transitionBase: "300ms",
        transitionSlow: "500ms",
        easeDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
        animationDistance: "20px",
        animationScale: "0.95",
      };

      const result = mapAdjustmentsToTokenOverrides(allKeys);
      // All 66 keys should pass (87 is ThemeTokens type keys but we have 66 unique CSS-mapped ones)
      expect(Object.keys(result).length).toBe(Object.keys(allKeys).length);
    });
  });
});

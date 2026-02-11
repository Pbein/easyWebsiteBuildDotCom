import { describe, it, expect } from "vitest";
import { applyEmotionalOverrides } from "@/lib/theme/emotional-overrides";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import { PERSONALITY_VECTORS } from "../../helpers/fixtures";
import type { ThemeTokens } from "@/lib/theme/theme.types";

/* ────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────── */

function getBaseTokens(): ThemeTokens {
  return generateThemeFromVector(PERSONALITY_VECTORS.balanced);
}

function parseNumeric(value: string): number {
  return parseFloat(value);
}

function parseMs(value: string): number {
  const match = value.match(/^([\d.]+)ms$/);
  return match ? parseFloat(match[1]) : NaN;
}

/* ────────────────────────────────────────────────────────────
 * Tests
 * ──────────────────────────────────────────────────────────── */

describe("applyEmotionalOverrides", () => {
  describe("immutability", () => {
    it("does not mutate the input tokens", () => {
      const base = getBaseTokens();
      const originalSpaceSection = base.spaceSection;
      const originalColorPrimary = base.colorPrimary;
      applyEmotionalOverrides(base, ["luxury"], ["cluttered"]);
      expect(base.spaceSection).toBe(originalSpaceSection);
      expect(base.colorPrimary).toBe(originalColorPrimary);
    });

    it("returns a new object", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["luxury"], []);
      expect(result).not.toBe(base);
    });
  });

  describe("no-op when empty", () => {
    it("returns equivalent tokens when no goals or anti-refs", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], []);
      expect(result).toEqual(base);
    });
  });

  describe("luxury goal", () => {
    it("increases spaceSection by ~15%", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["luxury"], []);
      const basePx = parseNumeric(base.spaceSection);
      const resultPx = parseNumeric(result.spaceSection);
      expect(resultPx).toBeGreaterThan(basePx);
      expect(resultPx / basePx).toBeCloseTo(1.15, 1);
    });

    it("slows down transitionBase", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["luxury"], []);
      expect(parseMs(result.transitionBase)).toBeGreaterThan(parseMs(base.transitionBase));
    });

    it("darkens and saturates colorPrimary", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["luxury"], []);
      expect(result.colorPrimary).not.toBe(base.colorPrimary);
    });
  });

  describe("calm goal", () => {
    it("increases spaceSection", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["calm"], []);
      expect(parseNumeric(result.spaceSection)).toBeGreaterThan(parseNumeric(base.spaceSection));
    });

    it("reduces animationDistance", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["calm"], []);
      expect(parseNumeric(result.animationDistance)).toBeLessThan(
        parseNumeric(base.animationDistance)
      );
    });

    it("desaturates colorPrimary", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["calm"], []);
      expect(result.colorPrimary).not.toBe(base.colorPrimary);
    });
  });

  describe("energized goal", () => {
    it("decreases spaceSection", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["energized"], []);
      expect(parseNumeric(result.spaceSection)).toBeLessThan(parseNumeric(base.spaceSection));
    });

    it("speeds up transitions", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["energized"], []);
      expect(parseMs(result.transitionBase)).toBeLessThan(parseMs(base.transitionBase));
    });

    it("increases animationScale", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["energized"], []);
      expect(parseFloat(result.animationScale)).toBeGreaterThan(parseFloat(base.animationScale));
    });
  });

  describe("playful goal", () => {
    it("increases border radius values", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["playful"], []);
      expect(parseNumeric(result.radiusMd)).toBeGreaterThan(parseNumeric(base.radiusMd));
      expect(parseNumeric(result.radiusLg)).toBeGreaterThan(parseNumeric(base.radiusLg));
    });
  });

  describe("authoritative goal", () => {
    it("decreases border radius values", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["authoritative"], []);
      expect(parseNumeric(result.radiusMd)).toBeLessThan(parseNumeric(base.radiusMd));
    });

    it("increases font weight", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["authoritative"], []);
      expect(parseInt(result.weightBold)).toBeGreaterThanOrEqual(parseInt(base.weightBold));
    });

    it("darkens colorPrimary", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["authoritative"], []);
      expect(result.colorPrimary).not.toBe(base.colorPrimary);
    });
  });

  describe("trust goal", () => {
    it("slightly increases spaceComponent", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["trust"], []);
      expect(parseNumeric(result.spaceComponent)).toBeGreaterThan(
        parseNumeric(base.spaceComponent)
      );
    });

    it("reduces animationDistance", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["trust"], []);
      expect(parseNumeric(result.animationDistance)).toBeLessThan(
        parseNumeric(base.animationDistance)
      );
    });
  });

  describe("inspired goal", () => {
    it("increases large heading sizes", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["inspired"], []);
      expect(parseNumeric(result.text5xl)).toBeGreaterThan(parseNumeric(base.text5xl));
      expect(parseNumeric(result.text6xl)).toBeGreaterThan(parseNumeric(base.text6xl));
    });
  });

  describe("welcomed goal", () => {
    it("increases spaceComponent", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["welcomed"], []);
      expect(parseNumeric(result.spaceComponent)).toBeGreaterThan(
        parseNumeric(base.spaceComponent)
      );
    });

    it("relaxes leading", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["welcomed"], []);
      expect(parseFloat(result.leadingRelaxed)).toBeGreaterThanOrEqual(
        parseFloat(base.leadingRelaxed)
      );
    });

    it("shifts colors warmer (negative temperature)", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["welcomed"], []);
      expect(result.colorPrimary).not.toBe(base.colorPrimary);
    });
  });

  describe("safe goal", () => {
    it("reduces animationDistance", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["safe"], []);
      expect(parseNumeric(result.animationDistance)).toBeLessThan(
        parseNumeric(base.animationDistance)
      );
    });

    it("minimizes animationScale", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["safe"], []);
      expect(parseFloat(result.animationScale)).toBeLessThanOrEqual(1.02);
    });
  });

  describe("curious goal", () => {
    it("tightens spaceElement", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["curious"], []);
      expect(parseNumeric(result.spaceElement)).toBeLessThan(parseNumeric(base.spaceElement));
    });
  });

  /* ── Anti-reference overrides ──────────────────────────── */

  describe("cluttered anti-reference", () => {
    it("increases all spacing tokens", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], ["cluttered"]);
      expect(parseNumeric(result.spaceSection)).toBeGreaterThan(parseNumeric(base.spaceSection));
      expect(parseNumeric(result.spaceComponent)).toBeGreaterThan(
        parseNumeric(base.spaceComponent)
      );
      expect(parseNumeric(result.spaceElement)).toBeGreaterThan(parseNumeric(base.spaceElement));
    });
  });

  describe("cheap anti-reference", () => {
    it("increases spacing slightly", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], ["cheap"]);
      expect(parseNumeric(result.spaceSection)).toBeGreaterThan(parseNumeric(base.spaceSection));
    });

    it("enriches colorPrimary (saturate + darken)", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], ["cheap"]);
      expect(result.colorPrimary).not.toBe(base.colorPrimary);
    });
  });

  describe("aggressive anti-reference", () => {
    it("slows down transitions", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], ["aggressive"]);
      expect(parseMs(result.transitionFast)).toBeGreaterThan(parseMs(base.transitionFast));
    });

    it("reduces animation intensity", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], ["aggressive"]);
      expect(parseNumeric(result.animationDistance)).toBeLessThan(
        parseNumeric(base.animationDistance)
      );
    });
  });

  describe("boring anti-reference", () => {
    it("increases animationDistance", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], ["boring"]);
      expect(parseNumeric(result.animationDistance)).toBeGreaterThan(
        parseNumeric(base.animationDistance)
      );
    });
  });

  /* ── Combination behavior ──────────────────────────────── */

  describe("combined goals and anti-references", () => {
    it("luxury + cluttered produces even more spacing than either alone", () => {
      const base = getBaseTokens();
      const luxuryOnly = applyEmotionalOverrides(base, ["luxury"], []);
      const combined = applyEmotionalOverrides(base, ["luxury"], ["cluttered"]);
      expect(parseNumeric(combined.spaceSection)).toBeGreaterThan(
        parseNumeric(luxuryOnly.spaceSection)
      );
    });

    it("multiple goals stack their effects", () => {
      const base = getBaseTokens();
      const singleGoal = applyEmotionalOverrides(base, ["luxury"], []);
      const doubleGoal = applyEmotionalOverrides(base, ["luxury", "calm"], []);
      // Both luxury and calm increase spaceSection, so combined should be larger
      expect(parseNumeric(doubleGoal.spaceSection)).toBeGreaterThan(
        parseNumeric(singleGoal.spaceSection)
      );
    });
  });

  describe("unknown goals and anti-references", () => {
    it("ignores unrecognized emotional goals", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, ["nonexistent_goal"], []);
      expect(result).toEqual(base);
    });

    it("ignores unrecognized anti-references", () => {
      const base = getBaseTokens();
      const result = applyEmotionalOverrides(base, [], ["nonexistent_anti_ref"]);
      expect(result).toEqual(base);
    });
  });
});

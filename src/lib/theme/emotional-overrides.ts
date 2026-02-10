import chroma from "chroma-js";
import type { ThemeTokens } from "./theme.types";

/**
 * Applies subtle adjustments (5-20% deltas) to theme tokens
 * based on emotional goals and anti-references.
 * Now includes COLOR overrides alongside spacing/animation/shape.
 *
 * Returns a new ThemeTokens object — does not mutate the input.
 */
export function applyEmotionalOverrides(
  baseTokens: ThemeTokens,
  emotionalGoals: string[],
  antiReferences: string[]
): ThemeTokens {
  const tokens = { ...baseTokens };

  // Helper to scale a CSS value like "96px" by a multiplier
  const scaleValue = (value: string, multiplier: number): string => {
    const match = value.match(/^([\d.]+)(px|rem|em|%)$/);
    if (!match) return value;
    const num = parseFloat(match[1]) * multiplier;
    return `${Math.round(num * 100) / 100}${match[2]}`;
  };

  // Helper to scale a transition value like "200ms"
  const scaleTransition = (value: string, multiplier: number): string => {
    const match = value.match(/^([\d.]+)(ms|s)$/);
    if (!match) return value;
    const num = parseFloat(match[1]) * multiplier;
    return `${Math.round(num)}${match[2]}`;
  };

  // Helper to safely adjust a hex color
  const adjustColor = (
    hex: string,
    adjustments: { saturate?: number; darken?: number; brighten?: number; temperature?: number }
  ): string => {
    try {
      let c = chroma(hex);
      if (adjustments.saturate) c = c.saturate(adjustments.saturate);
      if (adjustments.darken) c = c.darken(adjustments.darken);
      if (adjustments.brighten) c = c.brighten(adjustments.brighten);
      if (adjustments.temperature) {
        // Shift hue toward warm (decrease) or cool (increase)
        const [h, s, l] = c.hsl();
        const newHue = ((h || 0) + adjustments.temperature) % 360;
        c = chroma.hsl(newHue < 0 ? newHue + 360 : newHue, s, l);
      }
      return c.hex();
    } catch {
      return hex;
    }
  };

  // ── Emotional goal overrides ──────────────────────────────

  for (const goal of emotionalGoals) {
    switch (goal) {
      case "luxury":
        // More breathing room, slower transitions, deeper/richer colors
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.15);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.1);
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.2);
        tokens.transitionSlow = scaleTransition(tokens.transitionSlow, 1.15);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.3, darken: 0.2 });
        tokens.colorPrimaryDark = adjustColor(tokens.colorPrimaryDark, {
          saturate: 0.2,
          darken: 0.15,
        });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.4 });
        break;

      case "calm":
        // Increase spacing, slow transitions, desaturate and soften colors
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.12);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.08);
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.3);
        tokens.transitionFast = scaleTransition(tokens.transitionFast, 1.2);
        tokens.animationDistance = scaleValue(tokens.animationDistance, 0.7);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: -0.2, brighten: 0.1 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: -0.15 });
        break;

      case "energized":
        // Decrease spacing slightly, speed up transitions, boost saturation
        tokens.spaceSection = scaleValue(tokens.spaceSection, 0.92);
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 0.8);
        tokens.transitionFast = scaleTransition(tokens.transitionFast, 0.75);
        tokens.animationDistance = scaleValue(tokens.animationDistance, 1.3);
        tokens.animationScale = "1.05";
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.4 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.3, brighten: 0.15 });
        break;

      case "playful":
        // Increase border radius
        tokens.radiusSm = scaleValue(tokens.radiusSm, 1.3);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 1.25);
        tokens.radiusLg = scaleValue(tokens.radiusLg, 1.2);
        tokens.radiusXl = scaleValue(tokens.radiusXl, 1.15);
        break;

      case "authoritative":
        // Decrease border radius, increase font weight, deepen primary
        tokens.radiusSm = scaleValue(tokens.radiusSm, 0.7);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 0.75);
        tokens.radiusLg = scaleValue(tokens.radiusLg, 0.8);
        tokens.weightBold = "800";
        tokens.weightSemibold = "700";
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { darken: 0.25 });
        break;

      case "trust":
        // Slightly more spacing, stable animations, subtle blue shift
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.05);
        tokens.animationDistance = scaleValue(tokens.animationDistance, 0.85);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: 10 });
        break;

      case "inspired":
        // Larger headings, more dynamic, richer accent color
        tokens.text5xl = scaleValue(tokens.text5xl, 1.08);
        tokens.text6xl = scaleValue(tokens.text6xl, 1.08);
        tokens.animationScale = "1.04";
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.3, brighten: 0.1 });
        break;

      case "welcomed":
        // Warmer spacing, relaxed leading, warmer color shift
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.06);
        tokens.leadingRelaxed = "1.85";
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -15 });
        tokens.colorBackground = adjustColor(tokens.colorBackground, { temperature: -5 });
        break;

      case "safe":
        // More consistent, less dramatic
        tokens.animationDistance = scaleValue(tokens.animationDistance, 0.8);
        tokens.animationScale = "1.01";
        break;

      case "curious":
        // Slightly tighter spacing to pull people in
        tokens.spaceElement = scaleValue(tokens.spaceElement, 0.95);
        tokens.animationDistance = scaleValue(tokens.animationDistance, 1.1);
        break;
    }
  }

  // ── Anti-reference overrides ──────────────────────────────

  for (const antiRef of antiReferences) {
    switch (antiRef) {
      case "cluttered":
        // Ensure generous spacing
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.1);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.08);
        tokens.spaceElement = scaleValue(tokens.spaceElement, 1.05);
        break;

      case "cheap":
        // Ensure refined radius, generous spacing, and richer colors
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.05);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.05);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2, darken: 0.1 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.15 });
        break;

      case "aggressive":
        // Slow down transitions, reduce animation intensity
        tokens.transitionFast = scaleTransition(tokens.transitionFast, 1.2);
        tokens.animationDistance = scaleValue(tokens.animationDistance, 0.8);
        tokens.animationScale = "1.02";
        break;

      case "boring":
        // Increase animation slightly to add interest
        tokens.animationDistance = scaleValue(tokens.animationDistance, 1.15);
        tokens.animationScale = "1.03";
        break;
    }
  }

  return tokens;
}

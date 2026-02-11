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
      // Universal negatives
      case "corporate":
        // Anti-corporate: warmer colors, rounder shapes, relaxed spacing
        tokens.radiusSm = scaleValue(tokens.radiusSm, 1.3);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 1.25);
        tokens.radiusLg = scaleValue(tokens.radiusLg, 1.2);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -10 });
        tokens.colorBackground = adjustColor(tokens.colorBackground, { temperature: -5 });
        tokens.leadingRelaxed = "1.85";
        break;

      case "cheap":
        // Anti-cheap: richer colors, more spacing, refined shadows
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.08);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.06);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.25, darken: 0.1 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.2 });
        break;

      case "generic":
        // Anti-generic: boost saturation, add stronger contrast
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.3 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.25, brighten: 0.1 });
        tokens.weightBold = "800";
        break;

      // Aesthetic trade-offs
      case "minimalist":
        // Anti-minimalist: richer surfaces, more shadows, tighter spacing
        tokens.spaceSection = scaleValue(tokens.spaceSection, 0.9);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 0.92);
        tokens.borderWidth = scaleValue(tokens.borderWidth, 1.5);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2 });
        break;

      case "maximalist":
        // Anti-maximalist: generous spacing, minimal shadows, clean surfaces
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.12);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.1);
        tokens.spaceElement = scaleValue(tokens.spaceElement, 1.08);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: -0.15 });
        break;

      case "traditional":
        // Anti-traditional: modern radius, bolder weights, cooler temps
        tokens.radiusSm = scaleValue(tokens.radiusSm, 1.4);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 1.3);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: 15 });
        tokens.weightBold = "800";
        tokens.trackingTight = "-0.03em";
        break;

      case "trendy":
        // Anti-trendy: classic proportions, serif-friendly spacing, muted palette
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: -0.15, darken: 0.1 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: -0.1 });
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.15);
        tokens.leadingRelaxed = "1.85";
        break;

      case "playful":
        // Anti-playful: sharper radius, deeper colors, tighter leading
        tokens.radiusSm = scaleValue(tokens.radiusSm, 0.6);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 0.65);
        tokens.radiusLg = scaleValue(tokens.radiusLg, 0.7);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { darken: 0.15 });
        tokens.leadingTight = "1.15";
        break;

      case "formal":
        // Anti-formal: warmer palette, rounder shapes, relaxed weight
        tokens.radiusSm = scaleValue(tokens.radiusSm, 1.35);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 1.3);
        tokens.radiusLg = scaleValue(tokens.radiusLg, 1.25);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -12 });
        tokens.colorBackground = adjustColor(tokens.colorBackground, { temperature: -5 });
        tokens.weightBold = "600";
        break;

      case "dramatic":
        // Anti-dramatic: slower transitions, muted animations, steady palette
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.3);
        tokens.transitionFast = scaleTransition(tokens.transitionFast, 1.25);
        tokens.animationDistance = scaleValue(tokens.animationDistance, 0.6);
        tokens.animationScale = "1.01";
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: -0.2 });
        break;

      // ── Industry-specific anti-references ────────────────────

      case "fast-food":
      case "cafeteria":
      case "chain-restaurant":
        // Anti-fast-food/cafeteria/chain: richer colors, more spacing, refined feel
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.1);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.08);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2, darken: 0.1 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.15 });
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.1);
        break;

      case "budget-salon":
        // Anti-budget-salon: premium spacing, richer surfaces, deeper colors
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.12);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.1);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.25, darken: 0.15 });
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.15);
        break;

      case "medical-clinic":
        // Anti-clinical: warmer palette, rounder shapes, relaxed transitions
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -15 });
        tokens.colorBackground = adjustColor(tokens.colorBackground, { temperature: -8 });
        tokens.radiusSm = scaleValue(tokens.radiusSm, 1.25);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 1.2);
        break;

      case "call-center":
        // Anti-call-center: warmer palette, personal feel
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -10 });
        tokens.leadingRelaxed = "1.85";
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.06);
        break;

      case "stock-agency":
        // Anti-stock: bolder weights, richer accent, more personality
        tokens.weightBold = "800";
        tokens.colorAccent = adjustColor(tokens.colorAccent, { saturate: 0.3, brighten: 0.1 });
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2 });
        break;

      case "snapshot-studio":
      case "student-project":
        // Anti-snapshot/student: premium feel, refined spacing, deeper colors
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.08);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.15, darken: 0.1 });
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.1);
        break;

      case "flea-market":
      case "dropship":
        // Anti-flea-market/dropship: premium spacing, richer palette
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.1);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.08);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2, darken: 0.1 });
        break;

      case "mega-retailer":
        // Anti-mega-retailer: warmer, more personal, rounder shapes
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -10 });
        tokens.radiusSm = scaleValue(tokens.radiusSm, 1.2);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 1.15);
        tokens.leadingRelaxed = "1.85";
        break;

      case "content-farm":
        // Anti-content-farm: richer typography, more spacing, bolder contrast
        tokens.weightBold = "800";
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.08);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2 });
        break;

      case "news-wire":
        // Anti-news-wire: warmer palette, relaxed leading
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -10 });
        tokens.leadingRelaxed = "1.85";
        break;

      case "government-agency":
        // Anti-government: warmer, rounder, friendlier
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { temperature: -12 });
        tokens.radiusSm = scaleValue(tokens.radiusSm, 1.3);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 1.25);
        tokens.weightBold = "600";
        break;

      case "charity-guilt":
        // Anti-guilt-trip: brighter, more hopeful palette
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { brighten: 0.15 });
        tokens.colorAccent = adjustColor(tokens.colorAccent, { brighten: 0.1, saturate: 0.15 });
        break;

      case "textbook":
        // Anti-textbook: richer colors, tighter spacing, modern feel
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2 });
        tokens.spaceSection = scaleValue(tokens.spaceSection, 0.92);
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 0.85);
        break;

      case "children-site":
        // Anti-children's-site: deeper, more serious palette, sharper shapes
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { darken: 0.15, saturate: -0.1 });
        tokens.radiusSm = scaleValue(tokens.radiusSm, 0.7);
        tokens.radiusMd = scaleValue(tokens.radiusMd, 0.75);
        break;

      case "ticket-booth":
        // Anti-ticket-booth: more spacing, richer experience feel
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.1);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.15 });
        break;

      case "flyer":
        // Anti-flyer: premium spacing, refined transitions, deeper colors
        tokens.spaceSection = scaleValue(tokens.spaceSection, 1.12);
        tokens.spaceComponent = scaleValue(tokens.spaceComponent, 1.08);
        tokens.colorPrimary = adjustColor(tokens.colorPrimary, { saturate: 0.2, darken: 0.1 });
        tokens.transitionBase = scaleTransition(tokens.transitionBase, 1.15);
        break;
    }
  }

  return tokens;
}

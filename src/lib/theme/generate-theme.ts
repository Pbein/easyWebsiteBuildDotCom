import chroma from "chroma-js";
import type { PersonalityVector, ThemeTokens } from "./theme.types";
import { clamp, lerp } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
 * Curated font pairings mapped by personality feel.
 * Each entry: [headingFont, bodyFont]
 * ──────────────────────────────────────────────────────────── */

interface FontPairing {
  id: string;
  heading: string;
  body: string;
  accent: string;
  seriousness: [number, number]; // range of axis-1 values
  era: [number, number]; // range of axis-4 (classic_modern)
  businessTypes?: string[]; // business types this pairing suits well
}

const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "luxury-serif",
    heading: "'Cormorant Garamond', serif",
    body: "'Outfit', sans-serif",
    accent: "'Cormorant Garamond', serif",
    seriousness: [0.7, 1.0],
    era: [0.0, 0.4],
    businessTypes: ["restaurant", "spa"],
  },
  {
    id: "editorial-serif",
    heading: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
    accent: "'Playfair Display', serif",
    seriousness: [0.6, 1.0],
    era: [0.0, 0.5],
    businessTypes: ["restaurant", "photography"],
  },
  {
    id: "classic-serif",
    heading: "'Libre Baskerville', serif",
    body: "'Nunito Sans', sans-serif",
    accent: "'Libre Baskerville', serif",
    seriousness: [0.5, 1.0],
    era: [0.0, 0.4],
  },
  {
    id: "corporate-sans",
    heading: "'Sora', sans-serif",
    body: "'DM Sans', sans-serif",
    accent: "'Sora', sans-serif",
    seriousness: [0.5, 1.0],
    era: [0.6, 1.0],
    businessTypes: ["business", "ecommerce"],
  },
  {
    id: "clean-sans",
    heading: "'Manrope', sans-serif",
    body: "'Karla', sans-serif",
    accent: "'Manrope', sans-serif",
    seriousness: [0.4, 0.8],
    era: [0.5, 1.0],
  },
  {
    id: "creative-display",
    heading: "'Space Grotesk', sans-serif",
    body: "'Outfit', sans-serif",
    accent: "'Space Grotesk', sans-serif",
    seriousness: [0.0, 0.5],
    era: [0.6, 1.0],
  },
  {
    id: "warm-traditional",
    heading: "'Lora', serif",
    body: "'Merriweather Sans', sans-serif",
    accent: "'Lora', serif",
    seriousness: [0.3, 0.7],
    era: [0.0, 0.5],
    businessTypes: ["nonprofit", "educational"],
  },
  {
    id: "warm-classic",
    heading: "'Crimson Pro', serif",
    body: "'Work Sans', sans-serif",
    accent: "'Crimson Pro', serif",
    seriousness: [0.3, 0.7],
    era: [0.0, 0.5],
    businessTypes: ["spa"],
  },
  {
    id: "bold-impact",
    heading: "'Oswald', sans-serif",
    body: "'Lato', sans-serif",
    accent: "'Oswald', sans-serif",
    seriousness: [0.0, 0.5],
    era: [0.4, 0.9],
    businessTypes: ["event"],
  },
  {
    id: "tech-mono",
    heading: "'JetBrains Mono', monospace",
    body: "'DM Sans', sans-serif",
    accent: "'JetBrains Mono', monospace",
    seriousness: [0.5, 1.0],
    era: [0.8, 1.0],
  },
  // New pairings for underserved business categories
  {
    id: "hospitality-serif",
    heading: "'DM Serif Display', serif",
    body: "'Jost', sans-serif",
    accent: "'DM Serif Display', serif",
    seriousness: [0.5, 0.9],
    era: [0.2, 0.6],
    businessTypes: ["restaurant", "booking", "event"],
  },
  {
    id: "wellness-organic",
    heading: "'Fraunces', serif",
    body: "'Atkinson Hyperlegible', sans-serif",
    accent: "'Fraunces', serif",
    seriousness: [0.3, 0.7],
    era: [0.2, 0.6],
    businessTypes: ["spa", "nonprofit"],
  },
  {
    id: "creative-agency",
    heading: "'Clash Display', sans-serif",
    body: "'Satoshi', sans-serif",
    accent: "'Clash Display', sans-serif",
    seriousness: [0.0, 0.5],
    era: [0.7, 1.0],
    businessTypes: ["portfolio", "photography"],
  },
  {
    id: "boutique-fashion",
    heading: "'Bodoni Moda', serif",
    body: "'Figtree', sans-serif",
    accent: "'Bodoni Moda', serif",
    seriousness: [0.6, 1.0],
    era: [0.1, 0.5],
    businessTypes: ["ecommerce", "portfolio"],
  },
];

/* ────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────── */

/** Pick the best font pairing for the given personality + optional business type. */
function selectFontPairing(pv: PersonalityVector, businessType?: string): FontPairing {
  const seriousness = pv[1];
  const era = pv[4];

  // Score each pairing by how close the personality sits within its ranges
  let best = FONT_PAIRINGS[0];
  let bestScore = -Infinity;

  for (const pairing of FONT_PAIRINGS) {
    const sMid = (pairing.seriousness[0] + pairing.seriousness[1]) / 2;
    const eMid = (pairing.era[0] + pairing.era[1]) / 2;

    // Within-range bonus + proximity score
    const sInRange = seriousness >= pairing.seriousness[0] && seriousness <= pairing.seriousness[1];
    const eInRange = era >= pairing.era[0] && era <= pairing.era[1];

    let score =
      (sInRange ? 2 : 0) + (eInRange ? 2 : 0) - Math.abs(seriousness - sMid) - Math.abs(era - eMid);

    // Business type bonus: +1.5 if this pairing explicitly suits the business type
    if (businessType && pairing.businessTypes?.includes(businessType)) {
      score += 1.5;
    }

    if (score > bestScore) {
      bestScore = score;
      best = pairing;
    }
  }

  return best;
}

/**
 * Compute the dark-mode threshold based on business type.
 * Base threshold 0.6 (unchanged), adjusted by business type ±0.15.
 * Fine dining/luxury leans dark (lower threshold), wellness leans light (higher).
 */
function getDarkModeThreshold(businessType?: string): number {
  const BASE = 0.6;

  // Business type nudges (± up to 0.15)
  const businessNudge: Record<string, number> = {
    restaurant: -0.12, // Fine dining leans dark
    spa: 0.08, // Wellness leans light
    photography: -0.05, // Moody studio aesthetic
    ecommerce: 0.05, // Products need clean light backgrounds
    nonprofit: 0.08, // Warm & accessible → light
    educational: 0.08, // Clean & readable → light
    event: -0.05, // Dramatic/dark works for events
    booking: 0.0, // Neutral
    business: 0.0, // Neutral
    portfolio: -0.05, // Creative portfolios can go dark
  };

  const nudge = (businessType && businessNudge[businessType]) || 0;
  return clamp(BASE + nudge, 0.35, 0.85);
}

/** Generate a harmonious palette from a seed hue + personality + optional industry nudge. */
function generatePalette(pv: PersonalityVector, seedHue?: number, businessType?: string) {
  const [minRich, , warmCool, lightBold] = pv;

  // Default seed hue: warm personalities lean amber/red, cool lean blue/teal
  let hue = seedHue ?? lerp(30, 220, warmCool);

  // Industry hue nudge: blend personality hue with industry-appropriate hue (70/30)
  if (!seedHue && businessType && INDUSTRY_HUE_NUDGE[businessType] !== undefined) {
    const industryHue = INDUSTRY_HUE_NUDGE[businessType];
    hue = (hue * 0.7 + industryHue * 0.3) % 360;
  }

  // Saturation: playful + rich = high saturation; serious + minimal = low
  const baseSaturation = lerp(0.35, 0.75, (1 - pv[1] + minRich) / 2);

  // Lightness of the primary
  const primaryLightness = lerp(0.45, 0.55, 0.5);

  const primary = chroma.hsl(hue, baseSaturation, primaryLightness);
  const primaryLight = primary.brighten(1.2);
  const primaryDark = primary.darken(1.2);

  // Secondary: complementary or analogous based on richness
  const secondaryHueShift = lerp(30, 180, minRich);
  const secondary = chroma.hsl(
    (hue + secondaryHueShift) % 360,
    baseSaturation * 0.8,
    primaryLightness
  );
  const secondaryLight = secondary.brighten(1.5);

  // Accent: triadic offset
  const accent = chroma.hsl((hue + 120) % 360, clamp(baseSaturation + 0.15, 0, 1), 0.55);

  // Backgrounds: controlled by lightBold axis, biased by business type + emotional goals
  const darkThreshold = getDarkModeThreshold(businessType);
  const isDark = lightBold >= darkThreshold;

  let bg: chroma.Color;
  let surface: chroma.Color;
  let surfaceElevated: chroma.Color;
  let text: chroma.Color;
  let textSecondary: chroma.Color;
  let border: chroma.Color;
  let borderLight: chroma.Color;

  if (isDark) {
    // Dark backgrounds — tinted toward warm or cool
    const bgHue = lerp(hue, (hue + 240) % 360, warmCool);
    bg = chroma.hsl(bgHue, 0.08, lerp(0.06, 0.1, 1 - lightBold));
    surface = bg.brighten(0.4);
    surfaceElevated = bg.brighten(0.7);
    text = chroma.hsl(bgHue, 0.05, 0.92);
    textSecondary = chroma.hsl(bgHue, 0.05, 0.6);
    border = chroma.hsl(bgHue, 0.08, 0.2);
    borderLight = chroma.hsl(bgHue, 0.06, 0.14);
  } else {
    // Light backgrounds
    const bgHue = lerp(hue, 40, warmCool < 0.5 ? 1 - warmCool : 0);
    bg = chroma.hsl(bgHue, lerp(0.02, 0.08, 1 - warmCool), lerp(0.97, 0.99, lightBold));
    surface = chroma.hsl(bgHue, 0.03, 0.995);
    surfaceElevated = chroma("#ffffff");
    text = chroma.hsl(bgHue, 0.1, lerp(0.12, 0.08, lightBold));
    textSecondary = chroma.hsl(bgHue, 0.05, 0.45);
    border = chroma.hsl(bgHue, 0.06, 0.86);
    borderLight = chroma.hsl(bgHue, 0.04, 0.92);
  }

  // Text on primary / dark
  const textOnPrimary = chroma.contrast(primary, chroma("white")) > 3 ? "#ffffff" : "#111111";

  const textOnDark = isDark ? text.hex() : "#f5f5f5";

  // Shadow color tinted to primary
  const shadowColor = isDark ? primary.alpha(0.15).css() : chroma(text).alpha(0.08).css();

  return {
    colorPrimary: primary.hex(),
    colorPrimaryLight: primaryLight.hex(),
    colorPrimaryDark: primaryDark.hex(),
    colorSecondary: secondary.hex(),
    colorSecondaryLight: secondaryLight.hex(),
    colorAccent: accent.hex(),
    colorBackground: bg.hex(),
    colorSurface: surface.hex(),
    colorSurfaceElevated: surfaceElevated.hex(),
    colorText: text.hex(),
    colorTextSecondary: textSecondary.hex(),
    colorTextOnPrimary: textOnPrimary,
    colorTextOnDark: textOnDark,
    colorBorder: border.hex(),
    colorBorderLight: borderLight.hex(),
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    shadowColor,
  };
}

/* ────────────────────────────────────────────────────────────
 * Main generator
 * ──────────────────────────────────────────────────────────── */

export interface GenerateThemeOptions {
  /** Override seed hue for primary color (0-360). */
  seedHue?: number;
  /** Business sub-type for industry hue biasing (e.g. "restaurant", "spa", "photography"). */
  businessType?: string;
  /** Override specific tokens after generation. */
  overrides?: Partial<ThemeTokens>;
}

/**
 * Industry hue nudges — biases the palette hue toward industry-appropriate colors.
 * The nudge is blended with the personality-derived hue (70% personality, 30% industry).
 */
const INDUSTRY_HUE_NUDGE: Record<string, number> = {
  restaurant: 25, // Warm amber/terracotta
  spa: 160, // Soft teal/sage
  photography: 40, // Warm neutral
  booking: 200, // Professional blue
  ecommerce: 220, // Trust blue
  educational: 230, // Knowledge blue
  nonprofit: 140, // Growth green
  event: 330, // Vibrant magenta
};

/**
 * Generate a complete ThemeTokens object from a 6-axis personality vector.
 *
 * Each axis (0.0 – 1.0):
 *  [0] minimal_rich     — spacing, shadows, borders, palette complexity
 *  [1] playful_serious  — fonts, saturation, radius, easing
 *  [2] warm_cool        — neutral hues, color temperature
 *  [3] light_bold       — font weight, contrast, dark/light mode
 *  [4] classic_modern   — font era, proportions
 *  [5] calm_dynamic     — transition speed, animation intensity
 */
export function generateThemeFromVector(
  pv: PersonalityVector,
  options: GenerateThemeOptions = {}
): ThemeTokens {
  const [minRich, playSerious, , lightBold, , calmDynamic] = pv;

  // ── Colors ──────────────────────────────────────────────
  const palette = generatePalette(pv, options.seedHue, options.businessType);

  // ── Fonts ───────────────────────────────────────────────
  const fonts = selectFontPairing(pv, options.businessType);

  // ── Typography scale ────────────────────────────────────
  // More generous scale for bold/rich; tighter for minimal/light
  const scaleMultiplier = lerp(0.92, 1.08, (minRich + lightBold) / 2);
  const baseSize = 16; // px
  const sizes = [0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.875, 2.25, 3, 3.75, 4.5].map(
    (s) => `${(s * scaleMultiplier * baseSize) / 16}rem`
  );

  // Line-height: tighter for serious/bold, relaxed for playful/light
  const leadingTight = `${lerp(1.15, 1.25, playSerious)}`;
  const leadingNormal = `${lerp(1.5, 1.6, 1 - lightBold)}`;
  const leadingRelaxed = `${lerp(1.7, 1.85, 1 - lightBold)}`;

  // Letter-spacing: tight for modern, wide for classic
  const trackingTight = `${lerp(-0.03, -0.01, pv[4])}em`;
  const trackingNormal = "0em";
  const trackingWide = `${lerp(0.02, 0.08, 1 - pv[4])}em`;

  // Font weights: bolder for bold axis
  const weightNormal = `${Math.round(lerp(300, 400, lightBold))}`;
  const weightMedium = `${Math.round(lerp(400, 500, lightBold))}`;
  const weightSemibold = `${Math.round(lerp(500, 600, lightBold))}`;
  const weightBold = `${Math.round(lerp(600, 800, lightBold))}`;

  // ── Spacing ─────────────────────────────────────────────
  // Minimal = generous spacing; rich = compact
  const spaceSectionRem = lerp(6, 4, minRich);
  const spaceComponentRem = lerp(3.5, 2, minRich);
  const spaceElementRem = lerp(1.75, 1, minRich);
  const spaceTightRem = lerp(1, 0.5, minRich);
  const containerMax = `${Math.round(lerp(1200, 1440, minRich))}px`;
  const containerNarrow = `${Math.round(lerp(640, 768, minRich))}px`;

  // ── Shape ───────────────────────────────────────────────
  // Playful = rounded; serious = sharp
  const radiusBase = lerp(12, 2, playSerious);
  const radiusSm = `${Math.round(radiusBase * 0.5)}px`;
  const radiusMd = `${Math.round(radiusBase)}px`;
  const radiusLg = `${Math.round(radiusBase * 1.5)}px`;
  const radiusXl = `${Math.round(radiusBase * 2.5)}px`;
  const radiusFull = "9999px";
  const borderWidth = `${lerp(1, 2, minRich)}px`;

  // ── Shadows ─────────────────────────────────────────────
  // Minimal = no shadows; rich = layered
  const shadowIntensity = minRich;
  const shadowSm = shadowIntensity < 0.2 ? "none" : `0 1px 2px ${palette.shadowColor}`;
  const shadowMd =
    shadowIntensity < 0.15
      ? "none"
      : `0 4px 6px -1px ${palette.shadowColor}, 0 2px 4px -2px ${palette.shadowColor}`;
  const shadowLg =
    shadowIntensity < 0.1
      ? "none"
      : `0 10px 15px -3px ${palette.shadowColor}, 0 4px 6px -4px ${palette.shadowColor}`;
  const shadowXl = `0 20px 25px -5px ${palette.shadowColor}, 0 8px 10px -6px ${palette.shadowColor}`;

  // ── Animation ───────────────────────────────────────────
  // Calm = slow/subtle; dynamic = fast/bold
  const transitionFast = `${Math.round(lerp(200, 100, calmDynamic))}ms`;
  const transitionBase = `${Math.round(lerp(400, 200, calmDynamic))}ms`;
  const transitionSlow = `${Math.round(lerp(800, 400, calmDynamic))}ms`;

  // Easing: bouncy for playful/dynamic, smooth for serious/calm
  const easeDefault =
    playSerious < 0.4 && calmDynamic > 0.5
      ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
      : calmDynamic > 0.6
        ? "cubic-bezier(0.22, 1, 0.36, 1)"
        : "cubic-bezier(0.4, 0, 0.2, 1)";

  const animationDistance = `${Math.round(lerp(8, 30, calmDynamic))}px`;
  const animationScale = `${lerp(0.98, 0.9, calmDynamic)}`;

  // ── Assemble ────────────────────────────────────────────
  const tokens: ThemeTokens = {
    ...palette,

    fontHeading: fonts.heading,
    fontBody: fonts.body,
    fontAccent: fonts.accent,
    fontMono: "'JetBrains Mono', monospace",

    textXs: sizes[0],
    textSm: sizes[1],
    textBase: sizes[2],
    textLg: sizes[3],
    textXl: sizes[4],
    text2xl: sizes[5],
    text3xl: sizes[6],
    text4xl: sizes[7],
    text5xl: sizes[8],
    text6xl: sizes[9],
    text7xl: sizes[10],

    leadingTight,
    leadingNormal,
    leadingRelaxed,

    trackingTight,
    trackingNormal,
    trackingWide,

    weightNormal,
    weightMedium,
    weightSemibold,
    weightBold,

    spaceSection: `${spaceSectionRem}rem`,
    spaceComponent: `${spaceComponentRem}rem`,
    spaceElement: `${spaceElementRem}rem`,
    spaceTight: `${spaceTightRem}rem`,
    containerMax,
    containerNarrow,

    radiusSm,
    radiusMd,
    radiusLg,
    radiusXl,
    radiusFull,
    borderWidth,

    shadowSm,
    shadowMd,
    shadowLg,
    shadowXl,
    shadowColor: palette.shadowColor,

    transitionFast,
    transitionBase,
    transitionSlow,
    easeDefault,
    animationDistance,
    animationScale,
  };

  // Apply any manual overrides
  if (options.overrides) {
    return { ...tokens, ...options.overrides };
  }

  return tokens;
}

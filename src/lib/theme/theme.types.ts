/**
 * Complete set of design tokens that define a generated website's visual identity.
 * Every component in the library consumes these via CSS Custom Properties.
 */
export interface ThemeTokens {
  /* ── Color Tokens ───────────────────────────────────────── */
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryDark: string;
  colorSecondary: string;
  colorSecondaryLight: string;
  colorAccent: string;
  colorBackground: string;
  colorSurface: string;
  colorSurfaceElevated: string;
  colorText: string;
  colorTextSecondary: string;
  colorTextOnPrimary: string;
  colorTextOnDark: string;
  colorBorder: string;
  colorBorderLight: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;

  /* ── Typography Tokens ──────────────────────────────────── */
  fontHeading: string;
  fontBody: string;
  fontAccent: string;
  fontMono: string;

  textXs: string;
  textSm: string;
  textBase: string;
  textLg: string;
  textXl: string;
  text2xl: string;
  text3xl: string;
  text4xl: string;
  text5xl: string;
  text6xl: string;
  text7xl: string;

  leadingTight: string;
  leadingNormal: string;
  leadingRelaxed: string;

  trackingTight: string;
  trackingNormal: string;
  trackingWide: string;

  weightNormal: string;
  weightMedium: string;
  weightSemibold: string;
  weightBold: string;

  /* ── Spacing Tokens ─────────────────────────────────────── */
  spaceSection: string;
  spaceComponent: string;
  spaceElement: string;
  spaceTight: string;
  containerMax: string;
  containerNarrow: string;

  /* ── Shape Tokens ───────────────────────────────────────── */
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
  borderWidth: string;

  /* ── Shadow Tokens ──────────────────────────────────────── */
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadowColor: string;

  /* ── Animation Tokens ───────────────────────────────────── */
  transitionFast: string;
  transitionBase: string;
  transitionSlow: string;
  easeDefault: string;
  animationDistance: string;
  animationScale: string;
}

/**
 * A 6-axis personality vector that drives theme generation.
 * Each axis ranges from 0.0 to 1.0.
 *
 * [0] minimal_rich     — Minimal/Spacious (0) ↔ Rich/Dense (1)
 * [1] playful_serious   — Playful/Casual (0) ↔ Serious/Professional (1)
 * [2] warm_cool         — Warm/Inviting (0) ↔ Cool/Sleek (1)
 * [3] light_bold        — Light/Airy (0) ↔ Bold/Heavy (1)
 * [4] classic_modern    — Classic/Traditional (0) ↔ Modern/Contemporary (1)
 * [5] calm_dynamic      — Calm/Serene (0) ↔ Dynamic/Energetic (1)
 */
export type PersonalityVector = [number, number, number, number, number, number];

/**
 * Named theme preset with its personality vector and hand-tuned overrides.
 */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  personalityVector: PersonalityVector;
  tokens: ThemeTokens;
}

/**
 * Maps a ThemeTokens key to its CSS custom property name.
 * e.g. "colorPrimary" → "--color-primary"
 */
export type TokenCSSMap = Record<keyof ThemeTokens, string>;

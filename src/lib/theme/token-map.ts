import type { ThemeTokens, TokenCSSMap } from "./theme.types";

/**
 * Maps every ThemeTokens key to its CSS custom property name.
 * Used by ThemeProvider to inject tokens and by components to reference them.
 */
export const TOKEN_CSS_MAP: TokenCSSMap = {
  /* Colors */
  colorPrimary: "--color-primary",
  colorPrimaryLight: "--color-primary-light",
  colorPrimaryDark: "--color-primary-dark",
  colorSecondary: "--color-secondary",
  colorSecondaryLight: "--color-secondary-light",
  colorAccent: "--color-accent",
  colorBackground: "--color-background",
  colorSurface: "--color-surface",
  colorSurfaceElevated: "--color-surface-elevated",
  colorText: "--color-text",
  colorTextSecondary: "--color-text-secondary",
  colorTextOnPrimary: "--color-text-on-primary",
  colorTextOnDark: "--color-text-on-dark",
  colorBorder: "--color-border",
  colorBorderLight: "--color-border-light",
  colorSuccess: "--color-success",
  colorWarning: "--color-warning",
  colorError: "--color-error",

  /* Typography — families */
  fontHeading: "--font-heading",
  fontBody: "--font-body",
  fontAccent: "--font-accent",
  fontMono: "--font-mono",

  /* Typography — sizes */
  textXs: "--text-xs",
  textSm: "--text-sm",
  textBase: "--text-base",
  textLg: "--text-lg",
  textXl: "--text-xl",
  text2xl: "--text-2xl",
  text3xl: "--text-3xl",
  text4xl: "--text-4xl",
  text5xl: "--text-5xl",
  text6xl: "--text-6xl",
  text7xl: "--text-7xl",

  /* Typography — line-height, letter-spacing, weight */
  leadingTight: "--leading-tight",
  leadingNormal: "--leading-normal",
  leadingRelaxed: "--leading-relaxed",
  trackingTight: "--tracking-tight",
  trackingNormal: "--tracking-normal",
  trackingWide: "--tracking-wide",
  weightNormal: "--weight-normal",
  weightMedium: "--weight-medium",
  weightSemibold: "--weight-semibold",
  weightBold: "--weight-bold",

  /* Spacing */
  spaceSection: "--space-section",
  spaceComponent: "--space-component",
  spaceElement: "--space-element",
  spaceTight: "--space-tight",
  containerMax: "--container-max",
  containerNarrow: "--container-narrow",

  /* Shape */
  radiusSm: "--radius-sm",
  radiusMd: "--radius-md",
  radiusLg: "--radius-lg",
  radiusXl: "--radius-xl",
  radiusFull: "--radius-full",
  borderWidth: "--border-width",

  /* Shadows */
  shadowSm: "--shadow-sm",
  shadowMd: "--shadow-md",
  shadowLg: "--shadow-lg",
  shadowXl: "--shadow-xl",
  shadowColor: "--shadow-color",

  /* Animation */
  transitionFast: "--transition-fast",
  transitionBase: "--transition-base",
  transitionSlow: "--transition-slow",
  easeDefault: "--ease-default",
  animationDistance: "--animation-distance",
  animationScale: "--animation-scale",
};

/**
 * Convert a ThemeTokens object into a flat Record of CSS custom property → value.
 */
export function tokensToCSSProperties(tokens: Partial<ThemeTokens>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(TOKEN_CSS_MAP)) {
    const value = tokens[key as keyof ThemeTokens];
    if (value !== undefined) {
      result[cssVar] = value;
    }
  }
  return result;
}

/**
 * Convert a ThemeTokens object to a CSS string for injection into a <style> tag.
 */
export function tokensToCSSString(
  tokens: Partial<ThemeTokens>,
  selector: string = ":root"
): string {
  const props = tokensToCSSProperties(tokens);
  const declarations = Object.entries(props)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
}

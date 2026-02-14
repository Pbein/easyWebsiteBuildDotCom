export type { ThemeTokens, PersonalityVector, ThemePreset, TokenCSSMap } from "./theme.types";

export { TOKEN_CSS_MAP, tokensToCSSProperties, tokensToCSSString } from "./token-map";
export { generateThemeFromVector, generateThemeVariants } from "./generate-theme";
export type { GenerateThemeOptions, ThemeVariantPair } from "./generate-theme";
export {
  LUXURY_DARK,
  MODERN_CLEAN,
  WARM_PROFESSIONAL,
  THEME_PRESETS,
  getPresetById,
} from "./presets";
export { ThemeProvider, useTheme } from "./ThemeProvider";
export { applyEmotionalOverrides } from "./emotional-overrides";
export { deriveThemeFromPrimaryColor } from "./derive-from-primary";
export {
  FONT_PAIRINGS,
  FREE_FONT_IDS,
  getFontPairingById,
  selectFontPairing,
} from "./font-pairings";
export type { FontPairing } from "./font-pairings";

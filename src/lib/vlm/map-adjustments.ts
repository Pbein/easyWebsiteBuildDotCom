import type { ThemeTokens } from "@/lib/theme/theme.types";

/** All valid ThemeTokens keys for validation */
const VALID_TOKEN_KEYS: Set<string> = new Set<string>([
  // Color tokens
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
  // Typography tokens
  "fontHeading",
  "fontBody",
  "fontAccent",
  "fontMono",
  "textXs",
  "textSm",
  "textBase",
  "textLg",
  "textXl",
  "text2xl",
  "text3xl",
  "text4xl",
  "text5xl",
  "text6xl",
  "text7xl",
  "leadingTight",
  "leadingNormal",
  "leadingRelaxed",
  "trackingTight",
  "trackingNormal",
  "trackingWide",
  "weightNormal",
  "weightMedium",
  "weightSemibold",
  "weightBold",
  // Spacing tokens
  "spaceSection",
  "spaceComponent",
  "spaceElement",
  "spaceTight",
  "containerMax",
  "containerNarrow",
  // Shape tokens
  "radiusSm",
  "radiusMd",
  "radiusLg",
  "radiusXl",
  "radiusFull",
  "borderWidth",
  // Shadow tokens
  "shadowSm",
  "shadowMd",
  "shadowLg",
  "shadowXl",
  "shadowColor",
  // Animation tokens
  "transitionFast",
  "transitionBase",
  "transitionSlow",
  "easeDefault",
  "animationDistance",
  "animationScale",
]);

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{3,8}$/;

/** Color token keys that should be validated as hex values */
function isColorToken(key: string): boolean {
  return key.startsWith("color") && key !== "shadowColor";
}

/**
 * Filters and validates VLM-suggested adjustments into safe Partial<ThemeTokens>.
 * - Only includes keys that exist in ThemeTokens
 * - Validates hex format for color tokens
 * - Passes through all other tokens as-is (CSS values like "16px", font names, etc.)
 */
export function mapAdjustmentsToTokenOverrides(
  rawAdjustments: Record<string, string>
): Partial<ThemeTokens> {
  const result: Partial<ThemeTokens> = {};

  for (const [key, value] of Object.entries(rawAdjustments)) {
    // Skip keys not in ThemeTokens
    if (!VALID_TOKEN_KEYS.has(key)) continue;

    // Validate hex format for color tokens
    if (isColorToken(key) && !HEX_COLOR_REGEX.test(value)) continue;

    // Accept the value — cast is safe since we validated the key exists
    (result as Record<string, string>)[key] = value;
  }

  return result;
}

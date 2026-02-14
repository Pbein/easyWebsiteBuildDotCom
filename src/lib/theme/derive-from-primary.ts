import chroma from "chroma-js";
import type { PersonalityVector, ThemeTokens } from "./theme.types";
import { generateThemeFromVector } from "./generate-theme";

/* ────────────────────────────────────────────────────────────
 * Derive a full theme palette from a single primary hex color.
 *
 * Used by the customization sidebar: user picks a primary color,
 * we regenerate the entire palette to stay harmonious while
 * keeping the exact user-chosen hex as colorPrimary.
 * ──────────────────────────────────────────────────────────── */

export function deriveThemeFromPrimaryColor(
  hex: string,
  personalityVector: PersonalityVector,
  businessType?: string
): Partial<ThemeTokens> {
  // Extract hue from the user's chosen color
  const hue = chroma(hex).get("hsl.h") || 0;

  // Generate a full theme seeded with this hue
  const base = generateThemeFromVector(personalityVector, {
    seedHue: hue,
    businessType,
  });

  // Override specific colors to honor the exact user choice
  const primary = chroma(hex);
  const primaryLight = primary.brighten(1.2);
  const primaryDark = primary.darken(1.2);

  // Triadic accent: 120° offset from user's hue
  const accentHue = (hue + 120) % 360;
  const accent = chroma.hsl(accentHue, chroma(hex).get("hsl.s") * 0.9, 0.55);

  // Contrast-checked text on primary
  const textOnPrimary = chroma.contrast(primary, chroma("white")) > 3 ? "#ffffff" : "#111111";

  // Shadow tinted to primary
  const isDark = chroma(base.colorBackground).luminance() < 0.2;
  const shadowColor = isDark ? primary.alpha(0.15).css() : chroma(base.colorText).alpha(0.08).css();

  return {
    colorPrimary: hex,
    colorPrimaryLight: primaryLight.hex(),
    colorPrimaryDark: primaryDark.hex(),
    colorAccent: accent.hex(),
    colorTextOnPrimary: textOnPrimary,
    shadowColor,
    // Carry through the generated background/surface/text colors
    // so the palette stays harmonious with the new hue
    colorBackground: base.colorBackground,
    colorSurface: base.colorSurface,
    colorSurfaceElevated: base.colorSurfaceElevated,
    colorText: base.colorText,
    colorTextSecondary: base.colorTextSecondary,
    colorTextOnDark: base.colorTextOnDark,
    colorBorder: base.colorBorder,
    colorBorderLight: base.colorBorderLight,
    colorSecondary: base.colorSecondary,
    colorSecondaryLight: base.colorSecondaryLight,
  };
}

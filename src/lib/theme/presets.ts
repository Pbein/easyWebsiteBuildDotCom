import type { PersonalityVector, ThemePreset, ThemeTokens } from "./theme.types";
import { generateThemeFromVector } from "./generate-theme";

/* ────────────────────────────────────────────────────────────
 * Helper: generate tokens then apply hand-tuned overrides.
 * ──────────────────────────────────────────────────────────── */

function makePreset(
  id: string,
  name: string,
  description: string,
  personalityVector: PersonalityVector,
  seedHue: number,
  overrides: Partial<ThemeTokens>
): ThemePreset {
  const tokens = generateThemeFromVector(personalityVector, {
    seedHue,
    overrides,
  });
  return { id, name, description, personalityVector, tokens };
}

/* ────────────────────────────────────────────────────────────
 * Preset: Luxury Dark
 * personality: [0.6, 0.9, 0.3, 0.8, 0.3, 0.5]
 * Deep navy, gold accents, cream text, rich shadows
 * Fonts: Cormorant Garamond / Outfit
 * ──────────────────────────────────────────────────────────── */
export const LUXURY_DARK: ThemePreset = makePreset(
  "luxury-dark",
  "Luxury Dark",
  "Opulent dark theme with deep navy backgrounds, warm gold accents, and refined serif typography. Perfect for high-end brands, boutiques, and premium services.",
  [0.6, 0.9, 0.3, 0.8, 0.3, 0.5],
  40, // gold-amber seed hue
  {
    colorPrimary: "#c9a55c",
    colorPrimaryLight: "#e0c88a",
    colorPrimaryDark: "#a37e34",
    colorSecondary: "#7b8fa6",
    colorSecondaryLight: "#a3b4c7",
    colorAccent: "#c9a55c",
    colorBackground: "#0c0f17",
    colorSurface: "#141825",
    colorSurfaceElevated: "#1c2133",
    colorText: "#ece6d9",
    colorTextSecondary: "#9a9484",
    colorTextOnPrimary: "#111111",
    colorTextOnDark: "#ece6d9",
    colorBorder: "#2a2f40",
    colorBorderLight: "#1e2235",
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Outfit', sans-serif",
    fontAccent: "'Cormorant Garamond', serif",
    shadowColor: "rgba(201, 165, 92, 0.12)",
  }
);

/* ────────────────────────────────────────────────────────────
 * Preset: Modern Clean
 * personality: [0.2, 0.6, 0.6, 0.5, 0.9, 0.4]
 * White base, single accent, near-black text
 * Fonts: Sora / DM Sans
 * ──────────────────────────────────────────────────────────── */
export const MODERN_CLEAN: ThemePreset = makePreset(
  "modern-clean",
  "Modern Clean",
  "Crisp, minimal design with generous whitespace, clean geometry, and a single bold accent color. Inspired by Vercel and Linear aesthetics.",
  [0.2, 0.6, 0.6, 0.5, 0.9, 0.4],
  220, // blue seed hue
  {
    colorPrimary: "#2563eb",
    colorPrimaryLight: "#60a5fa",
    colorPrimaryDark: "#1d4ed8",
    colorSecondary: "#6366f1",
    colorSecondaryLight: "#a5b4fc",
    colorAccent: "#2563eb",
    colorBackground: "#fafafa",
    colorSurface: "#ffffff",
    colorSurfaceElevated: "#ffffff",
    colorText: "#111111",
    colorTextSecondary: "#6b7280",
    colorTextOnPrimary: "#ffffff",
    colorTextOnDark: "#f5f5f5",
    colorBorder: "#e5e7eb",
    colorBorderLight: "#f3f4f6",
    fontHeading: "'Sora', sans-serif",
    fontBody: "'DM Sans', sans-serif",
    fontAccent: "'Sora', sans-serif",
    shadowColor: "rgba(0, 0, 0, 0.06)",
  }
);

/* ────────────────────────────────────────────────────────────
 * Preset: Warm Professional
 * personality: [0.4, 0.5, 0.2, 0.5, 0.5, 0.4]
 * Warm whites, terracotta/sage accents, brown-black text
 * Fonts: Lora / Merriweather Sans
 * ──────────────────────────────────────────────────────────── */
export const WARM_PROFESSIONAL: ThemePreset = makePreset(
  "warm-professional",
  "Warm Professional",
  "Approachable yet polished design with warm earth tones, comfortable spacing, and inviting typography. Ideal for consulting, wellness, and lifestyle brands.",
  [0.4, 0.5, 0.2, 0.5, 0.5, 0.4],
  18, // terracotta seed hue
  {
    colorPrimary: "#c67a4a",
    colorPrimaryLight: "#e0a077",
    colorPrimaryDark: "#a05d31",
    colorSecondary: "#7a9a7e",
    colorSecondaryLight: "#a5c3a9",
    colorAccent: "#c67a4a",
    colorBackground: "#faf6f0",
    colorSurface: "#fefcf8",
    colorSurfaceElevated: "#ffffff",
    colorText: "#2c2420",
    colorTextSecondary: "#7a6e63",
    colorTextOnPrimary: "#ffffff",
    colorTextOnDark: "#f5f0ea",
    colorBorder: "#e8ddd1",
    colorBorderLight: "#f0e8de",
    fontHeading: "'Lora', serif",
    fontBody: "'Merriweather Sans', sans-serif",
    fontAccent: "'Lora', serif",
    shadowColor: "rgba(44, 36, 32, 0.06)",
  }
);

/* ────────────────────────────────────────────────────────────
 * All presets for easy iteration / lookup
 * ──────────────────────────────────────────────────────────── */

export const THEME_PRESETS: ThemePreset[] = [LUXURY_DARK, MODERN_CLEAN, WARM_PROFESSIONAL];

export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

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
 * Preset: Bold Creative
 * personality: [0.7, 0.3, 0.4, 0.9, 0.8, 0.9]
 * Vibrant primaries, high contrast, energetic
 * Fonts: Oswald / Lato
 * ──────────────────────────────────────────────────────────── */
export const BOLD_CREATIVE: ThemePreset = makePreset(
  "bold-creative",
  "Bold Creative",
  "High-energy design with vibrant color contrasts, bold display typography, and dynamic motion. Built for creative agencies, music brands, events, and startups.",
  [0.7, 0.3, 0.4, 0.9, 0.8, 0.9],
  310, // electric pink-magenta seed hue
  {
    colorPrimary: "#e040fb",
    colorPrimaryLight: "#ea80fc",
    colorPrimaryDark: "#aa00ff",
    colorSecondary: "#00e5ff",
    colorSecondaryLight: "#6effff",
    colorAccent: "#76ff03",
    colorBackground: "#0a0a0f",
    colorSurface: "#14141f",
    colorSurfaceElevated: "#1e1e2e",
    colorText: "#f5f5f5",
    colorTextSecondary: "#b0b0c0",
    colorTextOnPrimary: "#000000",
    colorTextOnDark: "#f5f5f5",
    colorBorder: "#2a2a40",
    colorBorderLight: "#1e1e30",
    fontHeading: "'Oswald', sans-serif",
    fontBody: "'Lato', sans-serif",
    fontAccent: "'Oswald', sans-serif",
    shadowColor: "rgba(224, 64, 251, 0.15)",
    radiusSm: "0px",
    radiusMd: "0px",
    radiusLg: "0px",
    radiusXl: "0px",
    radiusFull: "9999px",
  }
);

/* ────────────────────────────────────────────────────────────
 * Preset: Editorial
 * personality: [0.5, 0.7, 0.5, 0.7, 0.7, 0.3]
 * High contrast, near-black on white, single bold accent
 * Fonts: Libre Baskerville / Nunito Sans
 * ──────────────────────────────────────────────────────────── */
export const EDITORIAL: ThemePreset = makePreset(
  "editorial",
  "Editorial",
  "High-contrast typographic design with structured grids, minimal animation, and a single bold accent. Perfect for blogs, publications, news sites, and content-heavy platforms.",
  [0.5, 0.7, 0.5, 0.7, 0.7, 0.3],
  10, // warm red accent
  {
    colorPrimary: "#d63031",
    colorPrimaryLight: "#e17055",
    colorPrimaryDark: "#b71c1c",
    colorSecondary: "#2d3436",
    colorSecondaryLight: "#636e72",
    colorAccent: "#d63031",
    colorBackground: "#fafaf9",
    colorSurface: "#ffffff",
    colorSurfaceElevated: "#ffffff",
    colorText: "#1a1a1a",
    colorTextSecondary: "#555555",
    colorTextOnPrimary: "#ffffff",
    colorTextOnDark: "#f5f5f5",
    colorBorder: "#e0e0e0",
    colorBorderLight: "#eeeeee",
    fontHeading: "'Libre Baskerville', serif",
    fontBody: "'Nunito Sans', sans-serif",
    fontAccent: "'Libre Baskerville', serif",
    shadowColor: "rgba(0, 0, 0, 0.04)",
    radiusSm: "0px",
    radiusMd: "0px",
    radiusLg: "0px",
    radiusXl: "0px",
    radiusFull: "9999px",
  }
);

/* ────────────────────────────────────────────────────────────
 * Preset: Tech Forward
 * personality: [0.4, 0.7, 0.8, 0.6, 1.0, 0.7]
 * Dark background, gradient accents (blue-to-purple), glass effects
 * Fonts: JetBrains Mono (accent) / DM Sans (body)
 * ──────────────────────────────────────────────────────────── */
export const TECH_FORWARD: ThemePreset = makePreset(
  "tech-forward",
  "Tech Forward",
  "Sleek dark-mode aesthetic with gradient accents, monospace details, and smooth glow effects. Ideal for SaaS, developer tools, AI products, and tech companies.",
  [0.4, 0.7, 0.8, 0.6, 1.0, 0.7],
  250, // blue-purple seed hue
  {
    colorPrimary: "#6366f1",
    colorPrimaryLight: "#818cf8",
    colorPrimaryDark: "#4f46e5",
    colorSecondary: "#06b6d4",
    colorSecondaryLight: "#67e8f9",
    colorAccent: "#8b5cf6",
    colorBackground: "#0f1117",
    colorSurface: "#161825",
    colorSurfaceElevated: "#1e2035",
    colorText: "#e2e8f0",
    colorTextSecondary: "#94a3b8",
    colorTextOnPrimary: "#ffffff",
    colorTextOnDark: "#e2e8f0",
    colorBorder: "#252840",
    colorBorderLight: "#1c1f35",
    fontHeading: "'DM Sans', sans-serif",
    fontBody: "'DM Sans', sans-serif",
    fontAccent: "'JetBrains Mono', monospace",
    shadowColor: "rgba(99, 102, 241, 0.12)",
  }
);

/* ────────────────────────────────────────────────────────────
 * Preset: Organic Natural
 * personality: [0.4, 0.5, 0.1, 0.4, 0.3, 0.3]
 * Earth tones — forest green, terracotta, warm cream
 * Fonts: Crimson Pro / Work Sans
 * ──────────────────────────────────────────────────────────── */
export const ORGANIC_NATURAL: ThemePreset = makePreset(
  "organic-natural",
  "Organic Natural",
  "Warm and grounded design with earth tones, generous spacing, and gentle motion. Well-suited for wellness, organic brands, farms, holistic health, and environmental causes.",
  [0.4, 0.5, 0.1, 0.4, 0.3, 0.3],
  85, // sage-green seed hue
  {
    colorPrimary: "#5f7a5e",
    colorPrimaryLight: "#8faa8e",
    colorPrimaryDark: "#3e5c3d",
    colorSecondary: "#c07a50",
    colorSecondaryLight: "#daa07a",
    colorAccent: "#5f7a5e",
    colorBackground: "#faf5ef",
    colorSurface: "#fefbf5",
    colorSurfaceElevated: "#ffffff",
    colorText: "#2c2417",
    colorTextSecondary: "#6b5e4f",
    colorTextOnPrimary: "#ffffff",
    colorTextOnDark: "#f5efe5",
    colorBorder: "#e0d5c5",
    colorBorderLight: "#ece5da",
    fontHeading: "'Crimson Pro', serif",
    fontBody: "'Work Sans', sans-serif",
    fontAccent: "'Crimson Pro', serif",
    shadowColor: "rgba(44, 36, 23, 0.06)",
    radiusSm: "6px",
    radiusMd: "12px",
    radiusLg: "16px",
    radiusXl: "24px",
  }
);

/* ────────────────────────────────────────────────────────────
 * All presets for easy iteration / lookup
 * ──────────────────────────────────────────────────────────── */

export const THEME_PRESETS: ThemePreset[] = [
  LUXURY_DARK,
  MODERN_CLEAN,
  WARM_PROFESSIONAL,
  BOLD_CREATIVE,
  EDITORIAL,
  TECH_FORWARD,
  ORGANIC_NATURAL,
];

export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

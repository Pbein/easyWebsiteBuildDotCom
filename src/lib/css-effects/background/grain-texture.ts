/**
 * Grain Texture Effect
 *
 * Adds a subtle noise/film grain overlay to an element.
 * Reuses the generateNoiseOverlay() from src/lib/visuals/gradient-utils.
 */

import type { CSSEffectResult, EffectConfig, EffectManifest } from "../types";

export const GRAIN_TEXTURE_MANIFEST: EffectManifest = {
  id: "background/grain-texture",
  category: "background",
  name: "Grain Texture",
  description: "Subtle SVG noise overlay for film-grain texture",
  performance: "low",
  requiresJS: false,
  consumedTokens: [],
  tags: ["background", "grain", "noise", "texture", "film", "subtle"],
};

/**
 * Generate a noise texture SVG data URI.
 * Inlined here to avoid importing from src/lib/visuals (keeps css-effects self-contained).
 */
function noiseOverlaySVG(opacity: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${opacity}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function grainTexture(config?: EffectConfig): CSSEffectResult {
  const intensity = config?.intensity ?? 1;

  if (intensity === 0) {
    return { style: {} };
  }

  const opacity = Math.min(0.12, 0.03 * intensity);

  return {
    style: {
      position: "relative" as const,
    },
    // The grain overlay is best applied as a ::after pseudo-element.
    // Since we return inline styles, consumers should add this background
    // to an overlay element or use the className approach.
    // Providing the background-image value for direct use:
    className: undefined,
    // Store the noise background in a custom way consumers can use
    keyframes: `/* Grain texture: apply as background-image on a pseudo-element */
/* background-image: ${noiseOverlaySVG(opacity)}; */
/* position: absolute; inset: 0; pointer-events: none; mix-blend-mode: overlay; */`,
    keyframeName: `ewb-grain-${Math.round(opacity * 100)}`,
  };
}

/**
 * Get the grain texture CSS background-image value directly.
 * Useful for applying to a pseudo-element overlay.
 */
export function getGrainTextureBackground(intensity = 1): string {
  const opacity = Math.min(0.12, 0.03 * intensity);
  return noiseOverlaySVG(opacity);
}

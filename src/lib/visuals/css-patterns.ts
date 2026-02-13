/**
 * CSS-only background patterns using linear-gradient and SVG data URIs.
 *
 * Each pattern is a function that takes a color string and returns a CSS
 * `background` property value. Patterns are designed to be layered on top
 * of solid backgrounds at low opacity via the decorativeOpacity setting
 * in the visual vocabulary.
 */

export interface CSSPattern {
  id: string;
  label: string;
  /** Returns a complete CSS `background` value. */
  generate: (color: string) => string;
}

// ── Pattern generators ──────────────────────────────────────

function pinstripe(color: string): string {
  return `repeating-linear-gradient(90deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 40px)`;
}

function diagonalStripes(color: string): string {
  return `repeating-linear-gradient(45deg, ${color} 0px, ${color} 2px, transparent 2px, transparent 16px)`;
}

function dots(color: string): string {
  return `radial-gradient(circle, ${color} 1px, transparent 1px)`;
}

function grid(color: string): string {
  return [
    `repeating-linear-gradient(0deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 50px)`,
    `repeating-linear-gradient(90deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 50px)`,
  ].join(", ");
}

function herringbone(color: string): string {
  return [
    `repeating-linear-gradient(30deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 12px)`,
    `repeating-linear-gradient(-30deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 12px)`,
  ].join(", ");
}

function crossHatch(color: string): string {
  return [
    `repeating-linear-gradient(45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 20px)`,
    `repeating-linear-gradient(-45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 20px)`,
  ].join(", ");
}

function zigzag(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='20' viewBox='0 0 40 20'><path d='M0 10 L10 0 L20 10 L30 0 L40 10 L40 20 L30 10 L20 20 L10 10 L0 20Z' fill='${encodeURIComponent(color)}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function waves(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='20' viewBox='0 0 100 20'><path d='M0 10 Q25 0 50 10 Q75 20 100 10' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1.5'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function concentricCircles(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><circle cx='30' cy='30' r='20' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1'/><circle cx='30' cy='30' r='12' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.8'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function seigaiha(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='28' viewBox='0 0 56 28'><path d='M28 0 A28 28 0 0 0 0 28 M56 0 A28 28 0 0 0 28 28 M28 0 A14 14 0 0 0 14 14 M42 14 A14 14 0 0 0 28 0' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.8'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function topography(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><path d='M10 40 Q30 20 50 40 Q70 60 80 40 M0 60 Q20 40 40 60 Q60 80 80 60' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.8'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function diamonds(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'><path d='M15 0 L30 15 L15 30 L0 15Z' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.8'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function circuitDots(color: string): string {
  return [
    `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
    `radial-gradient(circle, ${color} 0.5px, transparent 0.5px)`,
  ].join(", ");
}

function polkaDots(color: string): string {
  return [
    `radial-gradient(circle, ${color} 3px, transparent 3px)`,
    `radial-gradient(circle, ${color} 3px, transparent 3px)`,
  ].join(", ");
}

// ── Pattern registry ──────────────────────────────────────

export const CSS_PATTERNS: Record<string, CSSPattern> = {
  pinstripe: { id: "pinstripe", label: "Pinstripe", generate: pinstripe },
  "diagonal-stripes": {
    id: "diagonal-stripes",
    label: "Diagonal Stripes",
    generate: diagonalStripes,
  },
  dots: { id: "dots", label: "Dots", generate: dots },
  grid: { id: "grid", label: "Grid", generate: grid },
  herringbone: { id: "herringbone", label: "Herringbone", generate: herringbone },
  "cross-hatch": { id: "cross-hatch", label: "Cross Hatch", generate: crossHatch },
  zigzag: { id: "zigzag", label: "Zigzag", generate: zigzag },
  waves: { id: "waves", label: "Waves", generate: waves },
  "concentric-circles": {
    id: "concentric-circles",
    label: "Concentric Circles",
    generate: concentricCircles,
  },
  seigaiha: { id: "seigaiha", label: "Seigaiha", generate: seigaiha },
  topography: { id: "topography", label: "Topography", generate: topography },
  diamonds: { id: "diamonds", label: "Diamonds", generate: diamonds },
  "circuit-dots": { id: "circuit-dots", label: "Circuit Dots", generate: circuitDots },
  "polka-dots": { id: "polka-dots", label: "Polka Dots", generate: polkaDots },
};

/**
 * Generate a CSS background property for a pattern with the given color.
 * Returns empty string if patternId is not found or is "none".
 */
export function generatePattern(patternId: string, color: string): string {
  if (patternId === "none" || !patternId) return "";
  const pattern = CSS_PATTERNS[patternId];
  return pattern ? pattern.generate(color) : "";
}

/**
 * Get background-size values for patterns that need explicit sizing.
 * SVG-based patterns use `repeat` automatically; gradient patterns need sizing.
 */
export function getPatternSize(patternId: string): string {
  const sizes: Record<string, string> = {
    dots: "20px 20px",
    grid: "50px 50px",
    "circuit-dots": "30px 30px, 30px 30px",
    "polka-dots": "30px 30px, 30px 30px",
    pinstripe: "40px 40px",
    "diagonal-stripes": "16px 16px",
    herringbone: "12px 12px",
    "cross-hatch": "20px 20px",
  };
  return sizes[patternId] ?? "auto";
}

/**
 * Get background-position for multi-layer gradient patterns.
 */
export function getPatternPosition(patternId: string): string {
  const positions: Record<string, string> = {
    "circuit-dots": "0 0, 15px 15px",
    "polka-dots": "0 0, 15px 15px",
  };
  return positions[patternId] ?? "0 0";
}

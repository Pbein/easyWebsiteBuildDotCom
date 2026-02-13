/**
 * Gradient utilities for generating CSS mesh gradients and
 * themed gradient backgrounds from theme tokens.
 */

/** Generate a mesh gradient from primary/secondary/accent theme colors. */
export function generateMeshGradient(
  primary: string,
  secondary: string,
  accent: string,
  angle = 135
): string {
  return [
    `radial-gradient(ellipse at 20% 50%, ${primary}33 0%, transparent 50%)`,
    `radial-gradient(ellipse at 80% 20%, ${secondary}28 0%, transparent 50%)`,
    `radial-gradient(ellipse at 50% 80%, ${accent}22 0%, transparent 50%)`,
    `linear-gradient(${angle}deg, ${primary}0d 0%, transparent 100%)`,
  ].join(", ");
}

/** Generate a themed placeholder gradient (for missing images). */
export function generatePlaceholderGradient(
  primary: string,
  secondary: string,
  variant: "soft" | "bold" | "diagonal" = "soft"
): string {
  switch (variant) {
    case "bold":
      return `linear-gradient(135deg, ${primary}40 0%, ${secondary}40 100%)`;
    case "diagonal":
      return `linear-gradient(160deg, ${primary}30 0%, ${secondary}25 50%, ${primary}15 100%)`;
    case "soft":
    default:
      return `linear-gradient(135deg, ${primary}20 0%, ${secondary}18 100%)`;
  }
}

/**
 * Generate a noise texture overlay as an SVG data URI.
 * Returns a CSS background-image value.
 */
export function generateNoiseOverlay(opacity = 0.03): string {
  // Simple SVG feTurbulence noise pattern
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${opacity}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

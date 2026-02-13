"use client";

/**
 * Image placeholder component — renders a themed visual placeholder
 * when a real image is unavailable.
 *
 * Per `patterns-explicit-variants`: three explicit variant components,
 * composed via the main ImagePlaceholder lookup.
 */

import { generatePlaceholderGradient, generateNoiseOverlay } from "./gradient-utils";
import { generatePattern, getPatternSize, getPatternPosition } from "./css-patterns";

interface ImagePlaceholderProps {
  /** Aspect ratio class (Tailwind). */
  aspectRatio?: string;
  /** Border radius CSS value. */
  borderRadius?: string;
  /** Primary theme color for gradient. */
  primaryColor?: string;
  /** Secondary theme color for gradient. */
  secondaryColor?: string;
  /** Pattern ID to overlay (from css-patterns.ts). */
  patternId?: string;
  /** Pattern color. */
  patternColor?: string;
  /** Additional className. */
  className?: string;
}

// ── Gradient variant ──────────────────────────────────────────

function GradientPlaceholder({
  aspectRatio = "aspect-[4/3]",
  borderRadius = "var(--radius-xl)",
  primaryColor = "var(--color-primary)",
  secondaryColor = "var(--color-secondary)",
  className,
}: ImagePlaceholderProps): React.ReactElement {
  return (
    <div
      className={`relative overflow-hidden ${aspectRatio} ${className ?? ""}`}
      style={{ borderRadius }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: generatePlaceholderGradient(primaryColor, secondaryColor, "soft"),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: generateNoiseOverlay(0.04),
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

// ── Pattern variant ──────────────────────────────────────────

function PatternPlaceholder({
  aspectRatio = "aspect-[4/3]",
  borderRadius = "var(--radius-xl)",
  primaryColor = "var(--color-primary)",
  secondaryColor = "var(--color-secondary)",
  patternId = "dots",
  patternColor = "var(--color-primary)",
  className,
}: ImagePlaceholderProps): React.ReactElement {
  const patternBg = generatePattern(patternId, patternColor);
  const patternSize = getPatternSize(patternId);
  const patternPos = getPatternPosition(patternId);

  return (
    <div
      className={`relative overflow-hidden ${aspectRatio} ${className ?? ""}`}
      style={{ borderRadius }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: generatePlaceholderGradient(primaryColor, secondaryColor, "soft"),
        }}
      />
      {patternBg ? (
        <div
          className="absolute inset-0"
          style={{
            background: patternBg,
            backgroundSize: patternSize,
            backgroundPosition: patternPos,
            opacity: 0.15,
          }}
        />
      ) : null}
    </div>
  );
}

// ── Shimmer variant (loading state) ──────────────────────────

function ShimmerPlaceholder({
  aspectRatio = "aspect-[4/3]",
  borderRadius = "var(--radius-xl)",
  primaryColor = "var(--color-primary)",
  secondaryColor = "var(--color-secondary)",
  className,
}: ImagePlaceholderProps): React.ReactElement {
  return (
    <div
      className={`relative overflow-hidden ${aspectRatio} ${className ?? ""}`}
      style={{ borderRadius }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: generatePlaceholderGradient(primaryColor, secondaryColor, "soft"),
        }}
      />
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor}15 50%, transparent 100%)`,
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

// ── Variant lookup ──────────────────────────────────────────

export type PlaceholderVariant = "gradient" | "pattern" | "shimmer";

/**
 * Renders an image placeholder with the specified variant.
 * All variants look intentional and designed — not broken or empty.
 */
export function ImagePlaceholder({
  variant = "gradient",
  ...props
}: ImagePlaceholderProps & { variant?: PlaceholderVariant }): React.ReactElement {
  switch (variant) {
    case "pattern":
      return <PatternPlaceholder {...props} />;
    case "shimmer":
      return <ShimmerPlaceholder {...props} />;
    case "gradient":
    default:
      return <GradientPlaceholder {...props} />;
  }
}

export { GradientPlaceholder, PatternPlaceholder, ShimmerPlaceholder };

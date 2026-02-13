"use client";

/**
 * Section divider SVG components.
 *
 * Each divider is absolutely positioned at the top or bottom edge
 * of a section. Colors are derived from theme tokens.
 *
 * Per `patterns-explicit-variants`: each divider is an explicit component,
 * not a boolean-prop-controlled generic.
 */

import type { DividerStyle } from "./visual-vocabulary";

interface DividerProps {
  /** Fill color — typically the next/previous section's background color. */
  fillColor?: string;
  /** Which edge this divider sits on. */
  position: "top" | "bottom";
  /** Optional additional className. */
  className?: string;
}

// Hoisted static styles (rendering-hoist-jsx pattern)
const BASE_STYLES: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  width: "100%",
  lineHeight: 0,
  overflow: "hidden",
  pointerEvents: "none",
};

function WaveDivider({
  fillColor = "var(--color-background)",
  position,
  className,
}: DividerProps): React.ReactElement {
  const isTop = position === "top";
  const style: React.CSSProperties = {
    ...BASE_STYLES,
    ...(isTop ? { top: -1 } : { bottom: -1 }),
    ...(isTop ? { transform: "rotate(180deg)" } : {}),
  };

  return (
    <div className={className} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "clamp(30px, 4vw, 60px)" }}
      >
        <path d="M0 30 Q300 0 600 30 Q900 60 1200 30 L1200 60 L0 60Z" fill={fillColor} />
      </svg>
    </div>
  );
}

function AngleDivider({
  fillColor = "var(--color-background)",
  position,
  className,
}: DividerProps): React.ReactElement {
  const isTop = position === "top";
  const style: React.CSSProperties = {
    ...BASE_STYLES,
    ...(isTop ? { top: -1 } : { bottom: -1 }),
    ...(isTop ? { transform: "rotate(180deg)" } : {}),
  };

  return (
    <div className={className} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "clamp(20px, 3vw, 40px)" }}
      >
        <polygon points="0,40 1200,0 1200,40" fill={fillColor} />
      </svg>
    </div>
  );
}

function CurveDivider({
  fillColor = "var(--color-background)",
  position,
  className,
}: DividerProps): React.ReactElement {
  const isTop = position === "top";
  const style: React.CSSProperties = {
    ...BASE_STYLES,
    ...(isTop ? { top: -1 } : { bottom: -1 }),
    ...(isTop ? { transform: "rotate(180deg)" } : {}),
  };

  return (
    <div className={className} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 1200 50"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "clamp(25px, 3.5vw, 50px)" }}
      >
        <path d="M0 50 Q600 0 1200 50 L1200 50 L0 50Z" fill={fillColor} />
      </svg>
    </div>
  );
}

function ZigzagDivider({
  fillColor = "var(--color-background)",
  position,
  className,
}: DividerProps): React.ReactElement {
  const isTop = position === "top";
  const style: React.CSSProperties = {
    ...BASE_STYLES,
    ...(isTop ? { top: -1 } : { bottom: -1 }),
    ...(isTop ? { transform: "rotate(180deg)" } : {}),
  };

  return (
    <div className={className} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 1200 30"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "clamp(15px, 2vw, 30px)" }}
      >
        <polygon
          points="0,30 60,0 120,30 180,0 240,30 300,0 360,30 420,0 480,30 540,0 600,30 660,0 720,30 780,0 840,30 900,0 960,30 1020,0 1080,30 1140,0 1200,30"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

// ── Divider lookup ──────────────────────────────────────────

const DIVIDER_MAP: Record<string, React.ComponentType<DividerProps>> = {
  wave: WaveDivider,
  angle: AngleDivider,
  curve: CurveDivider,
  zigzag: ZigzagDivider,
};

/**
 * Renders a section divider by style name.
 * Returns null for "none" or unknown styles.
 */
export function SectionDivider({
  style: dividerStyle,
  ...props
}: DividerProps & { style: DividerStyle }): React.ReactElement | null {
  if (dividerStyle === "none") return null;
  const Component = DIVIDER_MAP[dividerStyle];
  return Component ? <Component {...props} /> : null;
}

export { WaveDivider, AngleDivider, CurveDivider, ZigzagDivider };
export type { DividerProps };

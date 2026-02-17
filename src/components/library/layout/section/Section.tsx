"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { SectionDivider } from "@/lib/visuals/section-dividers";
import type { SectionProps } from "./section.types";

/** Map spacing preset to CSS padding using theme tokens. */
const SPACING_MAP: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
};

/** Map background preset to CSS styles. */
const BACKGROUND_MAP: Record<NonNullable<SectionProps["background"]>, React.CSSProperties> = {
  default: { backgroundColor: "var(--color-background)" },
  surface: { backgroundColor: "var(--color-surface)" },
  elevated: { backgroundColor: "var(--color-surface-elevated)" },
  primary: {
    backgroundColor: "var(--color-primary)",
    color: "var(--color-text-on-primary)",
  },
  dark: {
    backgroundColor: "var(--color-background)",
    color: "var(--color-text-on-dark)",
  },
  none: {},
};

/**
 * Section — universal layout wrapper.
 *
 * Provides consistent vertical spacing, background control, and a
 * max-width container. Every content block in a generated page is
 * wrapped in a Section.
 *
 * All visual values come from CSS Custom Properties (theme tokens).
 */
export function Section({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  background = "default",
  contained = true,
  narrow = false,
  borderTop = false,
  borderBottom = false,
  dividerTop,
  dividerBottom,
  pattern,
  patternSize,
  patternPosition,
  patternOpacity = 0.06,
  children,
}: SectionProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Inline theme overrides
  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const bgStyle = BACKGROUND_MAP[background];
  const padding = SPACING_MAP[spacing];

  const sectionStyle: React.CSSProperties = {
    ...themeStyle,
    ...bgStyle,
    paddingTop: padding,
    paddingBottom: padding,
    borderTop: borderTop ? "1px solid var(--color-border-light)" : undefined,
    borderBottom: borderBottom ? "1px solid var(--color-border-light)" : undefined,
    transitionProperty: "background-color, color, border-color",
    transitionDuration: "var(--transition-base)",
    transitionTimingFunction: "var(--ease-default)",
  };

  const containerStyle: React.CSSProperties = contained
    ? {
        maxWidth: narrow ? "var(--container-narrow)" : "var(--container-max)",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }
    : {};

  const patternOverlay = pattern ? (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: pattern,
        backgroundSize: patternSize ?? "auto",
        backgroundPosition: patternPosition ?? "0 0",
        opacity: patternOpacity,
      }}
      aria-hidden="true"
    />
  ) : null;

  const content = contained ? <div style={containerStyle}>{children}</div> : children;

  const innerContent = (
    <>
      {dividerTop ? <SectionDivider style={dividerTop} position="top" /> : null}
      {patternOverlay}
      {content}
      {dividerBottom ? <SectionDivider style={dividerBottom} position="bottom" /> : null}
    </>
  );

  if (!animate) {
    return (
      <section
        ref={ref}
        id={id}
        className={cn("relative overflow-hidden", className)}
        style={sectionStyle}
      >
        {innerContent}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      className={cn("relative overflow-hidden", className)}
      style={sectionStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {innerContent}
    </motion.section>
  );
}

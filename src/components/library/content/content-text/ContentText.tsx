"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { sanitizeHtml } from "@/lib/sanitize";
import type { ContentTextProps } from "./content-text.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-element)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

const WIDTH_MAP = {
  narrow: "var(--container-narrow)",
  medium: "48rem",
  wide: "var(--container-max)",
} as const;

/**
 * ContentText — typography-focused text section.
 *
 * Variant: "centered"
 * Clean centered text block with constrained max-width for readability.
 */
export function ContentText({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  body,
  textAlign = "center",
  maxWidth = "narrow",
  eyebrow,
}: ContentTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative w-full", className)}
      style={{
        ...themeStyle,
        backgroundColor: "var(--color-background)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={headline ?? "Content"}
    >
      <motion.div
        className={cn("mx-auto px-6", textAlign === "center" ? "text-center" : "text-left")}
        style={{ maxWidth: WIDTH_MAP[maxWidth] }}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-semibold)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            {eyebrow}
          </p>
        )}

        {/* Headline */}
        {headline && (
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(var(--text-2xl), 3vw, var(--text-4xl))",
              fontWeight: "var(--weight-bold)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
              color: "var(--color-text)",
            }}
          >
            {headline}
          </h2>
        )}

        {/* Body */}
        <div
          className={cn(headline ? "mt-6" : "")}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-lg)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }}
        />
      </motion.div>
    </section>
  );
}

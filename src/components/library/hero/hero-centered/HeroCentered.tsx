"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { HeroCenteredProps } from "./hero-centered.types";
import { HEIGHT_MAP, SPACING_MAP, CTAButtonEl } from "./shared";
import { WithBgImage } from "./variants/with-bg-image";
import { GradientBg } from "./variants/gradient-bg";

/**
 * HeroCentered — full-width hero with centered text content.
 *
 * Variants:
 *  - "with-bg-image": Background image with dark gradient overlay
 *  - "gradient-bg": Dynamic gradient mesh from theme colors
 */
export function HeroCentered({
  id,
  className,
  theme,
  animate = true,
  spacing,
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  overlayOpacity = 0.5,
  height = "viewport",
  textAlign = "center",
  badge,
  variant = "with-bg-image",
}: HeroCenteredProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const isImageVariant = variant === "with-bg-image" && backgroundImage;

  const paddingY = spacing ? SPACING_MAP[spacing] : undefined;

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative flex w-full items-center justify-center overflow-hidden", className)}
      style={{
        ...themeStyle,
        minHeight: HEIGHT_MAP[height],
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={headline}
    >
      {/* Background: image variant */}
      {isImageVariant && (
        <WithBgImage backgroundImage={backgroundImage} overlayOpacity={overlayOpacity} />
      )}

      {/* Background: gradient mesh variant */}
      {variant === "gradient-bg" && <GradientBg />}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex flex-col px-6",
          textAlign === "center" ? "items-center text-center" : "items-start text-left"
        )}
        style={{ maxWidth: "var(--container-narrow)" }}
      >
        {/* Badge */}
        {badge && (
          <motion.span
            className="mb-6 inline-flex items-center px-4 py-1.5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              color: isImageVariant ? "var(--color-text-on-dark)" : "var(--color-primary)",
              borderRadius: "var(--radius-full)",
              border: isImageVariant
                ? "1px solid rgba(255,255,255,0.2)"
                : "1px solid var(--color-border)",
              backgroundColor: isImageVariant ? "rgba(255,255,255,0.1)" : "var(--color-surface)",
              backdropFilter: "blur(8px)",
            }}
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {badge}
          </motion.span>
        )}

        {/* Headline */}
        <motion.h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(var(--text-4xl), 6vw, var(--text-7xl))",
            fontWeight: "var(--weight-bold)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            color: isImageVariant ? "var(--color-text-on-dark)" : "var(--color-text)",
          }}
          initial={animate ? { opacity: 0, y: 30 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: badge ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            className="mt-6"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(var(--text-lg), 2vw, var(--text-xl))",
              lineHeight: "var(--leading-relaxed)",
              color: isImageVariant ? "rgba(255,255,255,0.8)" : "var(--color-text-secondary)",
              maxWidth: "var(--container-narrow)",
            }}
            initial={animate ? { opacity: 0, y: 25 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.6, delay: badge ? 0.2 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTAs */}
        {(ctaPrimary || ctaSecondary) && (
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: badge ? 0.3 : 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {ctaPrimary && (
              <CTAButtonEl
                text={ctaPrimary.text}
                href={ctaPrimary.href}
                variant={ctaPrimary.variant}
                external={ctaPrimary.external}
              />
            )}
            {ctaSecondary && (
              <CTAButtonEl
                text={ctaSecondary.text}
                href={ctaSecondary.href}
                variant={ctaSecondary.variant ?? "outline"}
                external={ctaSecondary.external}
              />
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

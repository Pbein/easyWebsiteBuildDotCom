"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { HeroCenteredProps } from "./hero-centered.types";

const HEIGHT_MAP = {
  viewport: "100vh",
  large: "80vh",
  medium: "60vh",
} as const;

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-element)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

function CTAButtonEl({
  text,
  href,
  variant = "primary",
  external,
}: {
  text: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  external?: boolean;
}) {
  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    fontWeight: "var(--weight-semibold)",
    borderRadius: "var(--radius-lg)",
    transitionProperty: "background-color, color, border-color, box-shadow",
    transitionDuration: "var(--transition-fast)",
    transitionTimingFunction: "var(--ease-default)",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--color-primary)",
      color: "var(--color-text-on-primary)",
    },
    secondary: {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
      border: "1px solid var(--color-border)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--color-primary)",
      border: "1px solid var(--color-primary)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-primary)",
    },
  };

  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-7 py-3.5"
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-primary)";
        }
      }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {text}
    </a>
  );
}

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
}: HeroCenteredProps) {
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
        <>
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.6}) 0%, rgba(0,0,0,${overlayOpacity}) 60%, rgba(0,0,0,${overlayOpacity * 1.2 > 1 ? 1 : overlayOpacity * 1.2}) 100%)`,
            }}
          />
        </>
      )}

      {/* Background: gradient mesh variant */}
      {variant === "gradient-bg" && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "var(--color-background)" }}
          />
          <div
            className="absolute -top-1/2 -left-1/4 h-full w-3/4 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--color-primary) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute -right-1/4 -bottom-1/3 h-3/4 w-2/3 opacity-25"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--color-secondary) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            className="absolute top-1/4 right-1/3 h-1/2 w-1/2 opacity-15"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 60%)",
              filter: "blur(100px)",
            }}
          />
        </div>
      )}

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

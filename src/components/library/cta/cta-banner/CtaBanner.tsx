"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { CtaBannerProps } from "./cta-banner.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

function getBgStyles(bgVariant: CtaBannerProps["backgroundVariant"]): React.CSSProperties {
  switch (bgVariant) {
    case "dark":
      return { backgroundColor: "var(--color-surface)", color: "var(--color-text)" };
    case "gradient":
      return {
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-secondary) 100%)",
        color: "var(--color-text-on-primary)",
      };
    case "image":
      return { color: "var(--color-text-on-dark)" };
    case "primary":
    default:
      return {
        backgroundColor: "var(--color-primary)",
        color: "var(--color-text-on-primary)",
      };
  }
}

/**
 * CtaBanner — bold call-to-action banner.
 *
 * Variants:
 *  - "full-width": edge-to-edge banner
 *  - "contained": card-style within container with rounded corners
 */
export function CtaBanner({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  backgroundVariant = "primary",
  backgroundImage,
  variant = "full-width",
}: CtaBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];
  const bgStyles = getBgStyles(backgroundVariant);
  const isOnColor = backgroundVariant !== "dark";
  const isContained = variant === "contained";

  const bannerContent = (
    <div
      className={cn("relative overflow-hidden", isContained ? "mx-auto px-6" : "")}
      style={isContained ? { maxWidth: "var(--container-max)" } : undefined}
    >
      <motion.div
        className={cn(
          "relative flex flex-col items-center justify-center px-8 py-20 text-center md:px-16 md:py-24",
          isContained ? "overflow-hidden" : ""
        )}
        style={{
          ...bgStyles,
          ...(isContained
            ? { borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)" }
            : {}),
        }}
        initial={animate ? { opacity: 0, y: 24 } : false}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background image */}
        {backgroundVariant === "image" && backgroundImage && (
          <>
            <Image
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} />
          </>
        )}

        {/* Content */}
        <div className="relative z-10" style={{ maxWidth: "var(--container-narrow)" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(var(--text-2xl), 3vw, var(--text-4xl))",
              fontWeight: "var(--weight-bold)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            {headline}
          </h2>

          {subheadline && (
            <p
              className="mx-auto mt-4"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-lg)",
                lineHeight: "var(--leading-normal)",
                opacity: 0.85,
                maxWidth: "var(--container-narrow)",
              }}
            >
              {subheadline}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={ctaPrimary.href}
              className="inline-flex items-center justify-center px-8 py-4 transition-all"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                fontWeight: "var(--weight-semibold)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: isOnColor
                  ? "var(--color-surface-elevated)"
                  : "var(--color-primary)",
                color: isOnColor ? "var(--color-text)" : "var(--color-text-on-primary)",
                boxShadow: "var(--shadow-lg)",
                transitionDuration: "var(--transition-fast)",
                transitionTimingFunction: "var(--ease-default)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              {...(ctaPrimary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {ctaPrimary.text}
            </a>

            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center px-8 py-4 transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--weight-semibold)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "transparent",
                  color: "inherit",
                  border: isOnColor
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid var(--color-border)",
                  transitionDuration: "var(--transition-fast)",
                }}
                {...(ctaSecondary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {ctaSecondary.text}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative w-full", className)}
      style={{
        ...themeStyle,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        backgroundColor: isContained ? "var(--color-background)" : undefined,
      }}
      aria-label={headline}
    >
      {bannerContent}
    </section>
  );
}

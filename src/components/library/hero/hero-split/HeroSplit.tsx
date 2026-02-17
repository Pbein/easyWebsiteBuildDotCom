"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { ImagePlaceholder } from "@/lib/visuals/image-placeholder";
import type { HeroSplitProps } from "./hero-split.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-element)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

const ASPECT_MAP = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
} as const;

/**
 * HeroSplit — two-column hero with text and image.
 *
 * Variants:
 *  - "image-right": Text left, image right
 *  - "image-left": Image left, text right
 */
export function HeroSplit({
  id,
  className,
  theme,
  animate = true,
  spacing,
  headline,
  subheadline,
  body,
  ctaPrimary,
  ctaSecondary,
  image,
  imagePosition,
  imageAspect = "landscape",
  badge,
  features,
  variant = "image-right",
}: HeroSplitProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const imgOnRight = imagePosition ? imagePosition === "right" : variant === "image-right";
  const paddingY = spacing ? SPACING_MAP[spacing] : "var(--space-section)";

  const textSlide = imgOnRight ? -40 : 40;
  const imgSlide = imgOnRight ? 40 : -40;

  const textContent = (
    <motion.div
      className="flex flex-col justify-center"
      initial={animate ? { opacity: 0, x: textSlide } : false}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: textSlide }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {badge && (
        <span
          className="mb-4 inline-flex items-center self-start px-3 py-1"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--color-primary)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          {badge}
        </span>
      )}

      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(var(--text-3xl), 4vw, var(--text-6xl))",
          fontWeight: "var(--weight-bold)",
          lineHeight: "var(--leading-tight)",
          letterSpacing: "var(--tracking-tight)",
          color: "var(--color-text)",
        }}
      >
        {headline}
      </h1>

      {subheadline && (
        <p
          className="mt-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(var(--text-base), 2vw, var(--text-xl))",
            lineHeight: "var(--leading-normal)",
            color: "var(--color-text-secondary)",
          }}
        >
          {subheadline}
        </p>
      )}

      {body && (
        <p
          className="mt-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
          }}
        >
          {body}
        </p>
      )}

      {features && features.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center"
                style={{
                  color: "var(--color-primary)",
                }}
              >
                <Check size={16} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  color: "var(--color-text)",
                }}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {(ctaPrimary || ctaSecondary) && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {ctaPrimary && (
            <a
              href={ctaPrimary.href}
              className="inline-flex items-center justify-center px-5 py-3 transition-colors md:px-7 md:py-3.5"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                fontWeight: "var(--weight-semibold)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
                transitionDuration: "var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary)";
              }}
              {...(ctaPrimary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {ctaPrimary.text}
            </a>
          )}
          {ctaSecondary && (
            <a
              href={ctaSecondary.href}
              className="inline-flex items-center justify-center px-5 py-3 transition-colors md:px-7 md:py-3.5"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                fontWeight: "var(--weight-semibold)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "transparent",
                color: "var(--color-primary)",
                border: "1px solid var(--color-primary)",
                transitionDuration: "var(--transition-fast)",
              }}
              {...(ctaSecondary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {ctaSecondary.text}
            </a>
          )}
        </div>
      )}
    </motion.div>
  );

  const hasImage = image?.src;

  const imageContent = (
    <motion.div
      className="relative"
      initial={animate ? { opacity: 0, x: imgSlide } : false}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imgSlide }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Decorative accent behind image */}
      <div
        className="absolute -inset-4 -z-10"
        style={{
          borderRadius: "var(--radius-xl)",
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
          opacity: 0.1,
        }}
      />
      {hasImage ? (
        <div
          className={cn("relative overflow-hidden", ASPECT_MAP[imageAspect])}
          style={{ borderRadius: "var(--radius-xl)" }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            {...(image.blurDataURL ? { placeholder: "blur", blurDataURL: image.blurDataURL } : {})}
          />
        </div>
      ) : (
        <ImagePlaceholder
          variant="gradient"
          aspectRatio={ASPECT_MAP[imageAspect]}
          borderRadius="var(--radius-xl)"
        />
      )}
    </motion.div>
  );

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        ...themeStyle,
        backgroundColor: "var(--color-background)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={headline}
    >
      <div
        className="mx-auto grid items-center gap-6 px-6 md:grid-cols-2 md:gap-16"
        style={{ maxWidth: "var(--container-max)" }}
      >
        {imgOnRight ? (
          <>
            {textContent}
            {imageContent}
          </>
        ) : (
          <>
            {imageContent}
            {textContent}
          </>
        )}
      </div>
    </section>
  );
}

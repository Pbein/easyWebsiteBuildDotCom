"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { ImagePlaceholder } from "@/lib/visuals/image-placeholder";
import type { ContentSplitProps } from "./content-split.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

const IMAGE_RADIUS_MAP = {
  rounded: "var(--radius-xl)",
  sharp: "0",
  overlap: "var(--radius-lg)",
} as const;

/**
 * ContentSplit — alternating image/text rows.
 *
 * Variant: "alternating"
 * Rows alternate image placement (right, left, right, ...).
 */
export function ContentSplit({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  sections,
  imageStyle = "rounded",
  ...rest
}: ContentSplitProps & Record<string, unknown>) {
  // Defensive: AI may send "rows" instead of "sections"
  const resolvedSections =
    sections ?? (rest as { rows?: ContentSplitProps["sections"] }).rows ?? [];

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];

  if (resolvedSections.length === 0) return null;

  return (
    <section
      id={id}
      className={cn("relative w-full", className)}
      style={{
        ...themeStyle,
        backgroundColor: "var(--color-background)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label="Content sections"
    >
      <div
        className="mx-auto flex flex-col px-6"
        style={{
          maxWidth: "var(--container-max)",
          gap: "clamp(var(--space-component), 4vw, var(--space-section))",
        }}
      >
        {resolvedSections.map((section, i) => (
          <SplitRow
            key={i}
            index={i}
            headline={section.headline}
            body={section.body}
            image={section.image}
            ctaText={section.ctaText}
            ctaLink={section.ctaLink}
            imageRadius={IMAGE_RADIUS_MAP[imageStyle]}
            animate={animate}
          />
        ))}
      </div>
    </section>
  );
}

function SplitRow({
  index,
  headline,
  body,
  image,
  ctaText,
  ctaLink,
  imageRadius,
  animate,
}: {
  index: number;
  headline: string;
  body: string;
  image?: { src: string; alt: string; blurDataURL?: string };
  ctaText?: string;
  ctaLink?: string;
  imageRadius: string;
  animate: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const imgOnRight = index % 2 === 0;

  const textContent = (
    <motion.div
      className="flex flex-col justify-center"
      initial={animate ? { opacity: 0, x: imgOnRight ? -30 : 30 } : false}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imgOnRight ? -30 : 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(var(--text-xl), 2.5vw, var(--text-3xl))",
          fontWeight: "var(--weight-bold)",
          lineHeight: "var(--leading-tight)",
          letterSpacing: "var(--tracking-tight)",
          color: "var(--color-text)",
        }}
      >
        {headline}
      </h3>
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
      {ctaText && ctaLink && (
        <a
          href={ctaLink}
          className="mt-6 inline-flex items-center gap-2 transition-colors"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-primary)",
            transitionDuration: "var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-primary-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-primary)";
          }}
        >
          {ctaText}
          <ArrowRight size={16} />
        </a>
      )}
    </motion.div>
  );

  const hasImage = image?.src;

  const imageContent = (
    <motion.div
      className="relative overflow-hidden"
      style={{ borderRadius: imageRadius }}
      initial={animate ? { opacity: 0, x: imgOnRight ? 30 : -30 } : false}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imgOnRight ? 30 : -30 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {hasImage ? (
        <div className="relative aspect-[4/3]">
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
        <ImagePlaceholder variant="gradient" aspectRatio="aspect-[4/3]" borderRadius="0px" />
      )}
    </motion.div>
  );

  return (
    <div ref={ref} className="grid items-center gap-6 md:grid-cols-2 md:gap-16">
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
  );
}

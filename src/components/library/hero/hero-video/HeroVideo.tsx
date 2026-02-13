"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { ImagePlaceholder } from "@/lib/visuals/image-placeholder";
import type { HeroVideoProps } from "./hero-video.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-element)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

/**
 * VideoPlaceholder — a themed placeholder representing the video area.
 * Shows posterImage as background if provided, otherwise a gradient.
 * Always shows a play button overlay.
 */
function VideoPlaceholder({
  posterImage,
  aspectRatio = "aspect-video",
  borderRadius,
  showControls = false,
}: {
  posterImage?: HeroVideoProps["posterImage"];
  aspectRatio?: string;
  borderRadius?: string;
  showControls?: boolean;
}): React.ReactElement {
  const hasPoster = posterImage?.src;

  return (
    <div
      className={cn("relative overflow-hidden", aspectRatio)}
      style={{ borderRadius: borderRadius ?? "var(--radius-xl)" }}
    >
      {/* Background: poster image or gradient placeholder */}
      {hasPoster ? (
        <Image
          src={posterImage.src}
          alt={posterImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          {...(posterImage.blurDataURL
            ? { placeholder: "blur", blurDataURL: posterImage.blurDataURL }
            : {})}
        />
      ) : (
        <ImagePlaceholder
          variant="gradient"
          aspectRatio={aspectRatio}
          borderRadius={borderRadius ?? "var(--radius-xl)"}
        />
      )}

      {/* Dark overlay for contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          className="group flex items-center justify-center transition-transform hover:scale-110"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary)",
            boxShadow: "var(--shadow-lg)",
            transitionDuration: "var(--transition-fast)",
          }}
          aria-label="Play video"
        >
          <Play
            size={28}
            fill="var(--color-text-on-primary)"
            style={{ color: "var(--color-text-on-primary)", marginLeft: "3px" }}
          />
        </button>
      </div>

      {/* Simulated bottom controls bar */}
      {showControls && (
        <div
          className="absolute right-0 bottom-0 left-0 flex items-center gap-3 px-4 py-3"
          style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        >
          {/* Progress bar placeholder */}
          <div
            className="h-1 flex-1 overflow-hidden"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: "rgba(255,255,255,0.25)",
            }}
          >
            <div
              className="h-full"
              style={{
                width: "35%",
                backgroundColor: "var(--color-primary)",
                borderRadius: "var(--radius-full)",
              }}
            />
          </div>
          <Volume2 size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
 * BACKGROUND VIDEO VARIANT
 * ────────────────────────────────────────────── */

function BackgroundVideoVariant({
  headline,
  subheadline,
  cta,
  secondaryCta,
  posterImage,
  overlayOpacity,
  animate,
  isInView,
  spacing,
}: HeroVideoProps & { isInView: boolean }): React.ReactElement {
  const hasPoster = posterImage?.src;
  const paddingY = spacing ? SPACING_MAP[spacing] : undefined;

  return (
    <>
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        {hasPoster ? (
          <Image
            src={posterImage.src}
            alt={posterImage.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            {...(posterImage.blurDataURL
              ? { placeholder: "blur", blurDataURL: posterImage.blurDataURL }
              : {})}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-secondary) 50%, var(--color-primary) 100%)",
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity ?? 0.55})`,
          }}
        />
      </div>

      {/* Content layer */}
      <div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{
          maxWidth: "var(--container-narrow)",
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
      >
        {/* Play icon badge */}
        <motion.div
          className="mb-6 flex items-center justify-center"
          initial={animate ? { opacity: 0, scale: 0.8 } : false}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="flex items-center justify-center transition-transform hover:scale-110"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary)",
              boxShadow: "var(--shadow-xl)",
              transitionDuration: "var(--transition-fast)",
              cursor: "pointer",
            }}
          >
            <Play
              size={32}
              fill="var(--color-text-on-primary)"
              style={{ color: "var(--color-text-on-primary)", marginLeft: "4px" }}
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(var(--text-3xl), 5vw, var(--text-7xl))",
            fontWeight: "var(--weight-bold)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            color: "var(--color-text-on-dark)",
          }}
          initial={animate ? { opacity: 0, y: 30 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            className="mt-6"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(var(--text-base), 2vw, var(--text-xl))",
              lineHeight: "var(--leading-relaxed)",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "var(--container-narrow)",
            }}
            initial={animate ? { opacity: 0, y: 25 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTAs */}
        {(cta || secondaryCta) && (
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {cta && (
              <a
                href={cta.href}
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
                {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {cta.text}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center px-5 py-3 transition-colors md:px-7 md:py-3.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--weight-semibold)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "transparent",
                  color: "var(--color-text-on-dark)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  transitionDuration: "var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                {...(secondaryCta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {secondaryCta.text}
              </a>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────
 * EMBEDDED VARIANT
 * ────────────────────────────────────────────── */

function EmbeddedVariant({
  headline,
  subheadline,
  cta,
  secondaryCta,
  posterImage,
  animate,
  isInView,
}: HeroVideoProps & { isInView: boolean }): React.ReactElement {
  return (
    <div
      className="mx-auto grid items-center gap-6 px-6 md:grid-cols-2 md:gap-16"
      style={{ maxWidth: "var(--container-max)" }}
    >
      {/* Text content */}
      <motion.div
        className="flex flex-col justify-center"
        initial={animate ? { opacity: 0, x: -40 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
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
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {subheadline}
          </p>
        )}

        {(cta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {cta && (
              <a
                href={cta.href}
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
                {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {cta.text}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
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
                {...(secondaryCta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {secondaryCta.text}
              </a>
            )}
          </div>
        )}
      </motion.div>

      {/* Video embed area */}
      <motion.div
        className="relative"
        initial={animate ? { opacity: 0, x: 40 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative accent behind video */}
        <div
          className="absolute -inset-4 -z-10"
          style={{
            borderRadius: "var(--radius-xl)",
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            opacity: 0.1,
          }}
        />
        <VideoPlaceholder
          posterImage={posterImage}
          aspectRatio="aspect-video"
          borderRadius="var(--radius-xl)"
          showControls
        />
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────
 * SPLIT VIDEO VARIANT
 * ────────────────────────────────────────────── */

function SplitVideoVariant({
  headline,
  subheadline,
  cta,
  secondaryCta,
  posterImage,
  animate,
  isInView,
}: HeroVideoProps & { isInView: boolean }): React.ReactElement {
  return (
    <div
      className="mx-auto grid items-center gap-6 px-6 md:grid-cols-2 md:gap-16"
      style={{ maxWidth: "var(--container-max)" }}
    >
      {/* Video on left */}
      <motion.div
        className="relative order-2 md:order-1"
        initial={animate ? { opacity: 0, x: -40 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative accent behind video */}
        <div
          className="absolute -inset-4 -z-10"
          style={{
            borderRadius: "var(--radius-xl)",
            background:
              "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)",
            opacity: 0.1,
          }}
        />
        <VideoPlaceholder
          posterImage={posterImage}
          aspectRatio="aspect-[4/3]"
          borderRadius="var(--radius-xl)"
          showControls
        />
      </motion.div>

      {/* Text on right */}
      <motion.div
        className="order-1 flex flex-col justify-center md:order-2"
        initial={animate ? { opacity: 0, x: 40 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Video badge */}
        <span
          className="mb-4 inline-flex items-center gap-2 self-start px-3 py-1"
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
          <Play size={14} style={{ color: "var(--color-primary)" }} />
          Watch Video
        </span>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(var(--text-3xl), 4vw, var(--text-5xl))",
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
              fontSize: "clamp(var(--text-base), 2vw, var(--text-lg))",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {subheadline}
          </p>
        )}

        {(cta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {cta && (
              <a
                href={cta.href}
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
                {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {cta.text}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
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
                {...(secondaryCta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {secondaryCta.text}
              </a>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────
 * MAIN COMPONENT
 * ────────────────────────────────────────────── */

/**
 * HeroVideo — hero section with video as the focal point.
 *
 * Variants:
 *  - "background-video" — Full-width with video/poster behind centered text
 *  - "embedded"         — Split layout: text left, video embed right
 *  - "split-video"      — Half-width video left, text right
 */
export function HeroVideo({
  id,
  className,
  theme,
  animate = true,
  spacing,
  headline,
  subheadline,
  cta,
  secondaryCta,
  videoUrl,
  posterImage,
  variant = "background-video",
  overlayOpacity = 0.55,
}: HeroVideoProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = spacing ? SPACING_MAP[spacing] : "var(--space-section)";

  const isBackgroundVariant = variant === "background-video";

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative w-full overflow-hidden",
        isBackgroundVariant && "flex min-h-[70vh] items-center justify-center",
        className
      )}
      style={{
        ...themeStyle,
        backgroundColor: isBackgroundVariant ? undefined : "var(--color-background)",
        paddingTop: isBackgroundVariant ? undefined : paddingY,
        paddingBottom: isBackgroundVariant ? undefined : paddingY,
      }}
      aria-label={headline}
    >
      {variant === "background-video" && (
        <BackgroundVideoVariant
          headline={headline}
          subheadline={subheadline}
          cta={cta}
          secondaryCta={secondaryCta}
          videoUrl={videoUrl}
          posterImage={posterImage}
          overlayOpacity={overlayOpacity}
          animate={animate}
          spacing={spacing}
          isInView={isInView}
        />
      )}

      {variant === "embedded" && (
        <EmbeddedVariant
          headline={headline}
          subheadline={subheadline}
          cta={cta}
          secondaryCta={secondaryCta}
          videoUrl={videoUrl}
          posterImage={posterImage}
          animate={animate}
          isInView={isInView}
        />
      )}

      {variant === "split-video" && (
        <SplitVideoVariant
          headline={headline}
          subheadline={subheadline}
          cta={cta}
          secondaryCta={secondaryCta}
          videoUrl={videoUrl}
          posterImage={posterImage}
          animate={animate}
          isInView={isInView}
        />
      )}
    </section>
  );
}

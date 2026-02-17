"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { SPACING_MAP } from "@/components/library/spacing";
import type { ProofBeforeAfterProps, ComparisonItem } from "./proof-beforeafter.types";

/* ------------------------------------------------------------------ */
/*  Slider Comparison                                                  */
/* ------------------------------------------------------------------ */

function SliderComparison({
  item,
  animate,
  isInView,
  index,
}: {
  item: ComparisonItem;
  animate: boolean;
  isInView: boolean;
  index: number;
}): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const beforeLabel = item.beforeLabel ?? "Before";
  const afterLabel = item.afterLabel ?? "After";

  const handleMove = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      handleMove(e.clientX);

      const onMouseMove = (ev: MouseEvent): void => {
        handleMove(ev.clientX);
      };

      const onMouseUp = (): void => {
        setIsDragging(false);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [handleMove]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 30 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        style={{
          aspectRatio: "16 / 9",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-md)",
          cursor: isDragging ? "grabbing" : "ew-resize",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="slider"
        aria-label={`${beforeLabel} / ${afterLabel} comparison slider`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setPosition((p) => Math.max(0, p - 2));
          } else if (e.key === "ArrowRight") {
            setPosition((p) => Math.min(100, p + 2));
          }
        }}
      >
        {/* After image — fills entire container */}
        <Image
          src={item.afterImage.src}
          alt={item.afterImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
          draggable={false}
        />

        {/* Before image — clipped to slider position */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <Image
            src={item.beforeImage.src}
            alt={item.beforeImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            draggable={false}
            style={{ maxWidth: "none" }}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
            width: "2px",
            backgroundColor: "var(--color-surface-elevated)",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.3)",
          }}
        />

        {/* Handle */}
        <div
          className="absolute z-20 flex items-center justify-center"
          style={{
            left: `${position}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-surface-elevated)",
            border: "2px solid var(--color-border-light)",
            boxShadow: "var(--shadow-lg)",
            color: "var(--color-text)",
            transition: isDragging ? "none" : "box-shadow var(--transition-fast)",
          }}
        >
          <ArrowLeftRight size={20} />
        </div>

        {/* Before label */}
        <div
          className="absolute z-10"
          style={{
            top: "var(--space-tight)",
            left: "var(--space-tight)",
            padding: "4px 12px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-surface)",
            opacity: 0.9,
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text)",
            letterSpacing: "0.02em",
            pointerEvents: "none",
          }}
        >
          {beforeLabel}
        </div>

        {/* After label */}
        <div
          className="absolute z-10"
          style={{
            top: "var(--space-tight)",
            right: "var(--space-tight)",
            padding: "4px 12px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-surface)",
            opacity: 0.9,
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text)",
            letterSpacing: "0.02em",
            pointerEvents: "none",
          }}
        >
          {afterLabel}
        </div>
      </div>

      {/* Caption */}
      {item.caption && (
        <p
          className="mt-3 text-center"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-text-secondary)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {item.caption}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Side-by-Side Comparison                                            */
/* ------------------------------------------------------------------ */

function SideBySideComparison({
  item,
  animate,
  isInView,
  index,
}: {
  item: ComparisonItem;
  animate: boolean;
  isInView: boolean;
  index: number;
}): React.ReactElement {
  const beforeLabel = item.beforeLabel ?? "Before";
  const afterLabel = item.afterLabel ?? "After";

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 30 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Before */}
        <div>
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-text-secondary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {beforeLabel}
          </p>
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16 / 9",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Image
              src={item.beforeImage.src}
              alt={item.beforeImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* After */}
        <div>
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-accent)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {afterLabel}
          </p>
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16 / 9",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Image
              src={item.afterImage.src}
              alt={item.afterImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Caption */}
      {item.caption && (
        <p
          className="mt-3 text-center"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-text-secondary)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {item.caption}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

/**
 * ProofBeforeAfter -- before/after comparison component.
 *
 * "slider" variant: interactive drag slider revealing before/after images.
 * "side-by-side" variant: static two-column comparison layout.
 */
export function ProofBeforeAfter({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  comparisons,
  variant = "slider",
}: ProofBeforeAfterProps): React.ReactElement {
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
      aria-label={headline ?? "Before & After"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Header */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-6 text-center md:mb-12"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
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
            {subheadline && (
              <p
                className="mx-auto mt-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-lg)",
                  lineHeight: "var(--leading-relaxed)",
                  color: "var(--color-text-secondary)",
                  maxWidth: "42rem",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Comparisons */}
        <div className="flex flex-col" style={{ gap: "var(--space-component)" }}>
          {comparisons.map((item, i) =>
            variant === "slider" ? (
              <SliderComparison
                key={i}
                item={item}
                animate={animate}
                isInView={isInView}
                index={i}
              />
            ) : (
              <SideBySideComparison
                key={i}
                item={item}
                animate={animate}
                isInView={isInView}
                index={i}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { ContentTimelineProps, TimelineItem } from "./content-timeline.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

function getIcon(name: string): React.ReactNode {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon size={16} />;
}

/* ------------------------------------------------------------------ */
/*  Vertical variant — single-column timeline item                    */
/* ------------------------------------------------------------------ */

function VerticalItem({
  item,
  index,
  animate,
  isInView,
  showConnector,
  isLast,
}: {
  item: TimelineItem;
  index: number;
  animate: boolean;
  isInView: boolean;
  showConnector: boolean;
  isLast: boolean;
}): React.ReactElement {
  const hasIcon = item.icon && getIcon(item.icon);

  return (
    <div
      className="relative flex gap-3 md:gap-6"
      style={{ paddingBottom: isLast ? "0" : "var(--space-component)" }}
    >
      {/* Left rail: dot / icon + connector line */}
      <div className="relative flex flex-col items-center" style={{ width: "40px", flexShrink: 0 }}>
        {/* Dot / icon circle */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{
            width: hasIcon ? "32px" : "14px",
            height: hasIcon ? "32px" : "14px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-background)",
            boxShadow: "0 0 0 4px var(--color-background), 0 0 0 6px var(--color-primary-light)",
            marginTop: hasIcon ? "4px" : "8px",
          }}
        >
          {hasIcon && getIcon(item.icon!)}
        </div>

        {/* Connector line */}
        {showConnector && !isLast && (
          <div
            className="absolute top-0 w-0.5"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              top: hasIcon ? "40px" : "26px",
              bottom: "0",
              backgroundColor: "var(--color-border)",
              opacity: 0.4,
            }}
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className="min-w-0 flex-1"
        initial={animate ? { opacity: 0, x: 24 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Date badge */}
        {item.date && (
          <span
            className="mb-2 inline-block"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-primary)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            {item.date}
          </span>
        )}

        <div
          className="p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-lg)",
              fontWeight: "var(--weight-semibold)",
              lineHeight: "var(--leading-tight)",
              color: "var(--color-text)",
            }}
          >
            {item.title}
          </h3>

          <p
            className="mt-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {item.description}
          </p>

          {item.image && (
            <div
              className="relative mt-4 aspect-video overflow-hidden"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Alternating variant — items alternate left/right of center line   */
/* ------------------------------------------------------------------ */

function AlternatingItem({
  item,
  index,
  animate,
  isInView,
  showConnector,
  isLast,
}: {
  item: TimelineItem;
  index: number;
  animate: boolean;
  isInView: boolean;
  showConnector: boolean;
  isLast: boolean;
}): React.ReactElement {
  const isLeft = index % 2 === 0;
  const hasIcon = item.icon && getIcon(item.icon);

  return (
    <div className="relative" style={{ paddingBottom: isLast ? "0" : "var(--space-component)" }}>
      {/* Mobile: single-column layout (same as vertical) */}
      <div className="flex gap-3 md:hidden">
        {/* Left rail */}
        <div
          className="relative flex flex-col items-center"
          style={{ width: "40px", flexShrink: 0 }}
        >
          <div
            className="relative z-10 flex items-center justify-center"
            style={{
              width: hasIcon ? "32px" : "14px",
              height: hasIcon ? "32px" : "14px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-background)",
              boxShadow: "0 0 0 4px var(--color-background), 0 0 0 6px var(--color-primary-light)",
              marginTop: hasIcon ? "4px" : "8px",
            }}
          >
            {hasIcon && getIcon(item.icon!)}
          </div>
          {showConnector && !isLast && (
            <div
              className="absolute w-0.5"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: hasIcon ? "40px" : "26px",
                bottom: "0",
                backgroundColor: "var(--color-border)",
                opacity: 0.4,
              }}
            />
          )}
        </div>

        {/* Content card (mobile) */}
        <motion.div
          className="min-w-0 flex-1"
          initial={animate ? { opacity: 0, x: 24 } : false}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {item.date && (
            <span
              className="mb-2 inline-block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-primary)",
              }}
            >
              {item.date}
            </span>
          )}
          <div
            className="p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-lg)",
                fontWeight: "var(--weight-semibold)",
                lineHeight: "var(--leading-tight)",
                color: "var(--color-text)",
              }}
            >
              {item.title}
            </h3>
            <p
              className="mt-2"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-text-secondary)",
              }}
            >
              {item.description}
            </p>
            {item.image && (
              <div
                className="relative mt-4 aspect-video overflow-hidden"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Desktop: alternating two-column layout */}
      <div className="hidden md:flex md:items-start" style={{ gap: "0" }}>
        {/* Left column */}
        <div className={cn("flex w-1/2 pr-8", isLeft ? "justify-end" : "justify-end")}>
          {isLeft ? (
            <motion.div
              className="max-w-md"
              style={{ textAlign: "right" }}
              initial={animate ? { opacity: 0, x: -30 } : false}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {item.date && (
                <span
                  className="mb-2 inline-block"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--weight-medium)",
                    color: "var(--color-primary)",
                  }}
                >
                  {item.date}
                </span>
              )}
              <div
                className="p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-sm)",
                  textAlign: "right",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--weight-semibold)",
                    lineHeight: "var(--leading-tight)",
                    color: "var(--color-text)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: "var(--leading-relaxed)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {item.description}
                </p>
                {item.image && (
                  <div
                    className="relative mt-4 aspect-video overflow-hidden"
                    style={{ borderRadius: "var(--radius-md)" }}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Empty left column when item is on the right */
            <div />
          )}
        </div>

        {/* Center dot */}
        <div className="relative flex flex-col items-center" style={{ width: "0", flexShrink: 0 }}>
          <div
            className="relative z-10 flex items-center justify-center"
            style={{
              width: hasIcon ? "32px" : "14px",
              height: hasIcon ? "32px" : "14px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-background)",
              boxShadow: "0 0 0 4px var(--color-background), 0 0 0 6px var(--color-primary-light)",
              marginTop: hasIcon ? "4px" : "8px",
            }}
          >
            {hasIcon && getIcon(item.icon!)}
          </div>
        </div>

        {/* Right column */}
        <div className={cn("flex w-1/2 pl-8", !isLeft ? "justify-start" : "justify-start")}>
          {!isLeft ? (
            <motion.div
              className="max-w-md"
              style={{ textAlign: "left" }}
              initial={animate ? { opacity: 0, x: 30 } : false}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {item.date && (
                <span
                  className="mb-2 inline-block"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--weight-medium)",
                    color: "var(--color-primary)",
                  }}
                >
                  {item.date}
                </span>
              )}
              <div
                className="p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-sm)",
                  textAlign: "left",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--weight-semibold)",
                    lineHeight: "var(--leading-tight)",
                    color: "var(--color-text)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: "var(--leading-relaxed)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {item.description}
                </p>
                {item.image && (
                  <div
                    className="relative mt-4 aspect-video overflow-hidden"
                    style={{ borderRadius: "var(--radius-md)" }}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Empty right column when item is on the left */
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

/**
 * ContentTimeline — vertical timeline for history, process steps, or milestones.
 *
 * Variants:
 *  - "vertical"     — all items on one side of a left-aligned connector line
 *  - "alternating"  — items alternate left/right of a centered connector line
 *                     (collapses to vertical layout on mobile)
 */
export function ContentTimeline({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  items,
  variant = "vertical",
  showConnector = true,
}: ContentTimelineProps): React.ReactElement {
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
      aria-label={headline ?? "Timeline"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Section header */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-8 text-center md:mb-16"
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
                  maxWidth: "640px",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Timeline items */}
        <div className="relative">
          {/* Alternating center connector line (desktop only) */}
          {variant === "alternating" && showConnector && (
            <div
              className="absolute hidden md:block"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: "0",
                bottom: "0",
                width: "2px",
                backgroundColor: "var(--color-border)",
                opacity: 0.4,
              }}
            />
          )}

          {items.map((item, i) =>
            variant === "alternating" ? (
              <AlternatingItem
                key={i}
                item={item}
                index={i}
                animate={animate}
                isInView={isInView}
                showConnector={showConnector}
                isLast={i === items.length - 1}
              />
            ) : (
              <VerticalItem
                key={i}
                item={item}
                index={i}
                animate={animate}
                isInView={isInView}
                showConnector={showConnector}
                isLast={i === items.length - 1}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

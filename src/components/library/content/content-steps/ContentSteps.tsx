"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { SPACING_MAP } from "@/components/library/spacing";
import type { ContentStepsProps, StepItem } from "./content-steps.types";

function getIcon(name: string): React.ReactNode {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon size={24} />;
}

/* ------------------------------------------------------------------ */
/*  Numbered variant — vertical numbered steps with connecting line    */
/* ------------------------------------------------------------------ */

function NumberedStep({
  step,
  index,
  animate,
  isInView,
  isLast,
}: {
  step: StepItem;
  index: number;
  animate: boolean;
  isInView: boolean;
  isLast: boolean;
}): React.ReactElement {
  return (
    <div
      className="relative flex gap-4 md:gap-6"
      style={{
        paddingBottom: isLast ? "0" : "var(--space-component)",
      }}
    >
      {/* Left rail: number circle + connector line */}
      <div className="relative flex flex-col items-center" style={{ width: "48px", flexShrink: 0 }}>
        {/* Number circle */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-bold)",
            boxShadow: "0 0 0 4px var(--color-background), 0 0 0 6px var(--color-primary-light)",
            flexShrink: 0,
          }}
          initial={animate ? { scale: 0, opacity: 0 } : false}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {index + 1}
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <div
            className="absolute w-0.5"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              top: "56px",
              bottom: "0",
              backgroundColor: "var(--color-border)",
              opacity: 0.4,
            }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="min-w-0 flex-1 pt-2 pb-2"
        initial={animate ? { opacity: 0, x: 24 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
        transition={{
          duration: 0.5,
          delay: index * 0.12 + 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "var(--color-text)",
          }}
        >
          {step.title}
        </h3>
        <p
          className="mt-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
            maxWidth: "540px",
          }}
        >
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Icon Cards variant — grid of cards with Lucide icons               */
/* ------------------------------------------------------------------ */

function IconCard({
  step,
  index,
  animate,
  isInView,
}: {
  step: StepItem;
  index: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  const iconElement = step.icon ? getIcon(step.icon) : null;

  return (
    <motion.div
      className="group relative flex flex-col p-5 transition-all md:p-8"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
        transitionProperty: "transform, box-shadow, border-color",
        transitionDuration: "var(--transition-base)",
        transitionTimingFunction: "var(--ease-default)",
      }}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--color-border-light)";
      }}
    >
      {/* Step number badge */}
      <span
        className="absolute"
        style={{
          top: "12px",
          right: "16px",
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--weight-bold)",
          color: "var(--color-primary)",
          opacity: 0.5,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon */}
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center"
        style={{
          color: "var(--color-primary)",
          backgroundColor: "var(--color-surface-elevated)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        {iconElement ?? (
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-lg)",
              fontWeight: "var(--weight-bold)",
              color: "var(--color-primary)",
            }}
          >
            {index + 1}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-xl)",
          fontWeight: "var(--weight-semibold)",
          lineHeight: "var(--leading-tight)",
          color: "var(--color-text)",
        }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p
        className="mt-3"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          lineHeight: "var(--leading-relaxed)",
          color: "var(--color-text-secondary)",
        }}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Horizontal variant — inline flow with arrow connectors             */
/* ------------------------------------------------------------------ */

function HorizontalStep({
  step,
  index,
  total,
  animate,
  isInView,
}: {
  step: StepItem;
  index: number;
  total: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  const isLast = index === total - 1;

  return (
    <>
      <motion.div
        className="flex flex-1 flex-col items-center text-center"
        style={{ minWidth: "0" }}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: 0.5,
          delay: index * 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Number circle */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-bold)",
            boxShadow: "var(--shadow-md)",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>

        {/* Title */}
        <h3
          className="mt-4"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "var(--color-text)",
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          className="mt-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
            maxWidth: "240px",
          }}
        >
          {step.description}
        </p>
      </motion.div>

      {/* Arrow connector between steps (desktop only) */}
      {!isLast && (
        <motion.div
          className="hidden flex-shrink-0 items-center md:flex"
          style={{ width: "48px", marginTop: "-24px" }}
          initial={animate ? { opacity: 0, scaleX: 0 } : false}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.12 + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <svg
            width="48"
            height="24"
            viewBox="0 0 48 24"
            fill="none"
            style={{ color: "var(--color-primary)", opacity: 0.5 }}
          >
            <line
              x1="0"
              y1="12"
              x2="36"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <polyline
              points="32,6 42,12 32,18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      )}
    </>
  );
}

/* Vertical mobile step for horizontal variant (stacks on mobile) */
function HorizontalMobileStep({
  step,
  index,
  animate,
  isInView,
  isLast,
}: {
  step: StepItem;
  index: number;
  animate: boolean;
  isInView: boolean;
  isLast: boolean;
}): React.ReactElement {
  return (
    <div
      className="relative flex gap-4"
      style={{
        paddingBottom: isLast ? "0" : "var(--space-element)",
      }}
    >
      {/* Left rail: number + connector */}
      <div className="relative flex flex-col items-center" style={{ width: "40px", flexShrink: 0 }}>
        <div
          className="relative z-10 flex items-center justify-center"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--weight-bold)",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        {!isLast && (
          <div
            className="absolute w-0.5"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              top: "48px",
              bottom: "0",
              backgroundColor: "var(--color-border)",
              opacity: 0.4,
            }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="min-w-0 flex-1 pt-1.5"
        initial={animate ? { opacity: 0, x: 16 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
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
          {step.title}
        </h3>
        <p
          className="mt-1.5"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
          }}
        >
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Columns map for icon-cards grid                                    */
/* ------------------------------------------------------------------ */

function getGridClass(stepCount: number): string {
  if (stepCount <= 2) return "grid-cols-1 md:grid-cols-2";
  if (stepCount === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/**
 * ContentSteps — display a step-by-step process or how-it-works flow.
 *
 * Variants:
 *  - "numbered"     Vertical numbered steps with connecting line
 *  - "icon-cards"   Cards with Lucide icons in a responsive grid
 *  - "horizontal"   Horizontal flow with arrow connectors (stacks on mobile)
 */
export function ContentSteps({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  steps,
  variant = "numbered",
}: ContentStepsProps): React.ReactElement {
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
      aria-label={headline ?? "Steps"}
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

        {/* Numbered variant */}
        {variant === "numbered" && (
          <div className="mx-auto" style={{ maxWidth: "640px" }}>
            {steps.map((step, i) => (
              <NumberedStep
                key={i}
                step={step}
                index={i}
                animate={animate}
                isInView={isInView}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>
        )}

        {/* Icon Cards variant */}
        {variant === "icon-cards" && (
          <div className={cn("grid gap-4 md:gap-6", getGridClass(steps.length))}>
            {steps.map((step, i) => (
              <IconCard key={i} step={step} index={i} animate={animate} isInView={isInView} />
            ))}
          </div>
        )}

        {/* Horizontal variant — desktop: inline flow; mobile: vertical stack */}
        {variant === "horizontal" && (
          <>
            {/* Desktop: horizontal flow with arrow connectors */}
            <div className="hidden items-start md:flex">
              {steps.map((step, i) => (
                <HorizontalStep
                  key={i}
                  step={step}
                  index={i}
                  total={steps.length}
                  animate={animate}
                  isInView={isInView}
                />
              ))}
            </div>

            {/* Mobile: vertical stack with numbers and connector line */}
            <div className="md:hidden">
              {steps.map((step, i) => (
                <HorizontalMobileStep
                  key={i}
                  step={step}
                  index={i}
                  animate={animate}
                  isInView={isInView}
                  isLast={i === steps.length - 1}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { SPACING_MAP } from "@/components/library/spacing";
import type { ContentStatsProps } from "./content-stats.types";

const COLUMNS_MAP = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
} as const;

function getIcon(name: string): React.ReactNode {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon size={24} />;
}

/**
 * AnimatedNumber — counts from 0 to target value with ease-out cubic.
 */
function AnimatedNumber({
  value,
  prefix,
  suffix,
  isInView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView: boolean;
}): React.ReactElement {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number): void {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);
      setDisplay(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </>
  );
}

/**
 * ContentStats — display key metrics and numbers with optional animated counting.
 *
 * Variants:
 * - "inline"           — stats in a row with vertical dividers
 * - "cards"            — each stat in its own card
 * - "animated-counter" — cards with counting animation on scroll
 */
export function ContentStats({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  stats,
  variant = "cards",
  columns = 4,
}: ContentStatsProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];

  const renderStatNumber = useCallback(
    (value: number, prefix?: string, suffix?: string): React.ReactNode => {
      if (variant === "animated-counter") {
        return <AnimatedNumber value={value} prefix={prefix} suffix={suffix} isInView={isInView} />;
      }
      return (
        <>
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </>
      );
    },
    [variant, isInView]
  );

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
      aria-label={headline ?? "Statistics"}
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
                  lineHeight: "var(--leading-normal)",
                  color: "var(--color-text-secondary)",
                  maxWidth: "var(--container-narrow)",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Inline variant */}
        {variant === "inline" && (
          <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className={cn(
                  "flex flex-col items-center px-4 py-6 md:px-8 md:py-0",
                  i > 0 && "md:border-l"
                )}
                style={{
                  borderColor: "var(--color-border)",
                }}
                initial={animate ? { opacity: 0, y: 24 } : false}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(var(--text-2xl), 5vw, var(--text-4xl))",
                    fontWeight: "var(--weight-bold)",
                    lineHeight: "var(--leading-tight)",
                    letterSpacing: "var(--tracking-tight)",
                    color: "var(--color-text)",
                  }}
                >
                  {renderStatNumber(stat.value, stat.prefix, stat.suffix)}
                </span>
                <span
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--weight-medium)",
                    lineHeight: "var(--leading-normal)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cards variant */}
        {variant === "cards" && (
          <div className={cn("grid gap-6", COLUMNS_MAP[columns])}>
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="group relative flex flex-col items-center p-5 text-center transition-all md:p-8"
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
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.borderColor = "var(--color-border-light)";
                }}
              >
                {/* Icon */}
                {stat.icon && (
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center"
                    style={{
                      color: "var(--color-primary)",
                      backgroundColor: "var(--color-surface-elevated)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    {getIcon(stat.icon)}
                  </div>
                )}

                {/* Number */}
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(var(--text-2xl), 5vw, var(--text-4xl))",
                    fontWeight: "var(--weight-bold)",
                    lineHeight: "var(--leading-tight)",
                    letterSpacing: "var(--tracking-tight)",
                    color: "var(--color-text)",
                  }}
                >
                  {renderStatNumber(stat.value, stat.prefix, stat.suffix)}
                </span>

                {/* Label */}
                <span
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--weight-medium)",
                    lineHeight: "var(--leading-normal)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Animated counter variant */}
        {variant === "animated-counter" && (
          <div className={cn("grid gap-6", COLUMNS_MAP[columns])}>
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="group relative flex flex-col items-center p-5 text-center transition-all md:p-8"
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
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.borderColor = "var(--color-border-light)";
                }}
              >
                {/* Icon */}
                {stat.icon && (
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center"
                    style={{
                      color: "var(--color-primary)",
                      backgroundColor: "var(--color-surface-elevated)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    {getIcon(stat.icon)}
                  </div>
                )}

                {/* Animated number */}
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(var(--text-2xl), 5vw, var(--text-4xl))",
                    fontWeight: "var(--weight-bold)",
                    lineHeight: "var(--leading-tight)",
                    letterSpacing: "var(--tracking-tight)",
                    color: "var(--color-text)",
                  }}
                >
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    isInView={isInView}
                  />
                </span>

                {/* Label */}
                <span
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--weight-medium)",
                    lineHeight: "var(--leading-normal)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

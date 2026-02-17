"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { ContentFeaturesProps } from "./content-features.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

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
 * ContentFeatures — grid of feature cards with icons.
 *
 * Variant: "icon-cards"
 * Cards with icon, title, description. Hover lift + shadow increase.
 */
export function ContentFeatures({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  features,
  columns = 3,
}: ContentFeaturesProps): React.ReactElement {
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
      aria-label={headline ?? "Features"}
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
                  maxWidth: "var(--container-narrow)",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Feature cards grid */}
        <div className={cn("grid gap-6", COLUMNS_MAP[columns])}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
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
                delay: i * 0.08,
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
              {/* Icon */}
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center"
                style={{
                  color: "var(--color-primary)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                {getIcon(feature.icon)}
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
                {feature.title}
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
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

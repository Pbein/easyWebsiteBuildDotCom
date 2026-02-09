"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { CommerceServicesProps, ServiceItem } from "./commerce-services.types";

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
} as const;

function getIcon(name: string): React.ReactNode {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon size={24} />;
}

/* ------------------------------------------------------------------ */
/*  Card Grid Variant                                                  */
/* ------------------------------------------------------------------ */

function CardGridItem({
  service,
  index,
  animate,
  isInView,
  showPricing,
}: {
  service: ServiceItem;
  index: number;
  animate: boolean;
  isInView: boolean;
  showPricing: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: service.featured
          ? "2px solid var(--color-primary)"
          : "1px solid var(--color-border-light)",
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
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Featured badge */}
      {service.featured && (
        <div
          className="absolute top-4 right-4 z-10 px-3 py-1"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            borderRadius: "var(--radius-full)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          Popular
        </div>
      )}

      {/* Image */}
      {service.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={service.image.src}
            alt={service.image.alt}
            className="h-full w-full object-cover"
            style={{
              transitionProperty: "transform",
              transitionDuration: "var(--transition-base)",
              transitionTimingFunction: "var(--ease-default)",
            }}
          />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Icon (only if no image) */}
        {!service.image && service.icon && (
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center"
            style={{
              color: "var(--color-primary)",
              backgroundColor: "var(--color-surface-elevated)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            {getIcon(service.icon)}
          </div>
        )}

        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "var(--color-text)",
          }}
        >
          {service.name}
        </h3>

        {/* Description */}
        <p
          className="mt-2 flex-1"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
          }}
        >
          {service.description}
        </p>

        {/* Price + duration row */}
        {showPricing && service.price && (
          <div className="mt-4 flex items-end gap-2">
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-2xl)",
                fontWeight: "var(--weight-bold)",
                lineHeight: "var(--leading-tight)",
                color: "var(--color-primary)",
              }}
            >
              {service.price}
            </span>
            {service.duration && (
              <span
                className="mb-0.5 inline-block px-2 py-0.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-secondary)",
                  backgroundColor: "var(--color-surface-elevated)",
                  borderRadius: "var(--radius-full)",
                }}
              >
                {service.duration}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        {service.ctaText && (
          <a
            href={service.ctaLink ?? "#"}
            className="mt-4 inline-flex items-center justify-center px-5 py-2.5 text-center"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-semibold)",
              borderRadius: "var(--radius-lg)",
              transitionProperty: "opacity",
              transitionDuration: "var(--transition-fast)",
              transitionTimingFunction: "var(--ease-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {service.ctaText}
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  List Variant                                                       */
/* ------------------------------------------------------------------ */

function ListItem({
  service,
  index,
  animate,
  isInView,
  showPricing,
}: {
  service: ServiceItem;
  index: number;
  animate: boolean;
  isInView: boolean;
  showPricing: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
      style={{
        borderBottom: "1px solid var(--color-border-light)",
        borderLeft: service.featured ? "3px solid var(--color-primary)" : "3px solid transparent",
        paddingLeft: "var(--space-element)",
      }}
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Left: name + description */}
      <div className="flex-1">
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "var(--color-text)",
          }}
        >
          {service.name}
        </h3>
        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
          }}
        >
          {service.description}
        </p>
      </div>

      {/* Right: price + duration + CTA */}
      <div className="flex items-center gap-4">
        {showPricing && service.price && (
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-xl)",
                fontWeight: "var(--weight-bold)",
                color: "var(--color-primary)",
              }}
            >
              {service.price}
            </span>
            {service.duration && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {service.duration}
              </span>
            )}
          </div>
        )}
        {service.ctaText && (
          <a
            href={service.ctaLink ?? "#"}
            className="inline-flex items-center justify-center px-4 py-2 whitespace-nowrap"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-semibold)",
              borderRadius: "var(--radius-lg)",
              transitionProperty: "opacity",
              transitionDuration: "var(--transition-fast)",
              transitionTimingFunction: "var(--ease-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {service.ctaText}
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tiered Variant                                                     */
/* ------------------------------------------------------------------ */

function TieredItem({
  service,
  index,
  animate,
  isInView,
  showPricing,
}: {
  service: ServiceItem;
  index: number;
  animate: boolean;
  isInView: boolean;
  showPricing: boolean;
}): React.ReactElement {
  const isFeatured = service.featured ?? false;

  return (
    <motion.div
      className="relative flex flex-col"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        borderTop: isFeatured ? "4px solid var(--color-primary)" : undefined,
        boxShadow: isFeatured ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: isFeatured ? "scale(1.05)" : "scale(1)",
        transitionProperty: "transform, box-shadow",
        transitionDuration: "var(--transition-base)",
        transitionTimingFunction: "var(--ease-default)",
        zIndex: isFeatured ? 1 : 0,
      }}
      initial={animate ? { opacity: 0, y: 28 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Most Popular badge */}
      {isFeatured && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 whitespace-nowrap"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-on-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-bold)",
            borderRadius: "var(--radius-full)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          Most Popular
        </div>
      )}

      <div className="flex flex-1 flex-col items-center p-8 text-center">
        {/* Tier name */}
        <h3
          className="uppercase"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            color: "var(--color-text)",
          }}
        >
          {service.name}
        </h3>

        {/* Price */}
        {showPricing && service.price && (
          <div className="mt-6">
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-4xl)",
                fontWeight: "var(--weight-bold)",
                lineHeight: "var(--leading-tight)",
                color: "var(--color-primary)",
              }}
            >
              {service.price}
            </span>
            {service.duration && (
              <span
                className="ml-1"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {service.duration}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p
          className="mt-4 flex-1"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
          }}
        >
          {service.description}
        </p>

        {/* CTA */}
        {service.ctaText && (
          <a
            href={service.ctaLink ?? "#"}
            className="mt-6 inline-flex w-full items-center justify-center px-6 py-3"
            style={{
              backgroundColor: isFeatured ? "var(--color-primary)" : "transparent",
              color: isFeatured ? "var(--color-text-on-primary)" : "var(--color-primary)",
              border: isFeatured ? "none" : "2px solid var(--color-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-bold)",
              borderRadius: "var(--radius-lg)",
              transitionProperty: "opacity, background-color, color",
              transitionDuration: "var(--transition-fast)",
              transitionTimingFunction: "var(--ease-default)",
            }}
            onMouseEnter={(e) => {
              if (!isFeatured) {
                e.currentTarget.style.backgroundColor = "var(--color-primary)";
                e.currentTarget.style.color = "var(--color-text-on-primary)";
              } else {
                e.currentTarget.style.opacity = "0.9";
              }
            }}
            onMouseLeave={(e) => {
              if (!isFeatured) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-primary)";
              } else {
                e.currentTarget.style.opacity = "1";
              }
            }}
          >
            {service.ctaText}
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

/**
 * CommerceServices — display services or products with pricing.
 *
 * Variants:
 *  - "card-grid"  Service cards in a responsive grid
 *  - "list"       Compact vertical list with price on right
 *  - "tiered"     Package/tier cards for pricing comparison
 */
export function CommerceServices({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  services,
  variant = "card-grid",
  columns = 3,
  showPricing = true,
}: CommerceServicesProps): React.ReactElement {
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
      aria-label={headline ?? "Services"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Section header */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-16 text-center"
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

        {/* Card Grid */}
        {variant === "card-grid" && (
          <div className={cn("grid gap-6", COLUMNS_MAP[columns])}>
            {services.map((service, i) => (
              <CardGridItem
                key={i}
                service={service}
                index={i}
                animate={animate}
                isInView={isInView}
                showPricing={showPricing}
              />
            ))}
          </div>
        )}

        {/* List */}
        {variant === "list" && (
          <div className="flex flex-col">
            {services.map((service, i) => (
              <ListItem
                key={i}
                service={service}
                index={i}
                animate={animate}
                isInView={isInView}
                showPricing={showPricing}
              />
            ))}
          </div>
        )}

        {/* Tiered */}
        {variant === "tiered" && (
          <div className={cn("grid items-center gap-6", COLUMNS_MAP[columns])}>
            {services.map((service, i) => (
              <TieredItem
                key={i}
                service={service}
                index={i}
                animate={animate}
                isInView={isInView}
                showPricing={showPricing}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

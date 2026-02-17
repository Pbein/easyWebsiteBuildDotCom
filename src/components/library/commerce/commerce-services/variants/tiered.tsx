"use client";

import { motion } from "framer-motion";
import type { ServiceItem } from "../commerce-services.types";

export function TieredItem({
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
        transform: "scale(1)",
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

      <div className="flex flex-1 flex-col items-center p-5 text-center md:p-8">
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
                fontSize: "clamp(var(--text-2xl), 5vw, var(--text-4xl))",
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
            href={service.ctaLink || undefined}
            role={service.ctaLink ? undefined : "button"}
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

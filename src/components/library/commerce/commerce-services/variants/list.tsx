"use client";

import { motion } from "framer-motion";
import type { ServiceItem } from "../commerce-services.types";

export function ListItem({
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
            href={service.ctaLink || undefined}
            role={service.ctaLink ? undefined : "button"}
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

"use client";

import { motion } from "framer-motion";
import type { ServiceItem } from "../commerce-services.types";
import { getIcon } from "../shared";

export function CardGridItem({
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

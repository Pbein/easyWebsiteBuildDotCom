"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { CommerceServicesProps } from "./commerce-services.types";
import { SPACING_MAP } from "@/components/library/spacing";
import { COLUMNS_MAP, SectionHeader } from "./shared";
import { CardGridItem } from "./variants/card-grid";
import { ListItem } from "./variants/list";
import { TieredItem } from "./variants/tiered";

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
        <SectionHeader
          headline={headline}
          subheadline={subheadline}
          animate={animate}
          isInView={isInView}
        />

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

"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { TeamGridProps } from "./team-grid.types";
import { SPACING_MAP } from "@/components/library/spacing";
import { COLUMNS_MAP, SectionHeader } from "./shared";
import { CardsMember } from "./variants/cards";
import { MinimalMember } from "./variants/minimal";
import { HoverRevealMember } from "./variants/hover-reveal";

/**
 * TeamGrid — display team members in a responsive grid.
 *
 * Variants:
 *  - "cards": Full card with image, name, role, bio, socials. Hover lift + shadow.
 *  - "minimal": Circular image with name and role only. Clean, compact.
 *  - "hover-reveal": Image with name overlay; bio + socials revealed on hover / tap.
 */
export function TeamGrid({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  members,
  variant = "cards",
  columns = 3,
}: TeamGridProps): React.ReactElement {
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
      aria-label={headline ?? "Our Team"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        <SectionHeader
          headline={headline}
          subheadline={subheadline}
          animate={animate}
          isInView={isInView}
        />

        {/* Members grid */}
        <div className={cn("grid gap-5 md:gap-8", COLUMNS_MAP[columns])}>
          {members.map((member, i) => {
            switch (variant) {
              case "minimal":
                return (
                  <MinimalMember
                    key={member.name}
                    member={member}
                    index={i}
                    animate={animate}
                    isInView={isInView}
                  />
                );
              case "hover-reveal":
                return (
                  <HoverRevealMember
                    key={member.name}
                    member={member}
                    index={i}
                    animate={animate}
                    isInView={isInView}
                  />
                );
              case "cards":
              default:
                return (
                  <CardsMember
                    key={member.name}
                    member={member}
                    index={i}
                    animate={animate}
                    isInView={isInView}
                  />
                );
            }
          })}
        </div>
      </div>
    </section>
  );
}

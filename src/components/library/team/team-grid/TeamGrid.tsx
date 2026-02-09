"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { TeamGridProps, TeamMember } from "./team-grid.types";

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

/**
 * Extract first+last initials from a full name for avatar fallback.
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Render a social-platform SVG icon.
 * Falls back to the platform name as text for unknown platforms.
 */
function SocialIcon({ platform, url }: { platform: string; url: string }): React.ReactElement {
  const key = platform.toLowerCase();

  const svgProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const iconMap: Record<string, React.ReactNode> = {
    twitter: (
      <svg {...svgProps}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
    linkedin: (
      <svg {...svgProps}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    github: (
      <svg {...svgProps}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
    instagram: (
      <svg {...svgProps}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    facebook: (
      <svg {...svgProps}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    youtube: (
      <svg {...svgProps}>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center"
      style={{
        width: "var(--text-2xl)",
        height: "var(--text-2xl)",
        color: "var(--color-text-secondary)",
        transitionProperty: "color",
        transitionDuration: "var(--transition-fast)",
        transitionTimingFunction: "var(--ease-default)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-text-secondary)";
      }}
      aria-label={`${platform} profile`}
    >
      {iconMap[key] ?? (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
            textTransform: "capitalize",
          }}
        >
          {platform}
        </span>
      )}
    </a>
  );
}

/**
 * Avatar fallback — colored circle with initials.
 */
function AvatarFallback({
  name,
  size = "full",
}: {
  name: string;
  size?: "full" | "circle";
}): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        size === "circle" ? "h-24 w-24" : "aspect-square w-full"
      )}
      style={{
        backgroundColor: "var(--color-primary)",
        borderRadius: size === "circle" ? "var(--radius-full)" : undefined,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: size === "circle" ? "var(--text-2xl)" : "var(--text-4xl)",
          fontWeight: "var(--weight-bold)",
          color: "var(--color-text-on-primary)",
          lineHeight: 1,
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Variant: Cards                                                            */
/* -------------------------------------------------------------------------- */

function CardsMember({
  member,
  index,
  animate,
  isInView,
}: {
  member: TeamMember;
  index: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden"
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
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden">
        {member.image ? (
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            className="object-cover"
            style={{ borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <AvatarFallback name={member.name} size="full" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "var(--color-text)",
          }}
        >
          {member.name}
        </h3>

        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-normal)",
            color: "var(--color-text-secondary)",
          }}
        >
          {member.role}
        </p>

        {member.bio && (
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
            }}
          >
            {member.bio}
          </p>
        )}

        {/* Social links */}
        {member.socials && member.socials.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {member.socials.map((s) => (
              <SocialIcon key={s.platform} platform={s.platform} url={s.url} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Variant: Minimal                                                          */
/* -------------------------------------------------------------------------- */

function MinimalMember({
  member,
  index,
  animate,
  isInView,
}: {
  member: TeamMember;
  index: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Circular image */}
      <div
        className="relative h-24 w-24 overflow-hidden"
        style={{ borderRadius: "var(--radius-full)" }}
      >
        {member.image ? (
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <AvatarFallback name={member.name} size="circle" />
        )}
      </div>

      {/* Name */}
      <h3
        className="mt-4"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-base)",
          fontWeight: "var(--weight-semibold)",
          lineHeight: "var(--leading-tight)",
          color: "var(--color-text)",
        }}
      >
        {member.name}
      </h3>

      {/* Role */}
      <p
        className="mt-1"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-normal)",
          color: "var(--color-text-secondary)",
        }}
      >
        {member.role}
      </p>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Variant: Hover Reveal                                                     */
/* -------------------------------------------------------------------------- */

function HoverRevealMember({
  member,
  index,
  animate,
  isInView,
}: {
  member: TeamMember;
  index: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden"
      style={{
        borderRadius: "var(--radius-xl)",
        aspectRatio: "3 / 4",
      }}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => setRevealed((prev) => !prev)}
    >
      {/* Image */}
      <div className="absolute inset-0">
        {member.image ? (
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <AvatarFallback name={member.name} size="full" />
        )}
      </div>

      {/* Default bottom gradient + name overlay */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          transitionProperty: "opacity",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "#ffffff",
          }}
        >
          {member.name}
        </h3>
        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-normal)",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {member.role}
        </p>
      </div>

      {/* Hover/tap reveal overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-6",
          "opacity-0 group-hover:opacity-100",
          revealed && "!opacity-100"
        )}
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          transitionProperty: "opacity",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-tight)",
            color: "#ffffff",
          }}
        >
          {member.name}
        </h3>

        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-normal)",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {member.role}
        </p>

        {member.bio && (
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {member.bio}
          </p>
        )}

        {/* Social links */}
        {member.socials && member.socials.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {member.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
                style={{
                  width: "var(--text-2xl)",
                  height: "var(--text-2xl)",
                  color: "rgba(255,255,255,0.7)",
                  transitionProperty: "color",
                  transitionDuration: "var(--transition-fast)",
                  transitionTimingFunction: "var(--ease-default)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`${s.platform} profile`}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--weight-medium)",
                    textTransform: "capitalize",
                  }}
                >
                  {s.platform}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TeamGrid — Main Component                                                 */
/* -------------------------------------------------------------------------- */

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

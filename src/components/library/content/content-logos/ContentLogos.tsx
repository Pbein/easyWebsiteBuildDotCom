"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { SPACING_MAP } from "@/components/library/spacing";
import type { ContentLogosProps, LogoItem } from "./content-logos.types";

/* ── Keyframes injected once via <style> ─────────────────────── */
const SCROLL_KEYFRAMES = `
@keyframes content-logos-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

/**
 * Renders a single logo — either the provided image or a text placeholder badge.
 */
function LogoDisplay({ logo }: { logo: LogoItem }): React.ReactElement {
  if (logo.image) {
    return (
      <img
        src={logo.image.src}
        alt={logo.image.alt || logo.name}
        width={logo.image.width}
        height={logo.image.height}
        loading="lazy"
        style={{
          maxHeight: "3rem",
          width: "auto",
          objectFit: "contain",
        }}
      />
    );
  }

  /* Text placeholder badge — looks like a rectangular logo */
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.625rem 1.25rem",
        backgroundColor: "var(--color-surface-elevated)",
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-accent, var(--font-mono))",
        fontSize: "var(--text-base)",
        fontWeight: "var(--weight-bold)",
        color: "var(--color-text)",
        whiteSpace: "nowrap",
        userSelect: "none",
        letterSpacing: "var(--tracking-tight)",
        lineHeight: "var(--leading-normal)",
      }}
    >
      {logo.name}
    </span>
  );
}

/**
 * Optionally wraps content in an anchor if the logo has a url.
 */
function MaybeLink({
  url,
  name,
  children,
}: {
  url?: string;
  name: string;
  children: React.ReactNode;
}): React.ReactElement {
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {children}
      </a>
    );
  }
  return <>{children}</>;
}

/* ── Grid Variant ────────────────────────────────────────────── */
function GridVariant({
  logos,
  animate,
  isInView,
}: {
  logos: LogoItem[];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <div
      className="grid grid-cols-2 items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      style={{ gap: "var(--space-element)" }}
    >
      {logos.map((logo, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-center p-4"
          style={{
            filter: "grayscale(1) opacity(0.6)",
            transitionProperty: "filter",
            transitionDuration: "var(--transition-base)",
            transitionTimingFunction: "var(--ease-default)",
          }}
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "grayscale(0) opacity(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "grayscale(1) opacity(0.6)";
          }}
        >
          <MaybeLink url={logo.url} name={logo.name}>
            <LogoDisplay logo={logo} />
          </MaybeLink>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Scroll (Marquee) Variant ────────────────────────────────── */
function ScrollVariant({
  logos,
  animate,
  isInView,
}: {
  logos: LogoItem[];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  const [paused, setPaused] = useState(false);
  const duration = logos.length * 3;

  /* Duplicate logos for seamless loop */
  const doubled = [...logos, ...logos];

  return (
    <motion.div
      className="overflow-hidden"
      initial={animate ? { opacity: 0 } : false}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Inject keyframes */}
      <style dangerouslySetInnerHTML={{ __html: SCROLL_KEYFRAMES }} />

      <div
        className="flex w-max"
        style={{
          animation: `content-logos-scroll ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center justify-center px-6"
            style={{
              minWidth: "10rem",
              filter: "grayscale(1) opacity(0.6)",
              transitionProperty: "filter",
              transitionDuration: "var(--transition-base)",
              transitionTimingFunction: "var(--ease-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "grayscale(0) opacity(1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "grayscale(1) opacity(0.6)";
            }}
          >
            <MaybeLink url={logo.url} name={logo.name}>
              <LogoDisplay logo={logo} />
            </MaybeLink>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Fade Variant ────────────────────────────────────────────── */
function FadeVariant({
  logos,
  animate,
  isInView,
}: {
  logos: LogoItem[];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <div
      className="grid grid-cols-2 items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      style={{ gap: "var(--space-element)" }}
    >
      {logos.map((logo, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-center p-4"
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <MaybeLink url={logo.url} name={logo.name}>
            <LogoDisplay logo={logo} />
          </MaybeLink>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */

/**
 * ContentLogos — trust badges / client logo cloud.
 *
 * Variants:
 *  - "grid"   — responsive grid with grayscale→color hover
 *  - "scroll" — infinite horizontal marquee with pause-on-hover
 *  - "fade"   — staggered fade-in on scroll (full color)
 */
export function ContentLogos({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  logos,
  variant = "grid",
}: ContentLogosProps): React.ReactElement {
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
      aria-label={headline ?? "Trusted partners"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Section header */}
        {headline && (
          <motion.div
            className="mb-6 text-center md:mb-12"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>
        )}

        {/* Variant renderer */}
        {variant === "grid" && <GridVariant logos={logos} animate={animate} isInView={isInView} />}
        {variant === "scroll" && (
          <ScrollVariant logos={logos} animate={animate} isInView={isInView} />
        )}
        {variant === "fade" && <FadeVariant logos={logos} animate={animate} isInView={isInView} />}
      </div>
    </section>
  );
}

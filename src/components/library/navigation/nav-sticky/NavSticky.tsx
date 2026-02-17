"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { NavStickyProps } from "./nav-sticky.types";

/**
 * Sticky Navigation — library component.
 *
 * Variants:
 *  - "transparent": starts transparent, gains background on scroll
 *  - "solid": always has a solid background
 *
 * All visual values come from CSS Custom Properties (theme tokens).
 */
export function NavSticky({
  id,
  className,
  theme,
  animate = true,
  logo,
  logoText,
  links,
  cta,
  variant = "transparent",
  sticky = true,
}: NavStickyProps): React.ReactElement {
  const scrolledPastThreshold = useSyncExternalStore(
    (callback) => {
      window.addEventListener("scroll", callback, { passive: true });
      return () => window.removeEventListener("scroll", callback);
    },
    () => window.scrollY > 40,
    () => false
  );
  const scrolled = variant === "solid" || scrolledPastThreshold;
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Inline theme overrides
  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const showSolid = variant === "solid" || scrolled;

  return (
    <nav
      id={id}
      className={cn(
        "z-50 w-full transition-all",
        sticky ? "fixed top-0 left-0" : "relative",
        className
      )}
      style={{
        ...themeStyle,
        transitionDuration: "var(--transition-base)",
        transitionTimingFunction: "var(--ease-default)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 transition-all"
        style={{
          backgroundColor: showSolid ? "var(--color-surface)" : "transparent",
          borderBottom: showSolid ? "1px solid var(--color-border-light)" : "1px solid transparent",
          boxShadow: showSolid ? "var(--shadow-md)" : "none",
          transitionDuration: "var(--transition-base)",
          transitionTimingFunction: "var(--ease-default)",
          backdropFilter: showSolid ? "blur(12px)" : "none",
        }}
      />

      {/* Content */}
      <div
        className="relative mx-auto flex items-center justify-between px-6 py-4"
        style={{ maxWidth: "var(--container-max)" }}
      >
        {/* Logo */}
        <motion.a
          href="/"
          className="relative z-10 flex items-center gap-2"
          initial={animate ? { opacity: 0, x: -12 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {logo ? (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 36}
              height={logo.height ?? 36}
              className="h-9 w-auto"
            />
          ) : null}
          {logoText ? (
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-xl)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--color-text)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {logoText}
            </span>
          ) : null}
        </motion.a>

        {/* Desktop links */}
        <motion.ul
          className="hidden items-center gap-1 md:flex"
          initial={animate ? { opacity: 0, y: -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-md px-4 py-2 transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-text-secondary)",
                  borderRadius: "var(--radius-md)",
                  transitionDuration: "var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-text)";
                  e.currentTarget.style.backgroundColor = "var(--color-border-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </motion.ul>

        {/* Desktop CTA + Mobile toggle */}
        <div className="relative z-10 flex items-center gap-3">
          {cta ? (
            <motion.a
              href={cta.href}
              className="hidden items-center px-5 py-2.5 transition-all md:inline-flex"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-semibold)",
                borderRadius: "var(--radius-lg)",
                transitionDuration: "var(--transition-fast)",
                ...(cta.variant === "outline"
                  ? {
                      color: "var(--color-primary)",
                      border: "var(--border-width) solid var(--color-primary)",
                      backgroundColor: "transparent",
                    }
                  : cta.variant === "ghost"
                    ? {
                        color: "var(--color-primary)",
                        backgroundColor: "transparent",
                      }
                    : cta.variant === "secondary"
                      ? {
                          color: "var(--color-text)",
                          backgroundColor: "var(--color-surface-elevated)",
                          border: "1px solid var(--color-border)",
                        }
                      : {
                          color: "var(--color-text-on-primary)",
                          backgroundColor: "var(--color-primary)",
                        }),
              }}
              initial={animate ? { opacity: 0, x: 12 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={(e) => {
                if (cta.variant !== "outline" && cta.variant !== "ghost") {
                  e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
                }
              }}
              onMouseLeave={(e) => {
                if (cta.variant !== "outline" && cta.variant !== "ghost") {
                  e.currentTarget.style.backgroundColor = "var(--color-primary)";
                }
              }}
              {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {cta.text}
            </motion.a>
          ) : null}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="relative z-10 flex items-center justify-center p-2 md:hidden"
            style={{ color: "var(--color-text)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute top-full left-0 w-full md:hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-md)",
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col px-6 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block py-3 transition-colors"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--weight-medium)",
                      color: "var(--color-text)",
                      borderBottom: "1px solid var(--color-border-light)",
                    }}
                    onClick={closeMobile}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {cta ? (
                <li className="pt-4">
                  <a
                    href={cta.href}
                    className="block w-full py-3 text-center transition-colors"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--weight-semibold)",
                      borderRadius: "var(--radius-lg)",
                      color: "var(--color-text-on-primary)",
                      backgroundColor: "var(--color-primary)",
                    }}
                    onClick={closeMobile}
                    {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {cta.text}
                  </a>
                </li>
              ) : null}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

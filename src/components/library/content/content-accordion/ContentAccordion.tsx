"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { ContentAccordionProps, AccordionItem } from "./content-accordion.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

/* ------------------------------------------------------------------ */
/*  AccordionItemRow — individual expandable row                       */
/* ------------------------------------------------------------------ */

interface AccordionItemRowProps {
  item: AccordionItem;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
  variant: "single-open" | "multi-open" | "bordered";
  animate: boolean;
  isInView: boolean;
}

function AccordionItemRow({
  item,
  index,
  isOpen,
  onToggle,
  variant,
  animate,
  isInView,
}: AccordionItemRowProps): React.ReactElement {
  const isBordered = variant === "bordered";

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={
        isBordered
          ? {
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: isOpen ? "var(--color-surface)" : "transparent",
              transitionProperty: "background-color, border-color",
              transitionDuration: "var(--transition-base)",
              transitionTimingFunction: "var(--ease-default)",
              overflow: "hidden",
            }
          : {
              borderBottom: "1px solid var(--color-border-light)",
            }
      }
    >
      {/* Header button */}
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between text-left",
          isBordered ? "px-6 py-5" : "py-5"
        )}
        style={{
          cursor: "pointer",
          background: "none",
          border: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = "2px solid var(--color-primary)";
          e.currentTarget.style.outlineOffset = "-2px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            lineHeight: "var(--leading-normal)",
            color: "var(--color-text)",
            paddingRight: "var(--space-element)",
          }}
        >
          {item.question}
        </span>

        <span
          className="flex-shrink-0"
          style={{
            color: "var(--color-primary)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "transform",
            transitionDuration: "var(--transition-fast)",
            transitionTimingFunction: "var(--ease-default)",
          }}
        >
          <ChevronDown size={20} />
        </span>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className={cn(isBordered ? "px-6 pt-1 pb-5" : "pt-1 pb-5")}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-text-secondary)",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ContentAccordion — main export                                     */
/* ------------------------------------------------------------------ */

/**
 * ContentAccordion — expandable FAQ / content sections.
 *
 * Variants:
 *   "single-open"  — only one item open at a time (default)
 *   "multi-open"   — multiple items can be open simultaneously
 *   "bordered"     — card-like bordered items with surface background on open
 */
export function ContentAccordion({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  items,
  variant = "single-open",
  defaultOpen = -1,
}: ContentAccordionProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];

  /* ---- State: single-open vs multi-open / bordered ---- */

  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpen >= 0 && defaultOpen < items.length ? defaultOpen : null
  );

  const [openIndices, setOpenIndices] = useState<Set<number>>(
    () => new Set(defaultOpen >= 0 && defaultOpen < items.length ? [defaultOpen] : [])
  );

  const isSingleOpen = variant === "single-open";

  const handleToggle = useCallback(
    (index: number): void => {
      if (isSingleOpen) {
        setOpenIndex((prev) => (prev === index ? null : index));
      } else {
        setOpenIndices((prev) => {
          const next = new Set(prev);
          if (next.has(index)) {
            next.delete(index);
          } else {
            next.add(index);
          }
          return next;
        });
      }
    },
    [isSingleOpen]
  );

  const isItemOpen = useCallback(
    (index: number): boolean => {
      return isSingleOpen ? openIndex === index : openIndices.has(index);
    },
    [isSingleOpen, openIndex, openIndices]
  );

  /* ---- Render ---- */

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
      aria-label={headline ?? "Frequently Asked Questions"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-narrow)" }}>
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

        {/* Accordion items */}
        <div
          className={cn("flex flex-col")}
          style={{
            gap: variant === "bordered" ? "var(--space-tight)" : "0",
          }}
        >
          {items.map((item, i) => (
            <AccordionItemRow
              key={i}
              item={item}
              index={i}
              isOpen={isItemOpen(i)}
              onToggle={handleToggle}
              variant={variant}
              animate={animate}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

export const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

export const COLUMNS_MAP = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const;

export function SectionHeader({
  headline,
  subheadline,
  animate,
  isInView,
}: {
  headline?: string;
  subheadline?: string;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement | null {
  if (!headline && !subheadline) return null;

  return (
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
  );
}

export function FilterTabs({
  categories,
  activeFilter,
  onFilterChange,
}: {
  categories: string[];
  activeFilter: string;
  onFilterChange: (cat: string) => void;
}): React.ReactElement | null {
  if (categories.length <= 1) return null;

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className="px-4 py-2 text-sm font-medium transition-all"
          style={{
            fontFamily: "var(--font-body)",
            color: activeFilter === cat ? "var(--color-primary)" : "var(--color-text-secondary)",
            borderBottom:
              activeFilter === cat ? "2px solid var(--color-primary)" : "2px solid transparent",
            background: "none",
            cursor: "pointer",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

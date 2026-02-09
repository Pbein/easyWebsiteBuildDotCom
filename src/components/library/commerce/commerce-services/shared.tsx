"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

export const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

export const COLUMNS_MAP = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
} as const;

export function getIcon(name: string): React.ReactNode {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>;
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon size={24} />;
}

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
            maxWidth: "42rem",
          }}
        >
          {subheadline}
        </p>
      )}
    </motion.div>
  );
}

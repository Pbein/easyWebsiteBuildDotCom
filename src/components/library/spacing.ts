import type { BaseComponentProps } from "./base.types";

type SpacingKey = NonNullable<BaseComponentProps["spacing"]>;

/**
 * Shared spacing map — standard component spacing using --space-component for md.
 * Used by most library components (content, commerce, social-proof, etc.).
 */
export const SPACING_MAP: Record<SpacingKey, string> = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

/**
 * Tighter spacing variant using --space-element for md.
 * Used by hero, footer, form, and text-heavy components.
 */
export const SPACING_MAP_ELEMENT: Record<SpacingKey, string> = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-element)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

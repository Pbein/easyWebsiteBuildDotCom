import type { ThemeTokens } from "@/lib/theme/theme.types";

/**
 * Base props that every library component extends.
 * These provide consistent theming, spacing, and animation control.
 */
export interface BaseComponentProps {
  /** Optional HTML id attribute */
  id?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline theme token overrides — merged on top of the page-level theme */
  theme?: Partial<ThemeTokens>;
  /** Enable/disable entry animations (default: true) */
  animate?: boolean;
  /** Section spacing preset */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

/**
 * Standard image source used across all library components.
 */
export interface ImageSource {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

/**
 * Standard link used across all library components.
 */
export interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Standard CTA (Call to Action) button.
 */
export interface CTAButton {
  text: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  external?: boolean;
}

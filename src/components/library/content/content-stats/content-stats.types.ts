import type { BaseComponentProps } from "../../base.types";

export interface StatItem {
  /** Numeric value to display (used for counting animation). */
  value: number;
  /** Suffix appended after the number (e.g. "+", "%", "M"). */
  suffix?: string;
  /** Prefix prepended before the number (e.g. "$", "#"). */
  prefix?: string;
  /** Label displayed below the number. */
  label: string;
  /** Lucide icon name (e.g. "Users", "TrendingUp", "Award"). */
  icon?: string;
}

export interface ContentStatsProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Section subheadline. */
  subheadline?: string;
  /** Array of stat items with value, label, optional prefix/suffix/icon. */
  stats: StatItem[];
  /** Visual variant. */
  variant?: "inline" | "cards" | "animated-counter";
  /** Number of grid columns on desktop. */
  columns?: 2 | 3 | 4;
}

import type { BaseComponentProps } from "../../base.types";

/**
 * A single column header in the comparison table/matrix.
 */
export interface ComparisonColumn {
  /** Column display name */
  name: string;
  /** Whether this column should be visually highlighted (e.g., recommended plan) */
  highlighted?: boolean;
}

/**
 * A single row (feature) in the comparison.
 * Values correspond to columns by index.
 */
export interface ComparisonRow {
  /** Feature or attribute name */
  feature: string;
  /** Value per column — `true`/`false` for check/x, or a string for text */
  values: (string | boolean)[];
}

/**
 * ContentComparison — side-by-side feature or plan comparison.
 *
 * Variants:
 *  - "table"             — HTML table with sticky first column, highlighted column accent
 *  - "side-by-side"      — Card columns listing their features with check/x marks
 *  - "checkmark-matrix"  — Grid of features vs options with check/x/text values
 */
export interface ContentComparisonProps extends BaseComponentProps {
  /** Section headline */
  headline?: string;
  /** Section subheadline */
  subheadline?: string;
  /** Column definitions */
  columns: ComparisonColumn[];
  /** Rows of features with per-column values */
  rows: ComparisonRow[];
  /** Visual variant */
  variant?: "table" | "side-by-side" | "checkmark-matrix";
}

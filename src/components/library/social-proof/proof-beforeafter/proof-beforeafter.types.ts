import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface ComparisonItem {
  /** The "before" image. */
  beforeImage: ImageSource;
  /** The "after" image. */
  afterImage: ImageSource;
  /** Label for the before side (default: "Before"). */
  beforeLabel?: string;
  /** Label for the after side (default: "After"). */
  afterLabel?: string;
  /** Optional caption below the comparison. */
  caption?: string;
}

export interface ProofBeforeAfterProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Section subheadline. */
  subheadline?: string;
  /** Array of before/after comparison items. */
  comparisons: ComparisonItem[];
  /** Visual variant. */
  variant?: "slider" | "side-by-side";
}

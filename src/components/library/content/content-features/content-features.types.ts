import type { BaseComponentProps } from "../../base.types";

export interface FeatureItem {
  /** Lucide icon name (e.g. "Zap", "Shield", "Globe"). */
  icon: string;
  /** Feature title. */
  title: string;
  /** Feature description. */
  description: string;
}

export interface ContentFeaturesProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Section subheadline. */
  subheadline?: string;
  /** Array of 3-6 feature items. */
  features: FeatureItem[];
  /** Number of grid columns on desktop. */
  columns?: 2 | 3 | 4;
  /** Visual variant. */
  variant?: "icon-cards";
}

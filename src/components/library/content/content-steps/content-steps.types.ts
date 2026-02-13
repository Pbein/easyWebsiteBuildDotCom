import type { BaseComponentProps } from "../../base.types";

export interface StepItem {
  /** Step title. */
  title: string;
  /** Step description. */
  description: string;
  /** Optional Lucide icon name (e.g. "Zap", "Shield", "Globe"). */
  icon?: string;
}

export interface ContentStepsProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Section subheadline. */
  subheadline?: string;
  /** Array of step items. */
  steps: StepItem[];
  /** Visual variant. */
  variant?: "numbered" | "icon-cards" | "horizontal";
}

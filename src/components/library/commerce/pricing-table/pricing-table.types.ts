import type { BaseComponentProps, CTAButton } from "../../base.types";

export interface PricingFeature {
  /** Feature description text. */
  text: string;
  /** Whether the feature is included in this plan. */
  included: boolean;
}

export interface PricingPlan {
  /** Plan name (e.g. "Starter", "Pro", "Enterprise"). */
  name: string;
  /** Short description of what the plan offers. */
  description?: string;
  /** Display price (e.g. "$29", "$99", "Custom"). */
  price: string;
  /** Billing period (e.g. "/mo", "/year", "one-time"). */
  period?: string;
  /** Array of features with included/excluded status. */
  features: PricingFeature[];
  /** Whether this plan should be visually highlighted. */
  featured?: boolean;
  /** CTA button for this plan. */
  cta?: CTAButton;
}

export interface PricingTableProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Section subheadline. */
  subheadline?: string;
  /** Array of pricing plans. */
  plans: PricingPlan[];
  /** Visual variant. */
  variant?: "simple" | "featured" | "comparison";
}

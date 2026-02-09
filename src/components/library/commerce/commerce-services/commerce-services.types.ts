import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface ServiceItem {
  /** Service or product name. */
  name: string;
  /** Short description of the service. */
  description: string;
  /** Display price (e.g. "$99", "$49/mo"). */
  price?: string;
  /** Duration or timeframe (e.g. "60 min", "per month"). */
  duration?: string;
  /** Optional image for the service. */
  image?: ImageSource;
  /** Lucide icon name (e.g. "Scissors", "Palette", "Code"). */
  icon?: string;
  /** Mark as featured / most popular. */
  featured?: boolean;
  /** CTA button text. */
  ctaText?: string;
  /** CTA button link. */
  ctaLink?: string;
}

export interface CommerceServicesProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Section subheadline. */
  subheadline?: string;
  /** Array of service items. */
  services: ServiceItem[];
  /** Visual variant. */
  variant?: "card-grid" | "list" | "tiered";
  /** Number of grid columns (card-grid and tiered variants). */
  columns?: 2 | 3;
  /** Whether to display pricing. */
  showPricing?: boolean;
}

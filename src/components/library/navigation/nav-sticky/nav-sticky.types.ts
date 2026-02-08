import type { BaseComponentProps, LinkItem, ImageSource, CTAButton } from "../../base.types";

export interface NavStickyProps extends BaseComponentProps {
  /** Site/brand logo image. */
  logo?: ImageSource;
  /** Text-only logo fallback if no image provided. */
  logoText?: string;
  /** Main navigation links. */
  links: LinkItem[];
  /** Optional CTA button on the right side. */
  cta?: CTAButton;
  /** Visual variant. */
  variant?: "transparent" | "solid";
  /** Make the nav fixed to the top of the viewport. Default: true. */
  sticky?: boolean;
}

import type { BaseComponentProps, ImageSource, CTAButton } from "../../base.types";

export interface CtaBannerProps extends BaseComponentProps {
  /** Banner headline. */
  headline: string;
  /** Supporting subheadline. */
  subheadline?: string;
  /** Primary CTA button. */
  ctaPrimary: CTAButton;
  /** Secondary CTA button. */
  ctaSecondary?: CTAButton;
  /** Background style. */
  backgroundVariant?: "primary" | "dark" | "gradient" | "image";
  /** Background image (when backgroundVariant is "image"). */
  backgroundImage?: ImageSource;
  /** Visual variant. */
  variant?: "full-width" | "contained";
}

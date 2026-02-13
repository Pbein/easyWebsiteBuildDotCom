import type { BaseComponentProps, ImageSource, CTAButton } from "../../base.types";

export interface HeroSplitFeature {
  icon?: string;
  text: string;
}

export interface HeroSplitProps extends BaseComponentProps {
  /** Primary headline text. */
  headline: string;
  /** Supporting subheadline text. */
  subheadline?: string;
  /** Body paragraph text. */
  body?: string;
  /** Primary call-to-action button. */
  ctaPrimary?: CTAButton;
  /** Secondary call-to-action button. */
  ctaSecondary?: CTAButton;
  /** Hero image (optional — renders themed gradient placeholder when absent). */
  image?: ImageSource;
  /** Which side the image appears on. */
  imagePosition?: "left" | "right";
  /** Aspect ratio hint for the image. */
  imageAspect?: "square" | "portrait" | "landscape";
  /** Small badge text displayed above the headline. */
  badge?: string;
  /** Small feature list below body text. */
  features?: HeroSplitFeature[];
  /** Visual variant. */
  variant?: "image-right" | "image-left";
}

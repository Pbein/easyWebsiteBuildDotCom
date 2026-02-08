import type { BaseComponentProps, ImageSource, CTAButton } from "../../base.types";

export interface HeroCenteredProps extends BaseComponentProps {
  /** Primary headline text. */
  headline: string;
  /** Supporting subheadline text. */
  subheadline?: string;
  /** Primary call-to-action button. */
  ctaPrimary?: CTAButton;
  /** Secondary call-to-action button. */
  ctaSecondary?: CTAButton;
  /** Background image for the with-bg-image variant. */
  backgroundImage?: ImageSource;
  /** Opacity of the dark overlay on background images (0-1). */
  overlayOpacity?: number;
  /** Height of the hero section. */
  height?: "viewport" | "large" | "medium";
  /** Text alignment. */
  textAlign?: "center" | "left";
  /** Small badge text displayed above the headline. */
  badge?: string;
  /** Visual variant. */
  variant?: "with-bg-image" | "gradient-bg";
}

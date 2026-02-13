import type { BaseComponentProps, CTAButton, ImageSource } from "../../base.types";

/**
 * HeroVideo — hero section with video focus.
 *
 * Variants:
 *  - "background-video" — Full-width with video/poster behind centered text + dark overlay
 *  - "embedded"         — Split layout: text left, video embed right (stacks on mobile)
 *  - "split-video"      — Half-width video with text on the other side
 */
export interface HeroVideoProps extends BaseComponentProps {
  /** Primary headline text */
  headline: string;
  /** Supporting subheadline */
  subheadline?: string;
  /** Primary CTA button */
  cta?: CTAButton;
  /** Secondary CTA button */
  secondaryCta?: CTAButton;
  /** Video source URL (HTML5 video or embed URL). Falls back to posterImage when absent. */
  videoUrl?: string;
  /** Poster/fallback image for the video area */
  posterImage?: ImageSource;
  /** Visual variant */
  variant?: "background-video" | "embedded" | "split-video";
  /** Dark overlay opacity for background-video variant (0-1, default 0.55) */
  overlayOpacity?: number;
}

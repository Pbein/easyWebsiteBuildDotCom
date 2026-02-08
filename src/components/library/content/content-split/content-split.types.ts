import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface ContentSplitSection {
  /** Section headline. */
  headline: string;
  /** Body text. */
  body: string;
  /** Section image. */
  image: ImageSource;
  /** Optional CTA link text. */
  ctaText?: string;
  /** Optional CTA link URL. */
  ctaLink?: string;
}

export interface ContentSplitProps extends BaseComponentProps {
  /** Array of 2-4 content sections. */
  sections: ContentSplitSection[];
  /** Image corner style. */
  imageStyle?: "rounded" | "sharp" | "overlap";
  /** Visual variant. */
  variant?: "alternating";
}

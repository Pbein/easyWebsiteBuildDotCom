import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface Testimonial {
  /** Testimonial quote text. */
  quote: string;
  /** Person's name. */
  name: string;
  /** Person's role/title. */
  role?: string;
  /** Person's company. */
  company?: string;
  /** Person's avatar image. */
  avatar?: ImageSource;
  /** Star rating (1-5). */
  rating?: number;
}

export interface ProofTestimonialsProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Array of testimonials (3+). */
  testimonials: Testimonial[];
  /** Show star ratings. */
  showRating?: boolean;
  /** Visual variant. */
  variant?: "carousel";
}

import type { BaseComponentProps } from "../../base.types";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  category?: string;
}

export interface MediaGalleryProps extends BaseComponentProps {
  headline?: string;
  subheadline?: string;
  images: GalleryImage[];
  variant?: "grid" | "masonry" | "lightbox";
  columns?: 2 | 3 | 4;
  showCaptions?: boolean;
  enableFilter?: boolean;
}

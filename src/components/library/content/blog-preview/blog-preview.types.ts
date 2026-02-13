import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  category?: string;
  image?: ImageSource;
  href?: string;
  readTime?: string;
}

export interface BlogPreviewProps extends BaseComponentProps {
  headline?: string;
  subheadline?: string;
  posts: BlogPost[];
  variant?: "card-grid" | "featured-row" | "list";
  showDate?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
}

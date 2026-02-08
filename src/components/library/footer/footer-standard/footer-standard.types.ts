import type { BaseComponentProps, ImageSource, LinkItem } from "../../base.types";

export interface FooterColumn {
  /** Column heading. */
  title: string;
  /** Column links. */
  links: LinkItem[];
}

export interface SocialLink {
  /** Social platform name (e.g. "twitter", "github", "linkedin"). */
  platform: string;
  /** Profile URL. */
  url: string;
}

export interface FooterStandardProps extends BaseComponentProps {
  /** Brand logo image. */
  logo?: ImageSource;
  /** Text-only logo fallback. */
  logoText?: string;
  /** Brand tagline below logo. */
  tagline?: string;
  /** Link columns (2-4). */
  columns: FooterColumn[];
  /** Social media links. */
  socialLinks?: SocialLink[];
  /** Copyright text. */
  copyright?: string;
  /** Bottom row links (privacy, terms, etc.). */
  bottomLinks?: LinkItem[];
  /** Visual variant. */
  variant?: "multi-column";
}

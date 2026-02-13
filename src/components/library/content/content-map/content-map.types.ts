import type { BaseComponentProps, CTAButton } from "../../base.types";

export interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string[];
}

export interface ContentMapProps extends BaseComponentProps {
  headline?: string;
  subheadline?: string;
  contactInfo?: ContactInfo;
  cta?: CTAButton;
  mapEmbedUrl?: string;
  variant?: "full-width" | "split-with-info" | "embedded";
}

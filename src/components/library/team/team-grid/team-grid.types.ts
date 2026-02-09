import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: ImageSource;
  socials?: { platform: string; url: string }[];
}

export interface TeamGridProps extends BaseComponentProps {
  headline?: string;
  subheadline?: string;
  members: TeamMember[];
  variant?: "cards" | "minimal" | "hover-reveal";
  columns?: 2 | 3 | 4;
}

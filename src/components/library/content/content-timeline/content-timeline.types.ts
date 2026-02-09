import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  icon?: string;
  image?: ImageSource;
}

export interface ContentTimelineProps extends BaseComponentProps {
  headline?: string;
  subheadline?: string;
  items: TimelineItem[];
  variant?: "vertical" | "alternating";
  showConnector?: boolean;
}

import type { BaseComponentProps, ImageSource } from "../../base.types";

export interface LogoItem {
  name: string;
  image?: ImageSource;
  url?: string;
}

export interface ContentLogosProps extends BaseComponentProps {
  headline?: string;
  logos: LogoItem[];
  variant?: "grid" | "scroll" | "fade";
}

import type { BaseComponentProps } from "../../base.types";

export interface SectionProps extends BaseComponentProps {
  /** HTML element to render. Default: "section". */
  as?: "section" | "div" | "article" | "aside" | "header" | "footer";
  /** Background style. */
  background?: "default" | "surface" | "elevated" | "primary" | "dark" | "none";
  /** Constrain children to max-width container. Default: true. */
  contained?: boolean;
  /** Use the narrow container width instead. Default: false. */
  narrow?: boolean;
  /** Add a top border. */
  borderTop?: boolean;
  /** Add a bottom border. */
  borderBottom?: boolean;
  /** Accessible label for the section landmark. */
  "aria-label"?: string;
  /** Accessible labelled-by for the section landmark. */
  "aria-labelledby"?: string;
  /** Children. */
  children: React.ReactNode;
}

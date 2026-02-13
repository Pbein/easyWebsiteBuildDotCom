import type { BaseComponentProps } from "../../base.types";
import type { DividerStyle } from "@/lib/visuals/visual-vocabulary";

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
  /** Section divider at the top edge. */
  dividerTop?: DividerStyle;
  /** Section divider at the bottom edge. */
  dividerBottom?: DividerStyle;
  /** CSS background pattern overlay (full CSS `background` value). */
  pattern?: string;
  /** Pattern background-size (for gradient-based patterns). */
  patternSize?: string;
  /** Pattern background-position (for multi-layer patterns). */
  patternPosition?: string;
  /** Pattern overlay opacity (0-1). */
  patternOpacity?: number;
  /** Accessible label for the section landmark. */
  "aria-label"?: string;
  /** Accessible labelled-by for the section landmark. */
  "aria-labelledby"?: string;
  /** Children. */
  children: React.ReactNode;
}

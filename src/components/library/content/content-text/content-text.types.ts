import type { BaseComponentProps } from "../../base.types";

export interface ContentTextProps extends BaseComponentProps {
  /** Section headline. */
  headline?: string;
  /** Body text content. */
  body: string;
  /** Text alignment. */
  textAlign?: "center" | "left";
  /** Max-width constraint. */
  maxWidth?: "narrow" | "medium" | "wide";
  /** Small uppercase text above headline. */
  eyebrow?: string;
  /** Visual variant. */
  variant?: "centered";
}

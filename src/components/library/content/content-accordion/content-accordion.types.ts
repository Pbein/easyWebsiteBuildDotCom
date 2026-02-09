import type { BaseComponentProps } from "../../base.types";

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface ContentAccordionProps extends BaseComponentProps {
  headline?: string;
  subheadline?: string;
  items: AccordionItem[];
  variant?: "single-open" | "multi-open" | "bordered";
  defaultOpen?: number;
}

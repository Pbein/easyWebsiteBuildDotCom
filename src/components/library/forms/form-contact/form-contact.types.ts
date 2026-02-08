import type { BaseComponentProps } from "../../base.types";

export interface FormField {
  /** Field name (used as key). */
  name: string;
  /** Display label. */
  label: string;
  /** Input type. */
  type: "text" | "email" | "tel" | "textarea";
  /** Whether the field is required. */
  required?: boolean;
  /** Placeholder text. */
  placeholder?: string;
}

export interface FormContactProps extends BaseComponentProps {
  /** Form headline. */
  headline?: string;
  /** Form subheadline. */
  subheadline?: string;
  /** Custom form fields. If not provided, uses default Name/Email/Message. */
  fields?: FormField[];
  /** Submit button text. */
  submitText?: string;
  /** Success message shown after submission. */
  successMessage?: string;
  /** Visual variant. */
  variant?: "simple";
}

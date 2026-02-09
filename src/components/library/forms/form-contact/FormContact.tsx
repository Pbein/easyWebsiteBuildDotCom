"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { FormContactProps, FormField } from "./form-contact.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-element)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

const DEFAULT_FIELDS: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Your name" },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "you@example.com",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: false,
    placeholder: "+1 (555) 000-0000",
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    placeholder: "Tell us about your project...",
  },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-base)",
  color: "var(--color-text)",
  backgroundColor: "var(--color-surface)",
  border: "var(--border-width) solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "0.75rem 1rem",
  outline: "none",
  transitionProperty: "border-color, box-shadow",
  transitionDuration: "var(--transition-fast)",
  transitionTimingFunction: "var(--ease-default)",
};

/**
 * FormContact — clean contact form with validation.
 *
 * Variant: "simple"
 * Single-column stacked form. Submission logic is external.
 */
export function FormContact({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline = "Get in Touch",
  subheadline,
  fields,
  submitText = "Send Message",
  successMessage = "Thank you! We'll get back to you soon.",
}: FormContactProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];
  const formFields = fields ?? DEFAULT_FIELDS;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    for (const field of formFields) {
      if (field.required) {
        const value = formData.get(field.name);
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
      if (field.type === "email") {
        const value = formData.get(field.name);
        if (
          value &&
          typeof value === "string" &&
          value.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          newErrors[field.name] = "Please enter a valid email";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative w-full", className)}
      style={{
        ...themeStyle,
        backgroundColor: "var(--color-background)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={headline}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-narrow)" }}>
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(var(--text-2xl), 3vw, var(--text-3xl))",
              fontWeight: "var(--weight-bold)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
              color: "var(--color-text)",
            }}
          >
            {headline}
          </h2>
          {subheadline && (
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-lg)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-text-secondary)",
              }}
            >
              {subheadline}
            </p>
          )}
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center"
                style={{
                  color: "var(--color-success)",
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-full, 9999px)",
                }}
              >
                <CheckCircle size={32} />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--color-text)",
                }}
              >
                {successMessage}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col"
              style={{ gap: "var(--space-element)" }}
              initial={animate ? { opacity: 0, y: 20 } : false}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              noValidate
            >
              {formFields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={field.name}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--weight-medium)",
                      color: "var(--color-text)",
                    }}
                  >
                    {field.label}
                    {field.required && (
                      <span style={{ color: "var(--color-error)", marginLeft: "0.25rem" }}>*</span>
                    )}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={5}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        borderColor: errors[field.name] ? "var(--color-error)" : undefined,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-light)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors[field.name]
                          ? "var(--color-error)"
                          : "var(--color-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      style={{
                        ...inputStyle,
                        borderColor: errors[field.name] ? "var(--color-error)" : undefined,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-light)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors[field.name]
                          ? "var(--color-error)"
                          : "var(--color-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  )}

                  {errors[field.name] && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-error)",
                      }}
                    >
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 transition-all md:px-8 md:py-3.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--weight-semibold)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-on-primary)",
                  border: "none",
                  cursor: "pointer",
                  transitionDuration: "var(--transition-fast)",
                  transitionTimingFunction: "var(--ease-default)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-primary)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Send size={16} />
                {submitText}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

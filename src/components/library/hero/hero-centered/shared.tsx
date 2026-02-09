"use client";

export const HEIGHT_MAP = {
  viewport: "100vh",
  large: "80vh",
  medium: "60vh",
} as const;

export const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-element)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

export function CTAButtonEl({
  text,
  href,
  variant = "primary",
  external,
}: {
  text: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  external?: boolean;
}): React.ReactElement {
  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    fontWeight: "var(--weight-semibold)",
    borderRadius: "var(--radius-lg)",
    transitionProperty: "background-color, color, border-color, box-shadow",
    transitionDuration: "var(--transition-fast)",
    transitionTimingFunction: "var(--ease-default)",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--color-primary)",
      color: "var(--color-text-on-primary)",
    },
    secondary: {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
      border: "1px solid var(--color-border)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--color-primary)",
      border: "1px solid var(--color-primary)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-primary)",
    },
  };

  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-5 py-3 md:px-7 md:py-3.5"
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-primary)";
        }
      }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {text}
    </a>
  );
}

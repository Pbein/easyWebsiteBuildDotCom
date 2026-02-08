"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ThemeTokens } from "./theme.types";
import { tokensToCSSProperties } from "./token-map";

/* ────────────────────────────────────────────────────────────
 * Context
 * ──────────────────────────────────────────────────────────── */

interface ThemeContextValue {
  tokens: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Access the current theme tokens from anywhere in the tree. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}

/* ────────────────────────────────────────────────────────────
 * Provider
 * ──────────────────────────────────────────────────────────── */

interface ThemeProviderProps {
  tokens: ThemeTokens;
  /** Optional inline overrides merged on top. */
  overrides?: Partial<ThemeTokens>;
  children: ReactNode;
}

/**
 * Injects ThemeTokens as CSS Custom Properties on a wrapper <div>.
 * Every child component can reference the tokens via `var(--token-name)`.
 *
 * Nest ThemeProviders for section-level overrides.
 */
export function ThemeProvider({ tokens, overrides, children }: ThemeProviderProps) {
  const merged = useMemo<ThemeTokens>(
    () => (overrides ? { ...tokens, ...overrides } : tokens),
    [tokens, overrides]
  );

  const cssVars = useMemo(() => tokensToCSSProperties(merged) as React.CSSProperties, [merged]);

  return (
    <ThemeContext.Provider value={{ tokens: merged }}>
      <div style={cssVars}>{children}</div>
    </ThemeContext.Provider>
  );
}

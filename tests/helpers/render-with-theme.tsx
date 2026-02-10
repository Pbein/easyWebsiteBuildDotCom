import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import type { PersonalityVector, ThemeTokens } from "@/lib/theme/theme.types";

interface ThemeRenderOptions extends Omit<RenderOptions, "wrapper"> {
  personalityVector?: PersonalityVector;
  tokens?: ThemeTokens;
}

export function renderWithTheme(ui: React.ReactElement, options: ThemeRenderOptions = {}) {
  const { personalityVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5], tokens, ...renderOptions } = options;

  const themeTokens = tokens ?? generateThemeFromVector(personalityVector);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider tokens={themeTokens}>{children}</ThemeProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

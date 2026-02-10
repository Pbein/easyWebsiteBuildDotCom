import { describe, it, expect } from "vitest";
import { TOKEN_CSS_MAP, tokensToCSSProperties, tokensToCSSString } from "@/lib/theme/token-map";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import type { ThemeTokens } from "@/lib/theme/theme.types";
import { PERSONALITY_VECTORS } from "../../helpers/fixtures";

describe("TOKEN_CSS_MAP", () => {
  it("has an entry for every ThemeTokens key (66 entries)", () => {
    expect(Object.keys(TOKEN_CSS_MAP).length).toBe(66);
  });

  it("all CSS property names start with --", () => {
    for (const cssVar of Object.values(TOKEN_CSS_MAP)) {
      expect(cssVar).toMatch(/^--/);
    }
  });

  it("has no duplicate CSS property names", () => {
    const values = Object.values(TOKEN_CSS_MAP);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});

describe("tokensToCSSProperties", () => {
  it("converts all token keys to CSS custom properties", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    const cssProps = tokensToCSSProperties(tokens);
    expect(Object.keys(cssProps).length).toBe(66);
    expect(cssProps["--color-primary"]).toBe(tokens.colorPrimary);
    expect(cssProps["--font-heading"]).toBe(tokens.fontHeading);
  });

  it("handles partial tokens correctly", () => {
    const partial: Partial<ThemeTokens> = {
      colorPrimary: "#ff0000",
      fontBody: "'TestFont', sans-serif",
    };
    const cssProps = tokensToCSSProperties(partial);
    expect(Object.keys(cssProps).length).toBe(2);
    expect(cssProps["--color-primary"]).toBe("#ff0000");
    expect(cssProps["--font-body"]).toBe("'TestFont', sans-serif");
  });

  it("returns empty object for empty input", () => {
    const cssProps = tokensToCSSProperties({});
    expect(Object.keys(cssProps).length).toBe(0);
  });
});

describe("tokensToCSSString", () => {
  it("generates valid CSS string with :root selector by default", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    const css = tokensToCSSString(tokens);
    expect(css).toContain(":root {");
    expect(css).toContain("--color-primary:");
    expect(css).toContain("}");
  });

  it("uses custom selector when provided", () => {
    const partial: Partial<ThemeTokens> = { colorPrimary: "#ff0000" };
    const css = tokensToCSSString(partial, ".my-theme");
    expect(css).toContain(".my-theme {");
  });

  it("formats each declaration on its own line", () => {
    const tokens = generateThemeFromVector(PERSONALITY_VECTORS.balanced);
    const css = tokensToCSSString(tokens);
    const lines = css.split("\n");
    // First line is selector, last is closing brace
    expect(lines.length).toBe(68); // 1 selector + 66 declarations + 1 closing brace
  });
});

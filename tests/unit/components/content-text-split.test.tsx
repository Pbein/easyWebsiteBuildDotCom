import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createContentTextProps, createContentSplitProps } from "../../helpers/component-fixtures";
import { ContentText, ContentSplit } from "@/components/library";

/* ────────────────────────────────────────────────────────────
 * ContentText
 * ──────────────────────────────────────────────────────────── */

describe("ContentText", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<ContentText {...createContentTextProps()} />);
    }).not.toThrow();
  });

  it("displays headline", () => {
    renderWithTheme(<ContentText {...createContentTextProps()} />);
    expect(screen.getByText("Our Philosophy")).toBeInTheDocument();
  });

  it("renders body content (via dangerouslySetInnerHTML)", () => {
    renderWithTheme(
      <ContentText
        {...createContentTextProps({
          body: "<p>This is <strong>bold</strong> content.</p>",
        })}
      />
    );
    // The raw HTML should be rendered into the DOM
    expect(screen.getByText(/This is/)).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("displays eyebrow when provided", () => {
    renderWithTheme(<ContentText {...createContentTextProps({ eyebrow: "About Us" })} />);
    expect(screen.getByText("About Us")).toBeInTheDocument();
  });

  it('variant="centered" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<ContentText {...createContentTextProps({ variant: "centered" })} />);
    }).not.toThrow();
  });
});

/* ────────────────────────────────────────────────────────────
 * ContentSplit
 * ──────────────────────────────────────────────────────────── */

describe("ContentSplit", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<ContentSplit {...createContentSplitProps()} />);
    }).not.toThrow();
  });

  it("renders section headlines", () => {
    renderWithTheme(<ContentSplit {...createContentSplitProps()} />);
    expect(screen.getByText("Design That Converts")).toBeInTheDocument();
    expect(screen.getByText("Built for Growth")).toBeInTheDocument();
  });

  it('variant="alternating" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<ContentSplit {...createContentSplitProps({ variant: "alternating" })} />);
    }).not.toThrow();
  });
});

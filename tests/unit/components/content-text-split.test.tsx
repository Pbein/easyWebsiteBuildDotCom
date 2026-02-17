/**
 * @requirements ContentText & ContentSplit Component Tests
 *
 * ContentText (src/components/library/content/content-text/ContentText.tsx):
 *  - REQ-CT-01: Headline renders as <h2> (content sections are h2, not h1)
 *  - REQ-CT-02: Body uses dangerouslySetInnerHTML — HTML tags render as real DOM
 *  - REQ-CT-03: Eyebrow renders as smaller text above the headline
 *  - REQ-CT-04: Section has aria-label derived from headline (or fallback "Content")
 *  - REQ-CT-05: HTML links in body are rendered as clickable <a> elements
 *
 * ContentSplit (src/components/library/content/content-split/ContentSplit.tsx):
 *  - REQ-CS-01: Uses `sections` field (CLAUDE.md contract — NOT `rows`)
 *  - REQ-CS-02: Renders all sections from the input array (count matches)
 *  - REQ-CS-03: Image is optional per section (no crash when absent)
 *  - REQ-CS-04: Section has aria-label "Content sections"
 *  - REQ-CS-05: variant="alternating" renders without crashing
 *  - REQ-CS-06: Returns null when sections array is empty
 */

import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
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

  // REQ-CT-01: Headline renders as h2 (content sections use h2, not h1)
  it("headline renders as an h2 element (semantic HTML for content sections)", () => {
    renderWithTheme(<ContentText {...createContentTextProps()} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Our Philosophy");
  });

  // REQ-CT-02: Body HTML is rendered via dangerouslySetInnerHTML (KEPT + extended)
  it("renders body content with bold via dangerouslySetInnerHTML", () => {
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

  // REQ-CT-05: HTML links in body render as clickable <a> elements
  it("renders HTML links in body as real anchor elements", () => {
    renderWithTheme(
      <ContentText
        {...createContentTextProps({
          body: '<p>Visit our <a href="/about">about page</a> for more info.</p>',
        })}
      />
    );
    const link = screen.getByRole("link", { name: "about page" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/about");
  });

  // REQ-CT-03: Eyebrow renders above the headline (KEPT)
  it("displays eyebrow when provided", () => {
    renderWithTheme(<ContentText {...createContentTextProps({ eyebrow: "About Us" })} />);
    expect(screen.getByText("About Us")).toBeInTheDocument();
  });

  // REQ-CT-04: Section has aria-label from headline
  it("section has aria-label derived from headline", () => {
    renderWithTheme(<ContentText {...createContentTextProps()} />);
    const section = screen.getByRole("region", { name: "Our Philosophy" });
    expect(section).toBeInTheDocument();
  });

  // REQ-CT-04 boundary: aria-label falls back to "Content" when no headline
  it('section aria-label falls back to "Content" when no headline is provided', () => {
    renderWithTheme(<ContentText {...createContentTextProps({ headline: undefined })} />);
    const section = screen.getByRole("region", { name: "Content" });
    expect(section).toBeInTheDocument();
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

  // REQ-CS-01: Uses `sections` field (contract from CLAUDE.md, NOT `rows`)
  it("renders section headlines from the sections prop", () => {
    renderWithTheme(<ContentSplit {...createContentSplitProps()} />);
    expect(screen.getByText("Design That Converts")).toBeInTheDocument();
    expect(screen.getByText("Built for Growth")).toBeInTheDocument();
  });

  // REQ-CS-02: Renders all sections — count matches input
  it("renders the correct number of sections from input array", () => {
    renderWithTheme(
      <ContentSplit
        {...createContentSplitProps({
          sections: [
            { headline: "Section A", body: "Body A" },
            { headline: "Section B", body: "Body B" },
            { headline: "Section C", body: "Body C" },
          ],
        })}
      />
    );
    expect(screen.getByText("Section A")).toBeInTheDocument();
    expect(screen.getByText("Section B")).toBeInTheDocument();
    expect(screen.getByText("Section C")).toBeInTheDocument();

    // Each section has a heading (h3 in the source)
    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(3);
  });

  // REQ-CS-03: Image is optional per section (no crash when absent)
  it("renders sections without images (image is optional per section)", () => {
    const { container } = renderWithTheme(
      <ContentSplit
        {...createContentSplitProps({
          sections: [
            { headline: "No Image Here", body: "This section has no image." },
            { headline: "Also No Image", body: "Neither does this one." },
          ],
        })}
      />
    );
    // Should render text content without crashing
    expect(screen.getByText("No Image Here")).toBeInTheDocument();
    expect(screen.getByText("Also No Image")).toBeInTheDocument();

    // No <img> elements since no images were provided
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(0);
  });

  // REQ-CS-04: Section has aria-label
  it('section has aria-label "Content sections"', () => {
    renderWithTheme(<ContentSplit {...createContentSplitProps()} />);
    const section = screen.getByRole("region", { name: "Content sections" });
    expect(section).toBeInTheDocument();
  });

  // REQ-CS-05: variant="alternating" renders (KEPT)
  it('variant="alternating" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<ContentSplit {...createContentSplitProps({ variant: "alternating" })} />);
    }).not.toThrow();
  });

  // REQ-CS-06: Returns null when sections is empty
  it("returns null when sections array is empty", () => {
    const { container } = renderWithTheme(
      <ContentSplit {...createContentSplitProps({ sections: [] })} />
    );
    // The component should return null — no <section> element in the DOM
    const section = container.querySelector("section");
    expect(section).toBeNull();
  });
});

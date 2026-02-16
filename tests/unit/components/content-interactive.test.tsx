// tests/unit/components/content-interactive.test.tsx
//
// Unit tests for interactive content components:
// ContentAccordion and ContentMap

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createContentAccordionProps,
  createContentMapProps,
} from "../../helpers/component-fixtures";
import { ContentAccordion, ContentMap } from "@/components/library";

/* ================================================================
 * ContentAccordion
 * ================================================================ */

describe("ContentAccordion", () => {
  it("renders without crashing", () => {
    const props = createContentAccordionProps();
    const { container } = renderWithTheme(<ContentAccordion {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays headline", () => {
    const props = createContentAccordionProps();
    renderWithTheme(<ContentAccordion {...props} />);
    expect(screen.getByText("Frequently Asked Questions")).toBeTruthy();
  });

  it("displays all questions", () => {
    const props = createContentAccordionProps();
    renderWithTheme(<ContentAccordion {...props} />);
    expect(screen.getByText("How long does it take?")).toBeTruthy();
    expect(screen.getByText("Can I customize my site?")).toBeTruthy();
    expect(screen.getByText("Is there a free plan?")).toBeTruthy();
  });

  it('variant="single-open" renders', () => {
    const props = createContentAccordionProps({ variant: "single-open" });
    const { container } = renderWithTheme(<ContentAccordion {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("How long does it take?")).toBeTruthy();
  });

  it('variant="bordered" renders', () => {
    const props = createContentAccordionProps({ variant: "bordered" });
    const { container } = renderWithTheme(<ContentAccordion {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("How long does it take?")).toBeTruthy();
  });
});

/* ================================================================
 * ContentMap
 * ================================================================ */

describe("ContentMap", () => {
  it("renders without crashing", () => {
    const props = createContentMapProps();
    const { container } = renderWithTheme(<ContentMap {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays headline", () => {
    const props = createContentMapProps();
    renderWithTheme(<ContentMap {...props} />);
    expect(screen.getByText("Find Us")).toBeTruthy();
  });

  it("displays contact address", () => {
    const props = createContentMapProps();
    renderWithTheme(<ContentMap {...props} />);
    // The address appears in the contact info card and may also appear in the map placeholder
    expect(screen.getAllByText("123 Main St, Anytown, USA 12345").length).toBeGreaterThan(0);
  });

  it("displays contact phone", () => {
    const props = createContentMapProps();
    renderWithTheme(<ContentMap {...props} />);
    expect(screen.getByText("(555) 123-4567")).toBeTruthy();
  });

  it("displays contact email", () => {
    const props = createContentMapProps();
    renderWithTheme(<ContentMap {...props} />);
    expect(screen.getByText("hello@example.com")).toBeTruthy();
  });
});

// tests/unit/components/commerce.test.tsx
//
// Unit tests for commerce-related components:
// CommerceServices, PricingTable, BlogPreview

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createCommerceServicesProps,
  createPricingTableProps,
  createBlogPreviewProps,
} from "../../helpers/component-fixtures";
import { CommerceServices, PricingTable, BlogPreview } from "@/components/library";

// Mock next/image since BlogPreview uses it for post images
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
     
    const { fill, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

/* ================================================================
 * CommerceServices
 * ================================================================ */

describe("CommerceServices", () => {
  it("renders without crashing", () => {
    const props = createCommerceServicesProps();
    const { container } = renderWithTheme(<CommerceServices {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays service names (uses `name`, NOT `title`)", () => {
    const props = createCommerceServicesProps();
    renderWithTheme(<CommerceServices {...props} />);
    expect(screen.getByText("Web Design")).toBeTruthy();
    expect(screen.getByText("SEO Optimization")).toBeTruthy();
    expect(screen.getByText("Content Writing")).toBeTruthy();
  });

  it("displays service descriptions", () => {
    const props = createCommerceServicesProps();
    renderWithTheme(<CommerceServices {...props} />);
    expect(screen.getByText("Custom website design tailored to your brand.")).toBeTruthy();
    expect(screen.getByText("Improve your search engine rankings.")).toBeTruthy();
    expect(screen.getByText("Professional copywriting for your site.")).toBeTruthy();
  });

  it('variant="card-grid" renders', () => {
    const props = createCommerceServicesProps({ variant: "card-grid" });
    const { container } = renderWithTheme(<CommerceServices {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("Web Design")).toBeTruthy();
  });
});

/* ================================================================
 * PricingTable
 * ================================================================ */

describe("PricingTable", () => {
  it("renders without crashing", () => {
    const props = createPricingTableProps();
    const { container } = renderWithTheme(<PricingTable {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays plan names", () => {
    const props = createPricingTableProps();
    renderWithTheme(<PricingTable {...props} />);
    expect(screen.getByText("Starter")).toBeTruthy();
    expect(screen.getByText("Pro")).toBeTruthy();
  });

  it("displays plan prices", () => {
    const props = createPricingTableProps();
    renderWithTheme(<PricingTable {...props} />);
    expect(screen.getByText("$12")).toBeTruthy();
    expect(screen.getByText("$29")).toBeTruthy();
  });

  it('variant="simple" renders', () => {
    const props = createPricingTableProps({ variant: "simple" });
    const { container } = renderWithTheme(<PricingTable {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("Starter")).toBeTruthy();
  });
});

/* ================================================================
 * BlogPreview
 * ================================================================ */

describe("BlogPreview", () => {
  it("renders without crashing", () => {
    const props = createBlogPreviewProps();
    const { container } = renderWithTheme(<BlogPreview {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("displays post titles", () => {
    const props = createBlogPreviewProps();
    renderWithTheme(<BlogPreview {...props} />);
    expect(screen.getByText("Getting Started with Web Design")).toBeTruthy();
    expect(screen.getByText("SEO Best Practices for 2026")).toBeTruthy();
    expect(screen.getByText("The Future of AI in Web Development")).toBeTruthy();
  });

  it("displays post excerpts", () => {
    const props = createBlogPreviewProps();
    renderWithTheme(<BlogPreview {...props} />);
    expect(screen.getByText("Learn the fundamentals of creating beautiful websites.")).toBeTruthy();
    expect(screen.getByText("Everything you need to know about search optimization.")).toBeTruthy();
    expect(
      screen.getByText("How artificial intelligence is changing the way we build for the web.")
    ).toBeTruthy();
  });

  it('variant="card-grid" renders', () => {
    const props = createBlogPreviewProps({ variant: "card-grid" });
    const { container } = renderWithTheme(<BlogPreview {...props} />);
    expect(container.querySelector("section")).toBeTruthy();
    expect(screen.getByText("Getting Started with Web Design")).toBeTruthy();
  });
});

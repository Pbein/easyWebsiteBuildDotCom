/**
 * @requirements
 *
 * NavSticky is the sticky navigation component for generated websites.
 *
 * REQ-NAV-01: Renders without crashing with valid props.
 * REQ-NAV-02: Displays the logo text from the `logoText` prop.
 * REQ-NAV-03: Renders all navigation links from the `links` prop.
 * REQ-NAV-04: Renders a CTA button when the `cta` prop is provided.
 * REQ-NAV-05: Does NOT render a CTA button when `cta` is undefined.
 * REQ-NAV-06: Supports variant="transparent" without crashing.
 * REQ-NAV-07: Supports variant="solid" without crashing.
 * REQ-NAV-08: Navigation links have correct href attributes.
 * REQ-NAV-09: Logo links to "/" (homepage).
 * REQ-NAV-10: Renders a <nav> element with role="navigation" for accessibility.
 * REQ-NAV-11: Nav element has an aria-label attribute for screen reader context.
 * REQ-NAV-12: Mobile menu toggle button exists (hamburger button for mobile accessibility).
 */

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createNavStickyProps } from "../../helpers/component-fixtures";
import { NavSticky } from "@/components/library";

describe("NavSticky", () => {
  // ── REQ-NAV-01: Smoke test ────────────────────────────────
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    }).not.toThrow();
  });

  // ── REQ-NAV-02: Logo text ─────────────────────────────────
  it("displays logo text", () => {
    renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    expect(screen.getByText("TestBrand")).toBeInTheDocument();
  });

  // ── REQ-NAV-03: Navigation links ─────────────────────────
  it("renders navigation links", () => {
    renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    // Desktop links are rendered (may also appear in mobile menu via AnimatePresence)
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Contact").length).toBeGreaterThanOrEqual(1);
  });

  // ── REQ-NAV-04: CTA rendered when provided ────────────────
  it("renders CTA button when provided", () => {
    renderWithTheme(
      <NavSticky
        {...createNavStickyProps({
          cta: { text: "Get Started", href: "/signup" },
        })}
      />
    );
    expect(screen.getAllByText("Get Started").length).toBeGreaterThanOrEqual(1);
  });

  // ── REQ-NAV-05: CTA not rendered when absent ─────────────
  it("does NOT render CTA when not provided", () => {
    renderWithTheme(<NavSticky {...createNavStickyProps({ cta: undefined })} />);
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
  });

  // ── REQ-NAV-06: transparent variant ───────────────────────
  it('variant="transparent" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<NavSticky {...createNavStickyProps({ variant: "transparent" })} />);
    }).not.toThrow();
  });

  // ── REQ-NAV-07: solid variant ─────────────────────────────
  it('variant="solid" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<NavSticky {...createNavStickyProps({ variant: "solid" })} />);
    }).not.toThrow();
  });

  // ── REQ-NAV-08: Link hrefs ────────────────────────────────
  it("links have correct href attributes", () => {
    renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    const aboutLinks = screen.getAllByText("About");
    // At least one link should have the correct href
    const hasCorrectHref = aboutLinks.some(
      (link) => link.closest("a")?.getAttribute("href") === "/about"
    );
    expect(hasCorrectHref).toBe(true);

    const contactLinks = screen.getAllByText("Contact");
    const hasContactHref = contactLinks.some(
      (link) => link.closest("a")?.getAttribute("href") === "/contact"
    );
    expect(hasContactHref).toBe(true);
  });

  // ── REQ-NAV-09: Logo links to "/" ─────────────────────────
  it('logo links to "/" (href="/")', () => {
    renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    const logoText = screen.getByText("TestBrand");
    const logoLink = logoText.closest("a");
    expect(logoLink).not.toBeNull();
    expect(logoLink?.getAttribute("href")).toBe("/");
  });

  // ── REQ-NAV-10: nav element with role ─────────────────────
  it("has nav element with role=navigation for accessibility", () => {
    const { container } = renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    const navElement = container.querySelector("nav");
    expect(navElement).toBeInTheDocument();
    expect(navElement?.getAttribute("role")).toBe("navigation");
  });

  // ── REQ-NAV-11: aria-label for screen readers ─────────────
  it("nav element has aria-label attribute for screen reader context", () => {
    const { container } = renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    const navElement = container.querySelector("nav");
    expect(navElement).toBeInTheDocument();
    // NavSticky sets aria-label="Main navigation" on the <nav> element
    const ariaLabel = navElement?.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain("navigation");
  });

  // ── REQ-NAV-12: Mobile menu toggle button exists ──────────
  it("renders a mobile menu toggle button with accessible label", () => {
    const { container } = renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    // The hamburger button has aria-label="Open menu" (or "Close menu" when open)
    // and aria-expanded attribute for ARIA compliance
    const toggleButton = container.querySelector("button[aria-label]");
    expect(toggleButton).not.toBeNull();
    // The button should have aria-expanded for mobile menu state
    expect(toggleButton?.hasAttribute("aria-expanded")).toBe(true);
  });
});

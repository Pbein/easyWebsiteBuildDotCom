import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createNavStickyProps } from "../../helpers/component-fixtures";
import { NavSticky } from "@/components/library";

describe("NavSticky", () => {
  it("renders without crashing", () => {
    expect(() => {
      renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    }).not.toThrow();
  });

  it("displays logo text", () => {
    renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    expect(screen.getByText("TestBrand")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    // Desktop links are rendered (may also appear in mobile menu via AnimatePresence)
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Contact").length).toBeGreaterThanOrEqual(1);
  });

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

  it("does NOT render CTA when not provided", () => {
    renderWithTheme(<NavSticky {...createNavStickyProps({ cta: undefined })} />);
    expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
  });

  it('variant="transparent" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<NavSticky {...createNavStickyProps({ variant: "transparent" })} />);
    }).not.toThrow();
  });

  it('variant="solid" renders without crashing', () => {
    expect(() => {
      renderWithTheme(<NavSticky {...createNavStickyProps({ variant: "solid" })} />);
    }).not.toThrow();
  });

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

  it('logo links to "/" (href="/")', () => {
    renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    const logoText = screen.getByText("TestBrand");
    const logoLink = logoText.closest("a");
    expect(logoLink).not.toBeNull();
    expect(logoLink?.getAttribute("href")).toBe("/");
  });

  it("has nav element for accessibility", () => {
    const { container } = renderWithTheme(<NavSticky {...createNavStickyProps()} />);
    const navElement = container.querySelector("nav");
    expect(navElement).toBeInTheDocument();
    expect(navElement?.getAttribute("role")).toBe("navigation");
  });
});

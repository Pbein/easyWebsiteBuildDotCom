/**
 * @requirements ContentFeatures — Requirements-First Tests
 *
 * Source: src/components/library/content/content-features/ContentFeatures.tsx
 *
 * Key behaviors under test:
 *   - Lucide icon lookup via dynamic `getIcon(name)` — returns SVG for valid
 *     icon names, returns null (graceful no-crash) for invalid names
 *   - Feature titles render as h3 elements (semantic heading hierarchy)
 *   - Section aria-label uses headline when provided, falls back to "Features"
 *   - No hardcoded hex colors — all styling via CSS custom properties (var(--...))
 *   - Feature grid renders ALL items from the input array
 *   - All variants ("icon-cards") render without crashing
 *
 * These tests validate REQUIREMENTS and BEHAVIOR, not implementation details
 * like exact class names or pixel values.
 */

import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import { createContentFeaturesProps } from "../../helpers/component-fixtures";
import { ContentFeatures } from "@/components/library";

/* ── Test 1: Valid Lucide icons render SVG elements ──────────── */

describe("ContentFeatures — icon rendering", () => {
  it("requirement: valid Lucide icon names render SVG elements in the icon container", () => {
    // "Zap", "Shield", "Globe" are all valid Lucide icon names in the fixture
    renderWithTheme(<ContentFeatures {...createContentFeaturesProps()} />);

    // Each icon container (the div wrapping the icon) should contain an SVG
    // Lucide icons render as <svg> elements
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThanOrEqual(3);
  });

  it("boundary: invalid icon names do not crash the component", () => {
    // Use icon names that do NOT exist in lucide-react
    const propsWithBadIcons = createContentFeaturesProps({
      features: [
        { icon: "TotallyFakeIconXYZ", title: "Feature A", description: "Description A" },
        { icon: "AnotherBogusIcon999", title: "Feature B", description: "Description B" },
        { icon: "Zap", title: "Feature C", description: "Valid icon here" },
      ],
    });

    // Should not throw
    expect(() => {
      renderWithTheme(<ContentFeatures {...propsWithBadIcons} />);
    }).not.toThrow();

    // The valid icon should still render an SVG
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThanOrEqual(1);

    // All feature titles should still render regardless of icon validity
    expect(screen.getByText("Feature A")).toBeInTheDocument();
    expect(screen.getByText("Feature B")).toBeInTheDocument();
    expect(screen.getByText("Feature C")).toBeInTheDocument();
  });
});

/* ── Test 3: Semantic heading hierarchy ──────────────────────── */

describe("ContentFeatures — semantic structure", () => {
  it("requirement: feature titles render as h3 elements", () => {
    renderWithTheme(<ContentFeatures {...createContentFeaturesProps()} />);

    const h3Elements = document.querySelectorAll("h3");

    // Should have one h3 per feature (3 features in default fixture)
    expect(h3Elements.length).toBe(3);

    // Each h3 should contain a feature title from the fixture
    const h3Texts = Array.from(h3Elements).map((el) => el.textContent);
    expect(h3Texts).toContain("Lightning Fast");
    expect(h3Texts).toContain("Secure");
    expect(h3Texts).toContain("Global CDN");
  });
});

/* ── Test 4: Aria-label fallback ─────────────────────────────── */

describe("ContentFeatures — accessibility", () => {
  it("contract: section uses headline as aria-label when provided", () => {
    renderWithTheme(
      <ContentFeatures {...createContentFeaturesProps({ headline: "Our Strengths" })} />
    );

    const section = screen.getByRole("region", { name: "Our Strengths" });
    expect(section).toBeInTheDocument();
  });

  it("contract: section falls back to 'Features' aria-label when no headline provided", () => {
    renderWithTheme(<ContentFeatures {...createContentFeaturesProps({ headline: undefined })} />);

    const section = screen.getByRole("region", { name: "Features" });
    expect(section).toBeInTheDocument();
  });
});

/* ── Test 5: No hardcoded hex colors ─────────────────────────── */

describe("ContentFeatures — theme consumption", () => {
  it("invariant: no hardcoded hex colors in component's own inline styles", () => {
    renderWithTheme(<ContentFeatures {...createContentFeaturesProps()} />);

    // Find the component's root <section> element — this is the ContentFeatures
    // boundary. The ThemeProvider wrapper above it legitimately uses hex values
    // in CSS custom property definitions (e.g., "--color-primary: #39c645"),
    // which are not hardcoded component colors.
    const section = document.querySelector("section");
    expect(section).not.toBeNull();

    // Check all elements WITHIN the section (the component's own tree)
    const allElements = section!.querySelectorAll("[style]");
    const hexColorPattern = /#[0-9a-fA-F]{3,8}\b/;

    allElements.forEach((el) => {
      const styleAttr = el.getAttribute("style") || "";
      // Strip var() references (which correctly use CSS custom properties)
      const nonVarParts = styleAttr.replace(/var\([^)]*\)/g, "");
      // Strip CSS custom property definitions (--prop-name: value) which are
      // theme token injections, not hardcoded component colors
      const withoutCustomProps = nonVarParts.replace(/--[\w-]+:\s*[^;]+;?/g, "");
      expect(withoutCustomProps).not.toMatch(hexColorPattern);
    });
  });
});

/* ── Test 6: Feature count matches input ─────────────────────── */

describe("ContentFeatures — data integrity", () => {
  it("contract: renders exactly as many feature cards as items in the input array", () => {
    const features = [
      { icon: "Zap", title: "Alpha", description: "First" },
      { icon: "Shield", title: "Beta", description: "Second" },
      { icon: "Globe", title: "Gamma", description: "Third" },
      { icon: "Star", title: "Delta", description: "Fourth" },
      { icon: "Heart", title: "Epsilon", description: "Fifth" },
    ];

    renderWithTheme(<ContentFeatures {...createContentFeaturesProps({ features })} />);

    // Each feature should have its title visible
    for (const feature of features) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }

    // h3 count should match feature count
    const h3Elements = document.querySelectorAll("h3");
    expect(h3Elements.length).toBe(features.length);
  });
});

/* ── Test 7: All variants render without crashing ────────────── */

describe("ContentFeatures — variants", () => {
  it("contract: 'icon-cards' variant renders without crashing and shows all features", () => {
    const props = createContentFeaturesProps({ variant: "icon-cards" });

    expect(() => {
      renderWithTheme(<ContentFeatures {...props} />);
    }).not.toThrow();

    // All feature titles from default fixture should be present
    expect(screen.getByText("Lightning Fast")).toBeInTheDocument();
    expect(screen.getByText("Secure")).toBeInTheDocument();
    expect(screen.getByText("Global CDN")).toBeInTheDocument();
  });

  it("contract: default variant (no variant prop) renders without crashing", () => {
    const props = createContentFeaturesProps();
    // Explicitly remove variant to test default path
    delete (props as Record<string, unknown>).variant;

    expect(() => {
      renderWithTheme(<ContentFeatures {...props} />);
    }).not.toThrow();

    expect(screen.getByText("Lightning Fast")).toBeInTheDocument();
  });
});

/**
 * @requirements
 *
 * Cross-cutting invariant test for the component library.
 *
 * From CLAUDE.md: "Library components NEVER hardcode visual values — all via
 * CSS Custom Properties." This file validates that invariant.
 *
 * REQ-TC-01: All 24 non-Section library components render within a ThemeProvider
 *            without throwing (consolidated smoke test).
 * REQ-TC-02: Component count matches the expected 24 non-Section library components.
 *            This catches components silently dropped from the test list.
 * REQ-TC-03: No library component injects hardcoded hex colors into inline styles.
 *            Hex values in CSS custom property definitions (--color-xxx: #hex) and
 *            var() references are legitimate and excluded from this check.
 *            The ThemeProvider wrapper div is also excluded.
 */

import { describe, it, expect } from "vitest";
import React from "react";
import { renderWithTheme } from "../../helpers/render-with-theme";
import * as fixtures from "../../helpers/component-fixtures";
import {
  NavSticky,
  HeroCentered,
  HeroSplit,
  HeroVideo,
  ContentFeatures,
  ContentSplit,
  ContentText,
  ContentStats,
  ContentAccordion,
  ContentTimeline,
  ContentLogos,
  ContentSteps,
  ContentComparison,
  ContentMap,
  BlogPreview,
  CommerceServices,
  PricingTable,
  ProofTestimonials,
  ProofBeforeAfter,
  TeamGrid,
  MediaGallery,
  CtaBanner,
  FormContact,
  FooterStandard,
} from "@/components/library";

/**
 * Component map: every non-Section library component with its fixture factory.
 *
 * Section is tested separately in section.test.tsx because it is the
 * universal layout wrapper, not a content component.
 */
const COMPONENT_MAP: Array<{
  name: string;
  Component: React.ComponentType<Record<string, unknown>>;
  props: Record<string, unknown>;
  /** The root element tag the component renders (for scoping hex checks). */
  rootTag: string;
}> = [
  {
    name: "NavSticky",
    Component: NavSticky as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createNavStickyProps(),
    rootTag: "nav",
  },
  {
    name: "HeroCentered",
    Component: HeroCentered as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createHeroCenteredProps(),
    rootTag: "section",
  },
  {
    name: "HeroSplit",
    Component: HeroSplit as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createHeroSplitProps(),
    rootTag: "section",
  },
  {
    name: "HeroVideo",
    Component: HeroVideo as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createHeroVideoProps(),
    rootTag: "section",
  },
  {
    name: "ContentFeatures",
    Component: ContentFeatures as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentFeaturesProps(),
    rootTag: "section",
  },
  {
    name: "ContentSplit",
    Component: ContentSplit as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentSplitProps(),
    rootTag: "section",
  },
  {
    name: "ContentText",
    Component: ContentText as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentTextProps(),
    rootTag: "section",
  },
  {
    name: "ContentStats",
    Component: ContentStats as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentStatsProps(),
    rootTag: "section",
  },
  {
    name: "ContentAccordion",
    Component: ContentAccordion as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentAccordionProps(),
    rootTag: "section",
  },
  {
    name: "ContentTimeline",
    Component: ContentTimeline as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentTimelineProps(),
    rootTag: "section",
  },
  {
    name: "ContentLogos",
    Component: ContentLogos as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentLogosProps(),
    rootTag: "section",
  },
  {
    name: "ContentSteps",
    Component: ContentSteps as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentStepsProps(),
    rootTag: "section",
  },
  {
    name: "ContentComparison",
    Component: ContentComparison as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentComparisonProps(),
    rootTag: "section",
  },
  {
    name: "ContentMap",
    Component: ContentMap as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentMapProps(),
    rootTag: "section",
  },
  {
    name: "BlogPreview",
    Component: BlogPreview as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createBlogPreviewProps(),
    rootTag: "section",
  },
  {
    name: "CommerceServices",
    Component: CommerceServices as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createCommerceServicesProps(),
    rootTag: "section",
  },
  {
    name: "PricingTable",
    Component: PricingTable as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createPricingTableProps(),
    rootTag: "section",
  },
  {
    name: "ProofTestimonials",
    Component: ProofTestimonials as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createProofTestimonialsProps(),
    rootTag: "section",
  },
  {
    name: "ProofBeforeAfter",
    Component: ProofBeforeAfter as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createProofBeforeAfterProps(),
    rootTag: "section",
  },
  {
    name: "TeamGrid",
    Component: TeamGrid as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createTeamGridProps(),
    rootTag: "section",
  },
  {
    name: "MediaGallery",
    Component: MediaGallery as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createMediaGalleryProps(),
    rootTag: "section",
  },
  {
    name: "CtaBanner",
    Component: CtaBanner as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createCtaBannerProps(),
    rootTag: "section",
  },
  {
    name: "FormContact",
    Component: FormContact as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createFormContactProps(),
    rootTag: "section",
  },
  {
    name: "FooterStandard",
    Component: FooterStandard as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createFooterStandardProps(),
    rootTag: "footer",
  },
];

// ── Expected count ──────────────────────────────────────────
// The library has 25 components total (24 content/functional + Section layout wrapper).
// Section is tested separately in section.test.tsx.
// This constant should be 24 (25 - Section).
const EXPECTED_NON_SECTION_COMPONENT_COUNT = 24;

/**
 * Extract hardcoded hex color values from inline styles on elements.
 *
 * Excludes:
 * - CSS custom property definitions (e.g., `--color-primary: #abc123`)
 * - var() references (e.g., `color: var(--color-text)`)
 *
 * Returns an array of hex color strings found, empty if none (compliant).
 */
function getInlineHexColors(root: HTMLElement): string[] {
  const hexColors: string[] = [];
  const elements = root.querySelectorAll("[style]");
  elements.forEach((el) => {
    const style = el.getAttribute("style") || "";
    // Strip out CSS custom property definitions: --some-var: #hexvalue
    // These are set by tokensToCSSProperties and are legitimate.
    const withoutCustomProps = style.replace(/--[\w-]+:\s*#[0-9a-fA-F]{3,8}/g, "");
    // Strip out var() references which are the correct way to consume tokens.
    const withoutVarRefs = withoutCustomProps.replace(/var\([^)]+\)/g, "");
    // Now look for any remaining hardcoded hex colors.
    const matches = withoutVarRefs.match(/#[0-9a-fA-F]{3,8}\b/gi);
    if (matches) {
      hexColors.push(...matches);
    }
  });
  return hexColors;
}

describe("Theme consumption — all components render with theme", () => {
  // ── REQ-TC-02: Component count guard ──────────────────────
  it(`COMPONENT_MAP covers all ${EXPECTED_NON_SECTION_COMPONENT_COUNT} non-Section library components`, () => {
    expect(COMPONENT_MAP).toHaveLength(EXPECTED_NON_SECTION_COMPONENT_COUNT);

    // Every entry should have a unique name
    const names = COMPONENT_MAP.map((c) => c.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(EXPECTED_NON_SECTION_COMPONENT_COUNT);
  });

  // ── REQ-TC-01: Consolidated smoke test ────────────────────
  it.each(COMPONENT_MAP.map((c) => [c.name, c.Component, c.props]))(
    "%s renders within ThemeProvider without throwing",
    (_name, Component, props) => {
      expect(() =>
        renderWithTheme(
          React.createElement(
            Component as React.ComponentType<Record<string, unknown>>,
            props as Record<string, unknown>
          )
        )
      ).not.toThrow();
    }
  );

  // ── REQ-TC-03: No hardcoded hex colors in inline styles ───
  describe("no hardcoded hex colors in component inline styles", () => {
    COMPONENT_MAP.forEach(({ name, Component, props, rootTag }) => {
      it(`${name} does not use hardcoded hex colors in inline styles`, () => {
        const { container } = renderWithTheme(React.createElement(Component, props));

        // Find the component's own root element inside the ThemeProvider wrapper div.
        // The ThemeProvider wrapper is the first child div with CSS custom properties
        // (--color-xxx: #hex), which we need to skip.
        const componentRoot = container.querySelector(rootTag);

        // If the component doesn't have the expected root tag, skip gracefully.
        // This shouldn't happen if the rootTag mapping is correct, but guard against
        // it to avoid false positives.
        if (!componentRoot) {
          // Fall back to checking all elements except the ThemeProvider wrapper div.
          // The ThemeProvider wrapper is container > div (first child).
          const themeWrapper = container.firstElementChild as HTMLElement;
          if (!themeWrapper) return;

          // Check children of the ThemeProvider wrapper
          const children = Array.from(themeWrapper.children);
          for (const child of children) {
            const hexColors = getInlineHexColors(child as HTMLElement);
            expect(
              hexColors,
              `${name} has hardcoded hex color(s) in inline styles: ${hexColors.join(", ")}. ` +
                `Library components must use CSS custom properties (var(--token-name)) instead.`
            ).toHaveLength(0);
          }
          return;
        }

        const hexColors = getInlineHexColors(componentRoot as HTMLElement);
        expect(
          hexColors,
          `${name} has hardcoded hex color(s) in inline styles: ${hexColors.join(", ")}. ` +
            `Library components must use CSS custom properties (var(--token-name)) instead.`
        ).toHaveLength(0);
      });
    });
  });
});

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
 * Cross-cutting test: every library component must render within a
 * ThemeProvider without throwing. This validates that components consume
 * theme tokens correctly and do not rely on hardcoded values that break
 * when a theme is applied.
 */

const COMPONENT_MAP: Array<{
  name: string;
  Component: React.ComponentType<Record<string, unknown>>;
  props: Record<string, unknown>;
}> = [
  {
    name: "NavSticky",
    Component: NavSticky as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createNavStickyProps(),
  },
  {
    name: "HeroCentered",
    Component: HeroCentered as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createHeroCenteredProps(),
  },
  {
    name: "HeroSplit",
    Component: HeroSplit as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createHeroSplitProps(),
  },
  {
    name: "HeroVideo",
    Component: HeroVideo as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createHeroVideoProps(),
  },
  {
    name: "ContentFeatures",
    Component: ContentFeatures as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentFeaturesProps(),
  },
  {
    name: "ContentSplit",
    Component: ContentSplit as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentSplitProps(),
  },
  {
    name: "ContentText",
    Component: ContentText as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentTextProps(),
  },
  {
    name: "ContentStats",
    Component: ContentStats as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentStatsProps(),
  },
  {
    name: "ContentAccordion",
    Component: ContentAccordion as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentAccordionProps(),
  },
  {
    name: "ContentTimeline",
    Component: ContentTimeline as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentTimelineProps(),
  },
  {
    name: "ContentLogos",
    Component: ContentLogos as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentLogosProps(),
  },
  {
    name: "ContentSteps",
    Component: ContentSteps as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentStepsProps(),
  },
  {
    name: "ContentComparison",
    Component: ContentComparison as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentComparisonProps(),
  },
  {
    name: "ContentMap",
    Component: ContentMap as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createContentMapProps(),
  },
  {
    name: "BlogPreview",
    Component: BlogPreview as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createBlogPreviewProps(),
  },
  {
    name: "CommerceServices",
    Component: CommerceServices as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createCommerceServicesProps(),
  },
  {
    name: "PricingTable",
    Component: PricingTable as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createPricingTableProps(),
  },
  {
    name: "ProofTestimonials",
    Component: ProofTestimonials as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createProofTestimonialsProps(),
  },
  {
    name: "ProofBeforeAfter",
    Component: ProofBeforeAfter as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createProofBeforeAfterProps(),
  },
  {
    name: "TeamGrid",
    Component: TeamGrid as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createTeamGridProps(),
  },
  {
    name: "MediaGallery",
    Component: MediaGallery as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createMediaGalleryProps(),
  },
  {
    name: "CtaBanner",
    Component: CtaBanner as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createCtaBannerProps(),
  },
  {
    name: "FormContact",
    Component: FormContact as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createFormContactProps(),
  },
  {
    name: "FooterStandard",
    Component: FooterStandard as React.ComponentType<Record<string, unknown>>,
    props: fixtures.createFooterStandardProps(),
  },
];

describe("Theme consumption — all components render with theme", () => {
  COMPONENT_MAP.forEach(({ name, Component, props }) => {
    it(`${name} renders within ThemeProvider`, () => {
      expect(() => renderWithTheme(React.createElement(Component, props))).not.toThrow();
    });
  });
});

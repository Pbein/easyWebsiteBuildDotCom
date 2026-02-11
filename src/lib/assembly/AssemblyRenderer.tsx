"use client";

import { useEffect, useMemo } from "react";
import type { SiteIntentDocument } from "./spec.types";
import { getComponent, UNWRAPPED_COMPONENTS } from "./component-registry";
import { loadGoogleFonts } from "./font-loader";
import { generateThemeFromVector, ThemeProvider, applyEmotionalOverrides } from "@/lib/theme";
import type { PersonalityVector, ThemeTokens } from "@/lib/theme";
import { Section } from "@/components/library";

interface AssemblyRendererProps {
  spec: SiteIntentDocument;
  activePage?: string;
  /** When true, renders nav-sticky as relative instead of fixed to avoid toolbar overlap */
  previewMode?: boolean;
  /** When provided, bypasses internal theme generation and uses this theme directly */
  themeOverride?: ThemeTokens;
}

/**
 * Renders a complete website preview from a SiteIntentDocument.
 *
 * - Generates a theme from the personality vector
 * - Loads Google Fonts dynamically
 * - Renders each component from the page spec via the registry
 * - Wraps content components in alternating Section backgrounds
 */
export function AssemblyRenderer({
  spec,
  activePage = "/",
  previewMode = false,
  themeOverride,
}: AssemblyRendererProps): React.ReactElement {
  const pv = spec.personalityVector as PersonalityVector;

  const generatedTheme = useMemo(() => {
    const baseTheme = generateThemeFromVector(pv, { businessType: spec.siteType });
    return spec.emotionalGoals?.length
      ? applyEmotionalOverrides(baseTheme, spec.emotionalGoals, spec.antiReferences || [])
      : baseTheme;
  }, [pv, spec.siteType, spec.emotionalGoals, spec.antiReferences]);

  const theme = themeOverride ?? generatedTheme;

  // Load fonts when theme is ready
  useEffect(() => {
    loadGoogleFonts(theme.fontHeading, theme.fontBody);
  }, [theme.fontHeading, theme.fontBody]);

  const page = spec.pages.find((p) => p.slug === activePage) ?? spec.pages[0];

  if (!page) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No page found in spec.
      </div>
    );
  }

  // Sort components by order
  const sorted = [...page.components].sort((a, b) => a.order - b.order);

  // Track alternating backgrounds for content components
  let bgIndex = 0;
  const bgCycle: Array<"none" | "surface"> = ["none", "surface"];

  return (
    <ThemeProvider tokens={theme}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text)",
        }}
      >
        {sorted.map((placement, i) => {
          const Component = getComponent(placement.componentId);
          if (!Component) {
            return (
              <div
                key={`${placement.componentId}-${i}`}
                className="p-4 text-center text-sm opacity-50"
              >
                Unknown component: {placement.componentId}
              </div>
            );
          }

          const isUnwrapped = UNWRAPPED_COMPONENTS.has(placement.componentId);
          const isHero = placement.componentId.startsWith("hero-");

          if (isUnwrapped) {
            const extraProps: Record<string, unknown> = {};
            if (previewMode && placement.componentId === "nav-sticky") {
              extraProps.sticky = false;
            }
            return (
              <Component
                key={`${placement.componentId}-${i}`}
                variant={placement.variant}
                {...placement.content}
                {...extraProps}
              />
            );
          }

          if (isHero) {
            return (
              <Component
                key={`${placement.componentId}-${i}`}
                variant={placement.variant}
                {...placement.content}
              />
            );
          }

          // Content component — wrap in Section with alternating background
          const bg = bgCycle[bgIndex % bgCycle.length];
          bgIndex++;

          return (
            <Section
              key={`${placement.componentId}-${i}`}
              background={bg === "none" ? "default" : "surface"}
            >
              <Component variant={placement.variant} {...placement.content} />
            </Section>
          );
        })}
      </div>
    </ThemeProvider>
  );
}

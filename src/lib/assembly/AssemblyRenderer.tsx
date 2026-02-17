"use client";

import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import type { SiteIntentDocument, VisualConfig } from "./spec.types";
import { getComponent, UNWRAPPED_COMPONENTS } from "./component-registry";
import { loadGoogleFonts } from "./font-loader";
import { generateThemeFromVector, ThemeProvider, applyEmotionalOverrides } from "@/lib/theme";
import type { PersonalityVector, ThemeTokens } from "@/lib/theme";
import { Section } from "@/components/library";
import { generatePattern, getPatternSize, getPatternPosition } from "@/lib/visuals/css-patterns";
import type { DividerStyle } from "@/lib/visuals/visual-vocabulary";
import { getEffect, injectKeyframes } from "@/lib/css-effects";

/**
 * Converts a VisualConfig into Section component props.
 * Resolves pattern IDs to CSS background values using theme colors.
 */
function buildSectionVisualProps(
  vc: VisualConfig | undefined,
  theme: ThemeTokens
): Record<string, unknown> {
  if (!vc) return {};

  const props: Record<string, unknown> = {};

  if (vc.pattern && vc.pattern !== "none") {
    const patternCss = generatePattern(vc.pattern, theme.colorPrimary);
    if (patternCss) {
      props.pattern = patternCss;
      props.patternSize = getPatternSize(vc.pattern);
      props.patternPosition = getPatternPosition(vc.pattern);
      props.patternOpacity = 0.06;
    }
  }

  if (vc.dividerBottom && vc.dividerBottom !== "none") {
    props.dividerBottom = vc.dividerBottom as DividerStyle;
  }

  return props;
}

/**
 * Resolves effect IDs from VisualConfig into merged CSSProperties.
 * Also injects any required @keyframes into the document.
 */
function buildEffectStyles(vc: VisualConfig | undefined, theme: ThemeTokens): CSSProperties {
  if (!vc?.effects?.length) return {};

  let merged: CSSProperties = {};

  for (const effectId of vc.effects) {
    const entry = getEffect(effectId);
    if (!entry) continue;

    const result = entry.generate({
      colorPrimary: theme.colorPrimary,
      colorSecondary: theme.colorSecondary ?? theme.colorPrimaryDark,
      colorAccent: theme.colorAccent ?? theme.colorPrimaryLight,
    });

    // Inject keyframes if the effect has them
    if (result.keyframes && result.keyframeName) {
      injectKeyframes(result.keyframeName, result.keyframes);
    }

    // Merge styles (later effects override earlier ones)
    merged = { ...merged, ...result.style };
  }

  return merged;
}

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

  // Stringify array deps to avoid infinite memo invalidation from new references
  const pvKey = JSON.stringify(pv);
  const emotionalGoalsKey = JSON.stringify(spec.emotionalGoals ?? []);
  const antiRefsKey = JSON.stringify(spec.antiReferences ?? []);

  const generatedTheme = useMemo(() => {
    const baseTheme = generateThemeFromVector(pv, { businessType: spec.siteType });
    return spec.emotionalGoals?.length
      ? applyEmotionalOverrides(baseTheme, spec.emotionalGoals, spec.antiReferences || [])
      : baseTheme;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pvKey, spec.siteType, emotionalGoalsKey, antiRefsKey]);

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

          // Content component — wrap in Section with alternating background + visual config
          const bg = bgCycle[bgIndex % bgCycle.length];
          bgIndex++;

          const vc: VisualConfig | undefined = placement.visualConfig;
          const sectionVisualProps = buildSectionVisualProps(vc, theme);
          const effectStyles = buildEffectStyles(vc, theme);

          return (
            <Section
              key={`${placement.componentId}-${i}`}
              background={bg === "none" ? "default" : "surface"}
              {...sectionVisualProps}
            >
              {Object.keys(effectStyles).length > 0 ? (
                <div style={effectStyles}>
                  <Component variant={placement.variant} {...placement.content} />
                </div>
              ) : (
                <Component variant={placement.variant} {...placement.content} />
              )}
            </Section>
          );
        })}
      </div>
    </ThemeProvider>
  );
}

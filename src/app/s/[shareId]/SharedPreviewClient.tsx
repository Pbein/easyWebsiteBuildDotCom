"use client";

import { useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation } from "convex/react";
import posthog from "posthog-js";
import { api } from "../../../../convex/_generated/api";
import { AssemblyRenderer } from "@/lib/assembly";
import type { SiteIntentDocument } from "@/lib/assembly";
import {
  getPresetById,
  deriveThemeFromPrimaryColor,
  getFontPairingById,
  generateThemeVariants,
  applyEmotionalOverrides,
} from "@/lib/theme";
import type { PersonalityVector, ThemeTokens } from "@/lib/theme";
import { BuiltWithBadge } from "@/components/platform/BuiltWithBadge";
import { Loader2 } from "lucide-react";

function SharedPreviewContent({ shareId }: { shareId: string }): React.ReactElement {
  const sharedPreview = useQuery(api.sharedPreviews.getSharedPreview, { shareId });
  const rawSpec = useQuery(
    api.siteSpecs.getSiteSpec,
    sharedPreview ? { sessionId: sharedPreview.sessionId } : "skip"
  );
  const incrementView = useMutation(api.sharedPreviews.incrementViewCount);
  const hasTrackedView = useRef(false);

  // Increment view count once on mount
  useEffect(() => {
    if (sharedPreview && !hasTrackedView.current) {
      hasTrackedView.current = true;
      void incrementView({ shareId });
      posthog.capture("shared_preview_viewed", {
        share_id: shareId,
        business_name: sharedPreview.businessName,
        site_type: sharedPreview.siteType,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      });
    }
  }, [sharedPreview, shareId, incrementView]);

  // Build theme with customization snapshot
  const spec: SiteIntentDocument | null = useMemo(() => {
    if (!rawSpec) return null;

    const base: SiteIntentDocument = {
      sessionId: rawSpec.sessionId,
      siteType: rawSpec.siteType,
      conversionGoal: rawSpec.conversionGoal,
      personalityVector: rawSpec.personalityVector,
      businessName: rawSpec.businessName,
      tagline: rawSpec.tagline ?? "",
      pages: rawSpec.pages as SiteIntentDocument["pages"],
      metadata: (rawSpec.metadata as SiteIntentDocument["metadata"]) ?? {
        generatedAt: rawSpec.createdAt,
        method: "deterministic" as const,
      },
      emotionalGoals: rawSpec.emotionalGoals as string[] | undefined,
      voiceProfile: rawSpec.voiceProfile as string | undefined,
      brandArchetype: rawSpec.brandArchetype as string | undefined,
      antiReferences: rawSpec.antiReferences as string[] | undefined,
      narrativePrompts: rawSpec.narrativePrompts as Record<string, string> | undefined,
    };

    // Apply content overrides from customization snapshot
    if (sharedPreview?.customization?.contentOverrides) {
      const overrides = sharedPreview.customization.contentOverrides as Record<
        number,
        Record<string, string>
      >;
      if (Object.keys(overrides).length > 0) {
        const cloned: SiteIntentDocument = JSON.parse(JSON.stringify(base));
        for (const page of cloned.pages) {
          const sorted = [...page.components].sort((a, b) => a.order - b.order);
          for (const [indexStr, fields] of Object.entries(overrides)) {
            const idx = Number(indexStr);
            if (sorted[idx]) {
              const content = sorted[idx].content as Record<string, unknown>;
              for (const [field, value] of Object.entries(fields)) {
                content[field] = value;
              }
            }
          }
        }
        return cloned;
      }
    }

    return base;
  }, [rawSpec, sharedPreview]);

  const activeTheme = useMemo((): ThemeTokens | undefined => {
    if (!spec || !sharedPreview) return undefined;
    const pv = spec.personalityVector as PersonalityVector;
    const cust = sharedPreview.customization;

    // Layer 1: preset or generated theme
    let theme: ThemeTokens;
    if (cust.activePresetId) {
      const preset = getPresetById(cust.activePresetId);
      if (preset) {
        theme = preset.tokens;
      } else {
        const variants = generateThemeVariants(pv, { businessType: spec.siteType });
        theme = spec.emotionalGoals?.length
          ? applyEmotionalOverrides(
              variants.variantA,
              spec.emotionalGoals,
              spec.antiReferences || []
            )
          : variants.variantA;
      }
    } else {
      const variants = generateThemeVariants(pv, { businessType: spec.siteType });
      theme = spec.emotionalGoals?.length
        ? applyEmotionalOverrides(variants.variantA, spec.emotionalGoals, spec.antiReferences || [])
        : variants.variantA;
    }

    // Layer 2: primary color override
    if (cust.primaryColorOverride) {
      const colorTokens = deriveThemeFromPrimaryColor(cust.primaryColorOverride, pv, spec.siteType);
      theme = { ...theme, ...colorTokens };
    }

    // Layer 3: font pairing override
    if (cust.fontPairingId) {
      const pairing = getFontPairingById(cust.fontPairingId);
      if (pairing) {
        theme = {
          ...theme,
          fontHeading: pairing.heading,
          fontBody: pairing.body,
          fontAccent: pairing.accent,
        };
      }
    }

    return theme;
  }, [spec, sharedPreview]);

  // Loading
  if (sharedPreview === undefined || rawSpec === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0b0f]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#e8a849]" />
          <p className="text-sm text-[rgba(255,255,255,0.5)]">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (sharedPreview === null || rawSpec === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0b0f]">
        <div className="max-w-md text-center">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #e8a849, #3ecfb4)",
              fontWeight: 800,
              fontSize: "28px",
              color: "#0a0b0f",
              marginBottom: "24px",
            }}
          >
            E
          </div>
          <h1
            className="mb-2 text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Preview Not Found
          </h1>
          <p className="mb-8 text-sm text-[rgba(255,255,255,0.5)]">
            This preview link may have expired or been removed.
          </p>
          <a
            href="https://easywebsitebuild.com?utm_source=shared_preview&utm_medium=not_found&utm_campaign=viral"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-[#0a0b0f] transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #e8a849, #3ecfb4)" }}
          >
            Build Your Own Website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AssemblyRenderer spec={spec!} activePage="/" previewMode themeOverride={activeTheme} />
      <BuiltWithBadge />
    </div>
  );
}

const SharedPreviewContentNoSSR = dynamic(
  () => Promise.resolve({ default: SharedPreviewContent }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-[#0a0b0f]">
        <Loader2 className="h-8 w-8 animate-spin text-[#e8a849]" />
      </div>
    ),
  }
);

export function SharedPreviewClient({ shareId }: { shareId: string }): React.ReactElement {
  return <SharedPreviewContentNoSSR shareId={shareId} />;
}

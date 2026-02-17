"use client";

import { use, useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
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
import { Loader2 } from "lucide-react";

function PublishedSiteContent({ projectId }: { projectId: string }): React.ReactElement {
  const project = useQuery(api.projects.getProject, {
    projectId: projectId as Id<"projects">,
  });

  const rawSpec = useQuery(
    api.siteSpecs.getSiteSpec,
    project?.sessionId ? { sessionId: project.sessionId } : "skip"
  );

  // Build spec with content overrides
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

    // Apply content overrides from project customization
    const cust = project?.customization as
      | { contentOverrides?: Record<number, Record<string, string>> }
      | undefined;
    if (cust?.contentOverrides) {
      const overrides = cust.contentOverrides;
      if (Object.keys(overrides).length > 0) {
        const cloned: SiteIntentDocument = structuredClone(base);
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
  }, [rawSpec, project]);

  // Build 5-layer theme
  const activeTheme = useMemo((): ThemeTokens | undefined => {
    if (!spec || !project) return undefined;

    const pv = spec.personalityVector as PersonalityVector;
    const cust = (project.customization ?? {}) as {
      activePresetId?: string | null;
      primaryColorOverride?: string | null;
      fontPairingId?: string | null;
      emotionalGoals?: string[] | null;
      antiReferences?: string[] | null;
    };

    // Layer 1: preset or AI-generated base
    let theme: ThemeTokens;
    if (cust.activePresetId) {
      const preset = getPresetById(cust.activePresetId);
      if (preset) {
        theme = preset.tokens;
      } else {
        const variants = generateThemeVariants(pv, {
          businessType: spec.siteType,
        });
        theme = variants.variantA;
      }
    } else {
      const variants = generateThemeVariants(pv, {
        businessType: spec.siteType,
      });
      theme = variants.variantA;
    }

    // Layer 2: emotional overrides
    const effectiveEmotionalGoals = cust.emotionalGoals ?? spec.emotionalGoals ?? [];
    const effectiveAntiRefs = cust.antiReferences ?? spec.antiReferences ?? [];
    if (effectiveEmotionalGoals.length > 0 || effectiveAntiRefs.length > 0) {
      theme = applyEmotionalOverrides(theme, effectiveEmotionalGoals, effectiveAntiRefs);
    }

    // Layer 3: primary color override
    if (cust.primaryColorOverride) {
      const colorTokens = deriveThemeFromPrimaryColor(cust.primaryColorOverride, pv, spec.siteType);
      theme = { ...theme, ...colorTokens };
    }

    // Layer 4: font pairing override
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
  }, [spec, project]);

  // Loading
  if (project === undefined || rawSpec === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Not found
  if (project === null || rawSpec === null || !spec) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-900">Site Not Found</h1>
          <p className="text-sm text-gray-500">This site may have been unpublished or removed.</p>
        </div>
      </div>
    );
  }

  // No platform chrome — clean, professional output
  return (
    <AssemblyRenderer spec={spec} activePage="/" previewMode={false} themeOverride={activeTheme} />
  );
}

const PublishedSiteNoSSR = dynamic(() => Promise.resolve({ default: PublishedSiteContent }), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

export default function PublishedSitePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): React.ReactElement {
  const { projectId } = use(params);
  return <PublishedSiteNoSSR projectId={projectId} />;
}

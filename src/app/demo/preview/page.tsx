"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AssemblyRenderer } from "@/lib/assembly";
import type { SiteIntentDocument } from "@/lib/assembly";
import type { ExportResult } from "@/lib/export/generate-project";
import { capturePreviewScreenshot } from "@/lib/screenshot";
import type { ScreenshotResult } from "@/lib/screenshot";
import { generateThemeVariants, applyEmotionalOverrides } from "@/lib/theme";
import type { PersonalityVector, ThemeTokens } from "@/lib/theme";
import { mapAdjustmentsToTokenOverrides } from "@/lib/vlm";
import { PreviewSidebar } from "@/components/platform/preview/PreviewSidebar";
import { PreviewToolbar } from "@/components/platform/preview/PreviewToolbar";
import { DevPanel } from "@/components/platform/preview/DevPanel";
import { FeedbackBanner } from "@/components/platform/preview/FeedbackBanner";
import { Loader2 } from "lucide-react";

const VIEWPORT_WIDTHS: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

function PreviewContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("/");
  const [isExporting, setIsExporting] = useState(false);
  const [activeVariant, setActiveVariant] = useState<"A" | "B">("A");
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastScreenshot, setLastScreenshot] = useState<ScreenshotResult | null>(null);

  // Dev panel: visible via ?dev=true, localStorage, or Ctrl+Shift+D
  const isDevParam = searchParams.get("dev") === "true";
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  useEffect(() => {
    if (isDevParam || localStorage.getItem("ewb-dev") === "true") {
      setDevPanelOpen(true);
    }
  }, [isDevParam]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setDevPanelOpen((prev) => {
          const next = !prev;
          if (next) {
            localStorage.setItem("ewb-dev", "true");
          } else {
            localStorage.removeItem("ewb-dev");
          }
          return next;
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const rawSpec = useQuery(api.siteSpecs.getSiteSpec, sessionId ? { sessionId } : "skip");

  const handleExport = useCallback(async (specToExport: SiteIntentDocument): Promise<void> => {
    setIsExporting(true);
    try {
      const [{ generateProject }, { createProjectZip, downloadBlob }] = await Promise.all([
        import("@/lib/export/generate-project"),
        import("@/lib/export/create-zip"),
      ]);
      const result: ExportResult = generateProject(specToExport);
      const blob = await createProjectZip(result);
      const filename = `${result.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-website.zip`;
      downloadBlob(blob, filename);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Loading
  if (rawSpec === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0b0f]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[var(--color-accent)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">Loading preview...</p>
        </div>
      </div>
    );
  }

  // No session param
  if (!sessionId) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0b0f]">
        <div className="max-w-md text-center">
          <p
            className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No Session Found
          </p>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            Complete the intake flow to generate a website preview.
          </p>
          <a
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-opacity hover:opacity-90"
          >
            Start Building
          </a>
        </div>
      </div>
    );
  }

  // Not found
  if (rawSpec === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0b0f]">
        <div className="max-w-md text-center">
          <p
            className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Preview Not Found
          </p>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            This session may have expired. Try generating a new preview.
          </p>
          <a
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-opacity hover:opacity-90"
          >
            Start Over
          </a>
        </div>
      </div>
    );
  }

  // Map Convex doc to SiteIntentDocument
  const spec: SiteIntentDocument = {
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

  return (
    <PreviewLayout
      spec={spec}
      viewport={viewport}
      setViewport={setViewport}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activePage={activePage}
      setActivePage={setActivePage}
      isExporting={isExporting}
      handleExport={handleExport}
      activeVariant={activeVariant}
      setActiveVariant={setActiveVariant}
      isCapturing={isCapturing}
      setIsCapturing={setIsCapturing}
      lastScreenshot={lastScreenshot}
      setLastScreenshot={setLastScreenshot}
      devPanelOpen={devPanelOpen}
      sessionId={sessionId}
    />
  );
}

function PreviewLayout({
  spec,
  viewport,
  setViewport,
  sidebarOpen,
  setSidebarOpen,
  activePage,
  setActivePage,
  isExporting,
  handleExport,
  activeVariant,
  setActiveVariant,
  isCapturing,
  setIsCapturing,
  lastScreenshot,
  setLastScreenshot,
  devPanelOpen,
  sessionId,
}: {
  spec: SiteIntentDocument;
  viewport: "desktop" | "tablet" | "mobile";
  setViewport: (v: "desktop" | "tablet" | "mobile") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  activePage: string;
  setActivePage: (v: string) => void;
  isExporting: boolean;
  handleExport: (spec: SiteIntentDocument) => Promise<void>;
  activeVariant: "A" | "B";
  setActiveVariant: (v: "A" | "B") => void;
  isCapturing: boolean;
  setIsCapturing: (v: boolean) => void;
  lastScreenshot: ScreenshotResult | null;
  setLastScreenshot: (v: ScreenshotResult | null) => void;
  devPanelOpen: boolean;
  sessionId: string | null;
}): React.ReactElement {
  const pv = spec.personalityVector as PersonalityVector;

  const themeVariants = useMemo(() => {
    const variants = generateThemeVariants(pv, { businessType: spec.siteType });
    if (spec.emotionalGoals?.length) {
      return {
        ...variants,
        variantA: applyEmotionalOverrides(
          variants.variantA,
          spec.emotionalGoals,
          spec.antiReferences || []
        ),
        variantB: applyEmotionalOverrides(
          variants.variantB,
          spec.emotionalGoals,
          spec.antiReferences || []
        ),
      };
    }
    return variants;
  }, [pv, spec.siteType, spec.emotionalGoals, spec.antiReferences]);

  const [vlmOverrides, setVlmOverrides] = useState<Partial<ThemeTokens> | null>(null);

  const activeTheme = useMemo(() => {
    const base = activeVariant === "A" ? themeVariants.variantA : themeVariants.variantB;
    return vlmOverrides ? { ...base, ...vlmOverrides } : base;
  }, [activeVariant, themeVariants, vlmOverrides]);

  const handleApplyAdjustments = useCallback((adjustments: Record<string, string>) => {
    const overrides = mapAdjustmentsToTokenOverrides(adjustments);
    setVlmOverrides(overrides);
  }, []);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = useCallback(async (): Promise<void> => {
    if (!previewRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const result = await capturePreviewScreenshot(previewRef.current);
      setLastScreenshot(result);
    } catch (err) {
      console.error("Screenshot capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, setIsCapturing, setLastScreenshot]);

  return (
    <div className="flex h-screen flex-col bg-[#0a0b0f]">
      {/* Toolbar */}
      <PreviewToolbar
        businessName={spec.businessName}
        viewport={viewport}
        onViewportChange={setViewport}
        onExport={() => handleExport(spec)}
        isExporting={isExporting}
        onScreenshot={() => void handleScreenshot()}
        isCapturing={isCapturing}
        activeVariant={activeVariant}
        onVariantChange={setActiveVariant}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <PreviewSidebar
            spec={spec}
            activePage={activePage}
            onPageChange={setActivePage}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Toggle sidebar button when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-r-lg border border-l-0 border-[var(--color-border)] bg-[var(--color-bg-card)] px-1.5 py-6 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            title="Show sidebar"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 1L9 6L4 11" />
            </svg>
          </button>
        )}

        {/* Main preview area */}
        <div className="flex flex-1 justify-center overflow-auto p-4">
          <div
            className="shadow-2xl transition-[width] duration-300"
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              maxWidth: "100%",
            }}
          >
            <div
              ref={previewRef}
              className="h-full overflow-auto rounded-lg border border-[rgba(255,255,255,0.06)]"
            >
              <AssemblyRenderer
                spec={spec}
                activePage={activePage}
                previewMode
                themeOverride={activeTheme}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dev Panel — bottom drawer */}
      {devPanelOpen && sessionId && (
        <DevPanel
          sessionId={sessionId}
          screenshotBase64={lastScreenshot?.base64}
          spec={spec}
          onApplyAdjustments={handleApplyAdjustments}
        />
      )}

      {/* Feedback Banner — floating bottom-right */}
      {sessionId && <FeedbackBanner sessionId={sessionId} />}
    </div>
  );
}

// Dynamically import PreviewContent with SSR disabled to avoid
// useQuery throwing during server render (no ConvexProvider on server)
const PreviewContentNoSSR = dynamic(() => Promise.resolve({ default: PreviewContent }), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-[#0a0b0f]">
      <Loader2 className="h-8 w-8 animate-spin text-[#e8a849]" />
    </div>
  ),
});

export default function DemoPreviewPage(): React.ReactElement {
  return <PreviewContentNoSSR />;
}

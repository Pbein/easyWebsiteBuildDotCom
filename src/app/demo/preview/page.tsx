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
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { useIntakeStore } from "@/lib/stores/intake-store";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Eye,
  Info,
  Palette,
  MoreHorizontal,
  Camera,
  Download,
  RotateCcw,
  Shuffle,
  Layers,
  Heart,
  Mic,
  Ban,
  X,
  FileText,
} from "lucide-react";

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

/* ────────────────────────────────────────────────────────────
 * Mobile-specific components
 * ──────────────────────────────────────────────────────────── */

type MobileTab = "preview" | "info" | "theme" | "actions";

const MOBILE_TABS: { id: MobileTab; icon: typeof Eye; label: string }[] = [
  { id: "preview", icon: Eye, label: "Preview" },
  { id: "info", icon: Info, label: "Info" },
  { id: "theme", icon: Palette, label: "Theme" },
  { id: "actions", icon: MoreHorizontal, label: "Actions" },
];

const PERSONALITY_LABELS = [
  { label: "Density", left: "Minimal", right: "Rich" },
  { label: "Tone", left: "Playful", right: "Serious" },
  { label: "Temp", left: "Warm", right: "Cool" },
  { label: "Weight", left: "Light", right: "Bold" },
  { label: "Era", left: "Classic", right: "Modern" },
  { label: "Energy", left: "Calm", right: "Dynamic" },
];

function MobileToolbar({
  businessName,
  onScreenshot,
  isCapturing,
}: {
  businessName: string;
  onScreenshot: () => void;
  isCapturing: boolean;
}): React.ReactElement {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[#0d0e14] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="truncate text-sm font-semibold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {businessName}
        </span>
        <span className="shrink-0 rounded-full bg-[#3ecfb4]/10 px-2 py-0.5 text-[10px] font-medium text-[#3ecfb4]">
          Preview
        </span>
      </div>
      <button
        onClick={onScreenshot}
        disabled={isCapturing}
        className="p-1.5 text-[#9496a8] transition-colors hover:text-white disabled:opacity-50"
        title="Screenshot"
      >
        <Camera className={`h-4 w-4 ${isCapturing ? "animate-pulse" : ""}`} />
      </button>
    </div>
  );
}

function MobileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}): React.ReactElement {
  return (
    <div className="flex h-14 shrink-0 items-center justify-around border-t border-[rgba(255,255,255,0.06)] bg-[#0d0e14]">
      {MOBILE_TABS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(activeTab === id && id !== "preview" ? "preview" : id)}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 text-[10px] font-medium transition-colors ${
            activeTab === id ? "text-[#e8a849]" : "text-[#6b6d80] active:text-white"
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}

function MobileBottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-10 bg-black/30" onClick={onClose} />
      {/* Sheet */}
      <div className="absolute right-0 bottom-0 left-0 z-20 flex max-h-[65vh] flex-col overflow-hidden rounded-t-2xl border-t border-[rgba(255,255,255,0.08)] bg-[#12131a] shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h3
            className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#6b6d80] transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </>
  );
}

function MobileSidebarContent({
  spec,
  activePage,
  onPageChange,
  theme,
}: {
  spec: SiteIntentDocument;
  activePage: string;
  onPageChange: (slug: string) => void;
  theme: ThemeTokens;
}): React.ReactElement {
  const activePageSpec = spec.pages.find((p) => p.slug === activePage) ?? spec.pages[0];

  return (
    <div className="space-y-5">
      {/* Business info */}
      <div>
        {spec.tagline && <p className="text-xs leading-relaxed text-[#9496a8]">{spec.tagline}</p>}
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-[#e8a849]/10 px-2 py-0.5 text-[10px] font-medium text-[#e8a849]">
            {spec.siteType}
          </span>
          <span className="rounded-full bg-[#3ecfb4]/10 px-2 py-0.5 text-[10px] font-medium text-[#3ecfb4]">
            {spec.conversionGoal}
          </span>
        </div>
      </div>

      {/* Pages */}
      {spec.pages.length > 1 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-[#9496a8]" />
            <span className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase">
              Pages
            </span>
          </div>
          <div className="flex gap-1.5">
            {spec.pages.map((page) => (
              <button
                key={page.slug}
                onClick={() => onPageChange(page.slug)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activePage === page.slug
                    ? "bg-[#e8a849]/10 text-[#e8a849]"
                    : "text-[#c0c1cc] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Theme colors */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-[#9496a8]" />
          <span className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase">
            Theme
          </span>
        </div>
        <div className="flex gap-2">
          {[
            { label: "Primary", color: theme.colorPrimary },
            { label: "Secondary", color: theme.colorSecondary },
            { label: "Accent", color: theme.colorAccent },
            { label: "Background", color: theme.colorBackground },
            { label: "Text", color: theme.colorText },
          ].map((swatch) => (
            <div key={swatch.label} className="text-center">
              <div
                className="mb-1 h-8 w-8 rounded-lg border border-[rgba(255,255,255,0.1)]"
                style={{ backgroundColor: swatch.color }}
              />
              <span className="text-[9px] text-[#9496a8]">{swatch.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 space-y-1 text-[10px] text-[#9496a8]">
          <p>Heading: {theme.fontHeading.split(",")[0].replace(/'/g, "")}</p>
          <p>Body: {theme.fontBody.split(",")[0].replace(/'/g, "")}</p>
        </div>
      </div>

      {/* Components */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-[#9496a8]" />
          <span className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase">
            Components ({activePageSpec?.components.length ?? 0})
          </span>
        </div>
        <div className="space-y-1">
          {activePageSpec?.components
            .sort((a, b) => a.order - b.order)
            .map((comp, i) => (
              <div
                key={`${comp.componentId}-${i}`}
                className="flex items-center justify-between rounded-md py-1 text-xs"
              >
                <span className="font-mono text-[#c0c1cc]">{comp.componentId}</span>
                <span className="text-[#9496a8]">{comp.variant}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Personality */}
      <div>
        <span className="mb-2 block text-xs font-semibold tracking-wider text-[#9496a8] uppercase">
          Personality
        </span>
        <div className="space-y-2">
          {PERSONALITY_LABELS.map((axis, i) => (
            <div key={axis.label}>
              <div className="mb-0.5 flex justify-between text-[10px] text-[#9496a8]">
                <span>{axis.left}</span>
                <span className="font-semibold text-[#c0c1cc]">{axis.label}</span>
                <span>{axis.right}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#e8a849] to-[#3ecfb4]"
                  style={{ width: `${(spec.personalityVector[i] ?? 0.5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emotional Goals */}
      {spec.emotionalGoals && spec.emotionalGoals.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-[#9496a8]" />
            <span className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase">
              Emotional Goals
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {spec.emotionalGoals.map((goal) => (
              <span
                key={goal}
                className="rounded-full bg-[#e8a849]/10 px-2.5 py-1 text-[10px] font-medium text-[#e8a849] capitalize"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Voice & Character */}
      {(spec.voiceProfile || spec.brandArchetype) && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Mic className="h-3.5 w-3.5 text-[#9496a8]" />
            <span className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase">
              Voice & Character
            </span>
          </div>
          <div className="space-y-2">
            {spec.voiceProfile && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9496a8]">Voice:</span>
                <span className="rounded-full bg-[#3ecfb4]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#3ecfb4] capitalize">
                  {spec.voiceProfile}
                </span>
              </div>
            )}
            {spec.brandArchetype && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9496a8]">Archetype:</span>
                <span className="rounded-full bg-[#c084fc]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#c084fc] capitalize">
                  {spec.brandArchetype}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anti-References */}
      {spec.antiReferences && spec.antiReferences.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Ban className="h-3.5 w-3.5 text-[#9496a8]" />
            <span className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase">
              Avoid
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {spec.antiReferences.map((ref) => (
              <span
                key={ref}
                className="rounded-full bg-red-500/8 px-2.5 py-1 text-[10px] font-medium text-red-400/70 capitalize"
              >
                NOT: {ref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Main Preview Layout
 * ──────────────────────────────────────────────────────────── */

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
  const isMobile = useIsMobile();
  const router = useRouter();
  const resetStore = useIntakeStore((s) => s.reset);
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
  const [mobileTab, setMobileTab] = useState<MobileTab>("preview");

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

  const handleStartOver = useCallback((): void => {
    resetStore();
    router.push("/demo");
  }, [resetStore, router]);

  /* ── Mobile layout ─────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="flex h-screen flex-col bg-[#0a0b0f]">
        {/* Slim toolbar */}
        <MobileToolbar
          businessName={spec.businessName}
          onScreenshot={() => void handleScreenshot()}
          isCapturing={isCapturing}
        />

        {/* Full-bleed preview + bottom sheets */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Preview area — full bleed, no padding */}
          <div className="flex-1 overflow-auto">
            <div ref={previewRef}>
              <AssemblyRenderer
                spec={spec}
                activePage={activePage}
                previewMode
                themeOverride={activeTheme}
              />
            </div>
          </div>

          {/* Info sheet */}
          {mobileTab === "info" && (
            <MobileBottomSheet title="Site Details" onClose={() => setMobileTab("preview")}>
              <MobileSidebarContent
                spec={spec}
                activePage={activePage}
                onPageChange={setActivePage}
                theme={activeTheme}
              />
            </MobileBottomSheet>
          )}

          {/* Theme sheet */}
          {mobileTab === "theme" && (
            <MobileBottomSheet title="Theme Variant" onClose={() => setMobileTab("preview")}>
              <div className="flex items-center justify-center gap-4 py-4">
                <Shuffle className="h-4 w-4 text-[#6b6d80]" />
                {(["A", "B"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVariant(v)}
                    className={`rounded-lg px-8 py-3 text-sm font-semibold transition-colors ${
                      activeVariant === v
                        ? "bg-[rgba(232,168,73,0.15)] text-[#e8a849]"
                        : "bg-[rgba(255,255,255,0.04)] text-[#9496a8]"
                    }`}
                  >
                    Variant {v}
                  </button>
                ))}
              </div>
            </MobileBottomSheet>
          )}

          {/* Actions sheet */}
          {mobileTab === "actions" && (
            <MobileBottomSheet title="Actions" onClose={() => setMobileTab("preview")}>
              <div className="flex flex-col gap-1 py-2">
                <button
                  onClick={() => void handleScreenshot()}
                  disabled={isCapturing}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c0c1cc] transition-colors active:bg-[rgba(255,255,255,0.04)] disabled:opacity-50"
                >
                  <Camera className="h-5 w-5 text-[#3ecfb4]" />
                  {isCapturing ? "Capturing..." : "Take Screenshot"}
                </button>
                <button
                  onClick={() => void handleExport(spec)}
                  disabled={isExporting}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c0c1cc] transition-colors active:bg-[rgba(255,255,255,0.04)] disabled:opacity-50"
                >
                  <Download className="h-5 w-5 text-[#3ecfb4]" />
                  {isExporting ? "Exporting..." : "Export as ZIP"}
                </button>
                <div className="my-1 border-t border-[rgba(255,255,255,0.06)]" />
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#9496a8] transition-colors active:bg-[rgba(255,255,255,0.04)]"
                >
                  <RotateCcw className="h-5 w-5" />
                  Start Over
                </button>
              </div>
            </MobileBottomSheet>
          )}
        </div>

        {/* Tab bar */}
        <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />

        {/* Feedback Banner — positioned above tab bar */}
        {sessionId && <FeedbackBanner sessionId={sessionId} isMobile />}
      </div>
    );
  }

  /* ── Desktop layout (unchanged) ────────────────────── */
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

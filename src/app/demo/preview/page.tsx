"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import posthog from "posthog-js";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { generateShareId } from "@/lib/share";
import { AssemblyRenderer } from "@/lib/assembly";
import type { SiteIntentDocument } from "@/lib/assembly";
import type { ExportResult } from "@/lib/export/generate-project";
import { capturePreviewScreenshot } from "@/lib/screenshot";
import type { ScreenshotResult } from "@/lib/screenshot";
import {
  generateThemeVariants,
  applyEmotionalOverrides,
  getPresetById,
  deriveThemeFromPrimaryColor,
  getFontPairingById,
  selectFontPairing,
  FREE_FONT_IDS,
  THEME_PRESETS,
} from "@/lib/theme";
import type { PersonalityVector, ThemeTokens } from "@/lib/theme";
import { mapAdjustmentsToTokenOverrides } from "@/lib/vlm";
import { getVoiceKeyedHeadline, getVoiceKeyedCtaText } from "@/lib/content";
import {
  EMOTIONAL_OUTCOMES,
  VOICE_TONE_CARDS,
  ANTI_REFERENCES,
  INDUSTRY_ANTI_REFERENCES,
} from "@/lib/types/brand-character";
import { CustomizationSidebar } from "@/components/platform/preview/CustomizationSidebar";
import { PreviewToolbar } from "@/components/platform/preview/PreviewToolbar";
import { DevPanel } from "@/components/platform/preview/DevPanel";
import { FeedbackBanner } from "@/components/platform/preview/FeedbackBanner";
import { DesignChat } from "@/components/platform/preview/DesignChat";
import { MakeItYoursModal } from "@/components/platform/preview/MakeItYoursModal";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { useIntakeStore } from "@/lib/stores/intake-store";
import { useCustomizationStore } from "@/lib/stores/customization-store";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
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
  Share2,
  Save,
  Check,
  Rocket,
  MessageSquare,
} from "lucide-react";

const VIEWPORT_WIDTHS: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

function PreviewContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const expressMode = useIntakeStore((s) => s.expressMode);
  const { plan, ownItPurchased } = useSubscription();

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(false); // starts closed for immersive reveal
  const [activePage, setActivePage] = useState("/");
  const [isExporting, setIsExporting] = useState(false);
  const [activeVariant, setActiveVariant] = useState<"A" | "B">("A");
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastScreenshot, setLastScreenshot] = useState<ScreenshotResult | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);
  const revealCompleted = useRef(false);

  // Design chat + pricing modal
  const [chatOpen, setChatOpen] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

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
  const hasTrackedPreviewViewed = useRef(false);

  // Track preview_viewed when spec is loaded
  useEffect(() => {
    if (rawSpec && !hasTrackedPreviewViewed.current) {
      hasTrackedPreviewViewed.current = true;
      posthog.capture("preview_viewed", {
        session_id: sessionId,
        site_type: rawSpec.siteType,
        business_name: rawSpec.businessName,
        method: rawSpec.metadata?.method || "unknown",
        component_count: rawSpec.pages?.[0]?.components?.length || 0,
        express_mode: expressMode,
      });
    }
  }, [rawSpec, sessionId, expressMode]);

  const handleExport = useCallback(
    async (specToExport: SiteIntentDocument, themeTokens?: ThemeTokens): Promise<void> => {
      setIsExporting(true);
      // Track export started
      posthog.capture("export_clicked", {
        session_id: sessionId,
        site_type: specToExport.siteType,
        business_name: specToExport.businessName,
      });
      try {
        const [{ generateProject }, { createProjectZip, downloadBlob }] = await Promise.all([
          import("@/lib/export/generate-project"),
          import("@/lib/export/create-zip"),
        ]);
        const isPaidExport = plan === "starter" || plan === "pro" || ownItPurchased;
        const result: ExportResult = generateProject(specToExport, {
          includeBadge: !isPaidExport,
          themeTokens,
        });
        const blob = await createProjectZip(result);
        const filename = `${result.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-website.zip`;
        downloadBlob(blob, filename);
        // Track export completed
        posthog.capture("export_completed", {
          session_id: sessionId,
          site_type: specToExport.siteType,
          business_name: specToExport.businessName,
          file_count: result.files.length,
          include_badge: !isPaidExport,
        });
      } catch (err) {
        posthog.capture("export_failed", {
          session_id: sessionId,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setIsExporting(false);
      }
    },
    [sessionId, plan, ownItPurchased]
  );

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
      shareUrl={shareUrl}
      setShareUrl={setShareUrl}
      isGeneratingShareLink={isGeneratingShareLink}
      setIsGeneratingShareLink={setIsGeneratingShareLink}
      isRevealing={isRevealing}
      setIsRevealing={setIsRevealing}
      revealCompleted={revealCompleted}
      expressMode={expressMode}
      chatOpen={chatOpen}
      setChatOpen={setChatOpen}
      showPricingModal={showPricingModal}
      setShowPricingModal={setShowPricingModal}
    />
  );
}

/* ────────────────────────────────────────────────────────────
 * Mobile-specific components
 * ──────────────────────────────────────────────────────────── */

type MobileTab = "preview" | "info" | "customize" | "actions";

const MOBILE_TABS: { id: MobileTab; icon: typeof Eye; label: string }[] = [
  { id: "preview", icon: Eye, label: "Preview" },
  { id: "info", icon: Info, label: "Info" },
  { id: "customize", icon: Palette, label: "Customize" },
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
  shareUrl,
  setShareUrl,
  isGeneratingShareLink,
  setIsGeneratingShareLink,
  isRevealing,
  setIsRevealing,
  revealCompleted,
  expressMode,
  chatOpen,
  setChatOpen,
  showPricingModal,
  setShowPricingModal,
}: {
  spec: SiteIntentDocument;
  viewport: "desktop" | "tablet" | "mobile";
  setViewport: (v: "desktop" | "tablet" | "mobile") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  activePage: string;
  setActivePage: (v: string) => void;
  isExporting: boolean;
  handleExport: (spec: SiteIntentDocument, themeTokens?: ThemeTokens) => Promise<void>;
  activeVariant: "A" | "B";
  setActiveVariant: (v: "A" | "B") => void;
  isCapturing: boolean;
  setIsCapturing: (v: boolean) => void;
  lastScreenshot: ScreenshotResult | null;
  setLastScreenshot: (v: ScreenshotResult | null) => void;
  devPanelOpen: boolean;
  sessionId: string | null;
  shareUrl: string | null;
  setShareUrl: (v: string | null) => void;
  isGeneratingShareLink: boolean;
  setIsGeneratingShareLink: (v: boolean) => void;
  isRevealing: boolean;
  setIsRevealing: (v: boolean) => void;
  revealCompleted: React.MutableRefObject<boolean>;
  expressMode: boolean;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  showPricingModal: boolean;
  setShowPricingModal: (v: boolean) => void;
}): React.ReactElement {
  const isMobile = useIsMobile();
  const router = useRouter();
  const resetStore = useIntakeStore((s) => s.reset);
  const pv = spec.personalityVector as PersonalityVector;
  const createShareLink = useMutation(api.sharedPreviews.createShareLink);
  const createProject = useMutation(api.projects.createProject);
  const existingProject = useQuery(
    api.projects.getProjectBySession,
    sessionId ? { sessionId } : "skip"
  );
  const { isSignedIn } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<Id<"projects"> | null>(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  // Track if project is already saved
  useEffect(() => {
    if (existingProject) {
      setSavedProjectId(existingProject._id);
    }
  }, [existingProject]);

  // Customization store
  const custStore = useCustomizationStore();
  const {
    activePresetId,
    primaryColorOverride,
    fontPairingId,
    contentOverrides,
    emotionalGoals: custEmotionalGoals,
    voiceProfile: custVoiceProfile,
    brandArchetype: custBrandArchetype,
    antiReferences: custAntiReferences,
    hasChanges: custHasChanges,
    initSession: custInitSession,
    setPreset: custSetPreset,
    setPrimaryColor: custSetPrimaryColor,
    setFontPairing: custSetFontPairing,
    setContentOverride: custSetContentOverride,
    setEmotionalGoals: custSetEmotionalGoals,
    setVoiceProfile: custSetVoiceProfile,
    setBrandArchetype: custSetBrandArchetype,
    setAntiReferences: custSetAntiReferences,
    resetAll: custResetAll,
  } = custStore;

  // Initialize customization store for this session
  useEffect(() => {
    if (sessionId) {
      custInitSession(sessionId);
    }
  }, [sessionId, custInitSession]);

  const handleSaveProject = useCallback(async (): Promise<void> => {
    if (!sessionId || isSaving || savedProjectId) return;
    setIsSaving(true);
    try {
      const id = await createProject({
        sessionId,
        name: spec.businessName,
        siteType: spec.siteType,
        tagline: spec.tagline || undefined,
        customization: custHasChanges
          ? {
              activePresetId: activePresetId ?? null,
              primaryColorOverride: primaryColorOverride ?? null,
              fontPairingId: fontPairingId ?? null,
              contentOverrides,
              emotionalGoals: custEmotionalGoals,
              voiceProfile: custVoiceProfile,
              brandArchetype: custBrandArchetype,
              antiReferences: custAntiReferences,
            }
          : undefined,
      });
      setSavedProjectId(id);
      setShowSavePrompt(false);
      posthog.capture("project_saved", {
        session_id: sessionId,
        site_type: spec.siteType,
        business_name: spec.businessName,
      });
    } catch (err) {
      posthog.capture("project_save_failed", {
        session_id: sessionId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    sessionId,
    isSaving,
    savedProjectId,
    createProject,
    spec,
    custHasChanges,
    activePresetId,
    primaryColorOverride,
    fontPairingId,
    contentOverrides,
    custEmotionalGoals,
    custVoiceProfile,
    custBrandArchetype,
    custAntiReferences,
  ]);

  // Detect AI-selected font pairing
  const aiFontPairingId = useMemo(
    () => selectFontPairing(pv, spec.siteType).id,
    [pv, spec.siteType]
  );

  // Clean base variants — emotional overrides applied as a separate layer
  const themeVariants = useMemo(() => {
    return generateThemeVariants(pv, { businessType: spec.siteType });
  }, [pv, spec.siteType]);

  // Resolved brand character: sidebar overrides → spec fallback → empty
  const effectiveEmotionalGoals = useMemo(
    () => custEmotionalGoals ?? spec.emotionalGoals ?? [],
    [custEmotionalGoals, spec.emotionalGoals]
  );
  const effectiveAntiRefs = useMemo(
    () => custAntiReferences ?? spec.antiReferences ?? [],
    [custAntiReferences, spec.antiReferences]
  );
  const effectiveVoiceProfile = custVoiceProfile ?? spec.voiceProfile ?? null;
  const effectiveBrandArchetype = custBrandArchetype ?? spec.brandArchetype ?? null;

  const [vlmOverrides, setVlmOverrides] = useState<Partial<ThemeTokens> | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("preview");
  const prevVariantRef = useRef(activeVariant);
  const hasTrackedCustomization = useRef(false);

  // Immersive reveal: auto-dismiss after 3 seconds, then show controls
  useEffect(() => {
    if (!isRevealing || revealCompleted.current) {
      if (!isRevealing && !sidebarOpen && !isMobile) {
        setSidebarOpen(true);
      }
      return;
    }
    const timer = setTimeout(() => {
      revealCompleted.current = true;
      setIsRevealing(false);
      if (!isMobile) {
        setSidebarOpen(true);
      }
      posthog.capture("reveal_completed", {
        session_id: sessionId,
        skipped: false,
      });
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealing]);

  const skipReveal = useCallback((): void => {
    if (!isRevealing) return;
    revealCompleted.current = true;
    setIsRevealing(false);
    if (!isMobile) {
      setSidebarOpen(true);
    }
    posthog.capture("reveal_completed", {
      session_id: sessionId,
      skipped: true,
    });
  }, [isRevealing, setIsRevealing, setSidebarOpen, isMobile, sessionId, revealCompleted]);

  // Track theme variant switches (not on initial mount)
  useEffect(() => {
    if (prevVariantRef.current !== activeVariant) {
      posthog.capture("theme_variant_switched", {
        session_id: sessionId,
        from_variant: prevVariantRef.current,
        to_variant: activeVariant,
      });
      prevVariantRef.current = activeVariant;
    }
  }, [activeVariant, sessionId]);

  // Track customization_started once (when user first changes something)
  useEffect(() => {
    if (custHasChanges && !hasTrackedCustomization.current) {
      hasTrackedCustomization.current = true;
      posthog.capture("customization_started", { session_id: sessionId });
    }
  }, [custHasChanges, sessionId]);

  /**
   * 5-layer theme priority:
   *   Layer 1: base variant (A/B) OR preset tokens
   *   Layer 2: + VLM overrides
   *   Layer 3: + emotional overrides (from sidebar or spec)
   *   Layer 4: + primary color override (derive full palette)
   *   Layer 5: + font pairing override
   */
  const activeTheme = useMemo(() => {
    // Layer 1: base or preset
    let theme: ThemeTokens;
    if (activePresetId) {
      const preset = getPresetById(activePresetId);
      theme = preset
        ? preset.tokens
        : activeVariant === "A"
          ? themeVariants.variantA
          : themeVariants.variantB;
    } else {
      theme = activeVariant === "A" ? themeVariants.variantA : themeVariants.variantB;
    }

    // Layer 2: VLM overrides
    if (vlmOverrides) {
      theme = { ...theme, ...vlmOverrides };
    }

    // Layer 3: emotional overrides
    if (effectiveEmotionalGoals.length > 0 || effectiveAntiRefs.length > 0) {
      theme = applyEmotionalOverrides(theme, effectiveEmotionalGoals, effectiveAntiRefs);
    }

    // Layer 4: primary color override
    if (primaryColorOverride) {
      const colorTokens = deriveThemeFromPrimaryColor(primaryColorOverride, pv, spec.siteType);
      theme = { ...theme, ...colorTokens };
    }

    // Layer 5: font pairing override
    if (fontPairingId) {
      const pairing = getFontPairingById(fontPairingId);
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
  }, [
    activeVariant,
    themeVariants,
    vlmOverrides,
    effectiveEmotionalGoals,
    effectiveAntiRefs,
    activePresetId,
    primaryColorOverride,
    fontPairingId,
    pv,
    spec.siteType,
  ]);

  // Apply content overrides for mobile direct-render path
  const mobileEffectiveSpec = useMemo((): SiteIntentDocument => {
    if (Object.keys(contentOverrides).length === 0) return spec;
    const cloned: SiteIntentDocument = JSON.parse(JSON.stringify(spec));
    for (const page of cloned.pages) {
      const sorted = [...page.components].sort((a, b) => a.order - b.order);
      for (const [indexStr, fields] of Object.entries(contentOverrides)) {
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
  }, [spec, contentOverrides]);

  const handleApplyAdjustments = useCallback((adjustments: Record<string, string>) => {
    const overrides = mapAdjustmentsToTokenOverrides(adjustments);
    setVlmOverrides(overrides);
  }, []);

  const previewRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeReadyRef = useRef(false);
  const pendingMessagesRef = useRef<unknown[]>([]);
  const screenshotResolveRef = useRef<{
    resolve: (result: ScreenshotResult) => void;
    reject: (err: Error) => void;
  } | null>(null);

  const postToIframe = useCallback((message: unknown): void => {
    if (iframeReadyRef.current && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, window.location.origin);
    } else {
      pendingMessagesRef.current.push(message);
    }
  }, []);

  // Listen for messages from iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent): void {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data.type !== "string" || !data.type.startsWith("ewb:")) return;

      switch (data.type) {
        case "ewb:render-ready": {
          iframeReadyRef.current = true;
          // Flush pending messages
          const pending = pendingMessagesRef.current.splice(0);
          for (const msg of pending) {
            iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin);
          }
          break;
        }
        case "ewb:screenshot-result": {
          if (screenshotResolveRef.current) {
            screenshotResolveRef.current.resolve(data.result as ScreenshotResult);
            screenshotResolveRef.current = null;
          }
          break;
        }
        case "ewb:screenshot-error": {
          if (screenshotResolveRef.current) {
            screenshotResolveRef.current.reject(new Error(data.error as string));
            screenshotResolveRef.current = null;
          }
          break;
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Sync activeTheme to iframe whenever it changes
  useEffect(() => {
    if (!isMobile) {
      postToIframe({ type: "ewb:set-theme", theme: activeTheme });
    }
  }, [activeTheme, isMobile, postToIframe]);

  // Sync activePage to iframe whenever it changes
  useEffect(() => {
    if (!isMobile) {
      postToIframe({ type: "ewb:set-page", activePage });
    }
  }, [activePage, isMobile, postToIframe]);

  // Sync content overrides to iframe
  useEffect(() => {
    if (!isMobile) {
      if (Object.keys(contentOverrides).length > 0) {
        postToIframe({ type: "ewb:update-content", overrides: contentOverrides });
      } else {
        postToIframe({ type: "ewb:reset-content" });
      }
    }
  }, [contentOverrides, isMobile, postToIframe]);

  // Reset iframe ready state when sessionId changes
  useEffect(() => {
    iframeReadyRef.current = false;
    pendingMessagesRef.current = [];
  }, [sessionId]);

  const handleScreenshot = useCallback(async (): Promise<void> => {
    if (isCapturing) return;

    // Mobile path: direct DOM capture
    if (isMobile) {
      if (!previewRef.current) return;
      setIsCapturing(true);
      try {
        const result = await capturePreviewScreenshot(previewRef.current);
        setLastScreenshot(result);
        // Track screenshot captured
        posthog.capture("screenshot_captured", {
          session_id: sessionId,
          viewport: "mobile",
          width: result.width,
          height: result.height,
        });
      } catch (err) {
        posthog.capture("screenshot_capture_failed", {
          session_id: sessionId,
          viewport: "mobile",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setIsCapturing(false);
      }
      return;
    }

    // Desktop path: capture via iframe postMessage
    setIsCapturing(true);
    const requestId = `screenshot-${Date.now()}`;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await Promise.race([
        new Promise<ScreenshotResult>((resolve, reject) => {
          screenshotResolveRef.current = { resolve, reject };
          postToIframe({ type: "ewb:request-screenshot", requestId });
        }),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Screenshot timeout (10s)")), 10000);
        }),
      ]);
      setLastScreenshot(result);
      // Track screenshot captured
      posthog.capture("screenshot_captured", {
        session_id: sessionId,
        viewport,
        width: result.width,
        height: result.height,
      });
    } catch (err) {
      posthog.capture("screenshot_capture_failed", {
        session_id: sessionId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      screenshotResolveRef.current = null;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsCapturing(false);
    }
  }, [isCapturing, setIsCapturing, setLastScreenshot, isMobile, postToIframe, sessionId, viewport]);

  const handleShare = useCallback(async (): Promise<void> => {
    if (isGeneratingShareLink || !sessionId) return;
    setIsGeneratingShareLink(true);
    try {
      const shareId = generateShareId();
      await createShareLink({
        shareId,
        sessionId,
        customization: {
          activePresetId: activePresetId ?? null,
          primaryColorOverride: primaryColorOverride ?? null,
          fontPairingId: fontPairingId ?? null,
          contentOverrides: contentOverrides,
          emotionalGoals: custEmotionalGoals,
          voiceProfile: custVoiceProfile,
          brandArchetype: custBrandArchetype,
          antiReferences: custAntiReferences,
        },
        businessName: spec.businessName,
        tagline: spec.tagline || undefined,
        siteType: spec.siteType,
        primaryColor: primaryColorOverride ?? activeTheme.colorPrimary,
      });

      const url = `${window.location.origin}/s/${shareId}`;
      setShareUrl(url);

      posthog.capture("share_link_generated", {
        session_id: sessionId,
        share_id: shareId,
        site_type: spec.siteType,
        business_name: spec.businessName,
        has_customization: custHasChanges,
      });

      // Use Web Share API on mobile if available
      if (isMobile && navigator.share) {
        try {
          await navigator.share({
            title: `${spec.businessName} — Website Preview`,
            url,
          });
        } catch {
          // User cancelled share — that's fine
        }
      }
    } catch (err) {
      posthog.capture("share_link_failed", {
        session_id: sessionId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsGeneratingShareLink(false);
    }
  }, [
    isGeneratingShareLink,
    sessionId,
    createShareLink,
    activePresetId,
    primaryColorOverride,
    fontPairingId,
    contentOverrides,
    custEmotionalGoals,
    custVoiceProfile,
    custBrandArchetype,
    custAntiReferences,
    spec,
    activeTheme,
    custHasChanges,
    isMobile,
    setShareUrl,
    setIsGeneratingShareLink,
  ]);

  const handleShareModalClose = useCallback((): void => {
    setShareUrl(null);
  }, [setShareUrl]);

  const handleStartOver = useCallback((): void => {
    custResetAll();
    resetStore();
    router.push("/demo");
  }, [custResetAll, resetStore, router]);

  // Customization sidebar callbacks
  const handlePresetChange = useCallback(
    (presetId: string | null): void => {
      custSetPreset(presetId);
      posthog.capture("preset_changed", { session_id: sessionId, preset_id: presetId });
    },
    [custSetPreset, sessionId]
  );

  const handleColorChange = useCallback(
    (hex: string | null): void => {
      custSetPrimaryColor(hex);
      if (hex) {
        posthog.capture("color_changed", { session_id: sessionId, color: hex });
      }
    },
    [custSetPrimaryColor, sessionId]
  );

  const handleFontChange = useCallback(
    (id: string | null): void => {
      const pairing = id ? getFontPairingById(id) : null;
      const isFree = id ? FREE_FONT_IDS.has(id) || id === aiFontPairingId : true;
      if (id && !isFree) {
        posthog.capture("gate_clicked", { session_id: sessionId, font_id: id });
        return;
      }
      custSetFontPairing(id);
      posthog.capture("font_changed", {
        session_id: sessionId,
        font_id: id,
        font_name: pairing?.displayName,
      });
    },
    [custSetFontPairing, aiFontPairingId, sessionId]
  );

  const handleContentChange = useCallback(
    (componentIndex: number, field: string, value: string): void => {
      custSetContentOverride(componentIndex, field, value);
      posthog.capture("headline_edited", {
        session_id: sessionId,
        component_index: componentIndex,
        field,
      });
    },
    [custSetContentOverride, sessionId]
  );

  const handleResetCustomization = useCallback((): void => {
    custResetAll();
    // Reset content in iframe
    postToIframe({ type: "ewb:reset-content" });
    posthog.capture("reset_to_original", { session_id: sessionId });
  }, [custResetAll, postToIframe, sessionId]);

  // Brand discovery callbacks
  const handleEmotionChange = useCallback(
    (goals: string[]): void => {
      custSetEmotionalGoals(goals.length > 0 ? goals : null);
      posthog.capture("brand_emotion_changed", {
        session_id: sessionId,
        emotions: goals,
        source: "sidebar",
      });
    },
    [custSetEmotionalGoals, sessionId]
  );

  const handleVoiceChange = useCallback(
    (voice: string | null): void => {
      custSetVoiceProfile(voice);
      posthog.capture("brand_voice_changed", {
        session_id: sessionId,
        voice,
        source: "sidebar",
      });
    },
    [custSetVoiceProfile, sessionId]
  );

  const handleArchetypeChange = useCallback(
    (archetype: string | null): void => {
      custSetBrandArchetype(archetype);
      posthog.capture("brand_archetype_changed", {
        session_id: sessionId,
        archetype,
        source: "sidebar",
      });
    },
    [custSetBrandArchetype, sessionId]
  );

  const handleAntiRefChange = useCallback(
    (refs: string[]): void => {
      custSetAntiReferences(refs.length > 0 ? refs : null);
      posthog.capture("brand_antiref_changed", {
        session_id: sessionId,
        anti_refs: refs,
        source: "sidebar",
      });
    },
    [custSetAntiReferences, sessionId]
  );

  // Voice-keyed content: auto-update hero + CTA headlines when voice changes
  useEffect(() => {
    if (!effectiveVoiceProfile) return;
    const pageSpec = spec.pages.find((p) => p.slug === activePage) ?? spec.pages[0];
    if (!pageSpec) return;
    const sorted = [...pageSpec.components].sort((a, b) => a.order - b.order);

    const heroIdx = sorted.findIndex((c) => c.componentId.startsWith("hero-"));
    if (heroIdx >= 0) {
      const headline = getVoiceKeyedHeadline(
        spec.businessName,
        spec.siteType,
        effectiveVoiceProfile as "warm" | "polished" | "direct"
      );
      custSetContentOverride(heroIdx, "headline", headline);
    }

    const ctaIdx = sorted.findIndex((c) => c.componentId === "cta-banner");
    if (ctaIdx >= 0) {
      const ctaText = getVoiceKeyedCtaText(
        spec.conversionGoal,
        effectiveVoiceProfile as "warm" | "polished" | "direct",
        effectiveAntiRefs
      );
      custSetContentOverride(ctaIdx, "headline", ctaText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveVoiceProfile, effectiveAntiRefs, spec, activePage]);

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
          <div className="flex-1 overflow-auto" onClick={isRevealing ? skipReveal : undefined}>
            <div ref={previewRef}>
              <AssemblyRenderer
                spec={mobileEffectiveSpec}
                activePage={activePage}
                previewMode
                themeOverride={activeTheme}
              />
            </div>
          </div>

          {/* Immersive reveal overlay — mobile */}
          <AnimatePresence>
            {isRevealing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-2xl bg-black/60 px-8 py-5 text-center backdrop-blur-md"
                >
                  <p
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Your website is ready
                  </p>
                  <p className="mt-1 text-xs text-white/60">Tap anywhere to explore</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info sheet */}
          {!isRevealing && mobileTab === "info" && (
            <MobileBottomSheet title="Site Details" onClose={() => setMobileTab("preview")}>
              <MobileSidebarContent
                spec={spec}
                activePage={activePage}
                onPageChange={setActivePage}
                theme={activeTheme}
              />
            </MobileBottomSheet>
          )}

          {/* Customize sheet */}
          {!isRevealing && mobileTab === "customize" && (
            <MobileBottomSheet title="Customize" onClose={() => setMobileTab("preview")}>
              <div className="space-y-5">
                {/* A/B Variant toggle */}
                <div>
                  <span className="mb-2 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
                    Theme Variant
                  </span>
                  <div className="flex items-center gap-3">
                    <Shuffle className="h-4 w-4 text-[#6b6d80]" />
                    {(["A", "B"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setActiveVariant(v)}
                        className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
                          activeVariant === v
                            ? "bg-[rgba(232,168,73,0.15)] text-[#e8a849]"
                            : "bg-[rgba(255,255,255,0.04)] text-[#9496a8]"
                        }`}
                      >
                        Variant {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset pills (horizontal scroll) */}
                <div>
                  <span className="mb-2 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
                    Preset
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                      onClick={() => handlePresetChange(null)}
                      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                        activePresetId === null
                          ? "border-[#e8a849]/40 bg-[#e8a849]/10 text-[#e8a849]"
                          : "border-[rgba(255,255,255,0.08)] text-[#9496a8]"
                      }`}
                    >
                      AI Original
                    </button>
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetChange(preset.id)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                          activePresetId === preset.id
                            ? "border-[#e8a849]/40 bg-[#e8a849]/10 text-[#e8a849]"
                            : "border-[rgba(255,255,255,0.08)] text-[#9496a8]"
                        }`}
                      >
                        <div
                          className="h-3 w-3 rounded-full border border-[rgba(255,255,255,0.1)]"
                          style={{ backgroundColor: preset.tokens.colorPrimary }}
                        />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color picker row */}
                <div>
                  <span className="mb-2 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
                    Primary Color
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="h-9 w-9 rounded-lg border-2 border-[rgba(255,255,255,0.12)]"
                        style={{
                          backgroundColor: primaryColorOverride ?? activeTheme.colorPrimary,
                        }}
                      />
                      <input
                        type="color"
                        value={primaryColorOverride ?? activeTheme.colorPrimary}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>
                    <span className="font-mono text-xs text-[#9496a8]">
                      {primaryColorOverride ?? activeTheme.colorPrimary}
                    </span>
                  </div>
                </div>

                {/* Brand character — emotion pills */}
                <div>
                  <span className="mb-2 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
                    Emotion
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {EMOTIONAL_OUTCOMES.map((e) => {
                      const isActive = effectiveEmotionalGoals.includes(e.id);
                      return (
                        <button
                          key={e.id}
                          onClick={() => {
                            const next = isActive
                              ? effectiveEmotionalGoals.filter((g) => g !== e.id)
                              : effectiveEmotionalGoals.length < 2
                                ? [...effectiveEmotionalGoals, e.id]
                                : [effectiveEmotionalGoals[1], e.id];
                            handleEmotionChange(next);
                          }}
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                            isActive
                              ? "border-[#e8a849]/40 bg-[#e8a849]/10 text-[#e8a849]"
                              : "border-[rgba(255,255,255,0.08)] text-[#9496a8]"
                          }`}
                        >
                          {e.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Voice tone pills */}
                <div>
                  <span className="mb-2 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
                    Voice
                  </span>
                  <div className="flex gap-2">
                    {VOICE_TONE_CARDS.map((v) => {
                      const isActive = effectiveVoiceProfile === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleVoiceChange(isActive ? null : v.id)}
                          className={`flex-1 rounded-lg border px-3 py-2 text-center text-[11px] font-medium transition-colors ${
                            isActive
                              ? "border-[#e8a849]/40 bg-[#e8a849]/10 text-[#e8a849]"
                              : "border-[rgba(255,255,255,0.08)] text-[#9496a8]"
                          }`}
                        >
                          {v.label.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Anti-reference pills */}
                <div>
                  <span className="mb-2 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
                    Avoid
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[...ANTI_REFERENCES, ...(INDUSTRY_ANTI_REFERENCES[spec.siteType] ?? [])].map(
                      (ref) => {
                        const isActive = effectiveAntiRefs.includes(ref.id);
                        return (
                          <button
                            key={ref.id}
                            onClick={() => {
                              const next = isActive
                                ? effectiveAntiRefs.filter((r) => r !== ref.id)
                                : [...effectiveAntiRefs, ref.id];
                              handleAntiRefChange(next);
                            }}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                              isActive
                                ? "border-red-500/30 bg-red-500/8 text-red-400/80"
                                : "border-[rgba(255,255,255,0.08)] text-[#6b6d80]"
                            }`}
                          >
                            {ref.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Reset button */}
                {custHasChanges && (
                  <button
                    onClick={handleResetCustomization}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2.5 text-xs font-medium text-[#c0c1cc] transition-colors hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset to AI Original
                  </button>
                )}
              </div>
            </MobileBottomSheet>
          )}

          {/* Actions sheet */}
          {!isRevealing && mobileTab === "actions" && (
            <MobileBottomSheet title="Actions" onClose={() => setMobileTab("preview")}>
              <div className="flex flex-col gap-1 py-2">
                {/* Save project */}
                {!savedProjectId && (
                  <button
                    onClick={() => {
                      if (isSignedIn) {
                        void handleSaveProject();
                      } else {
                        setShowSavePrompt(true);
                      }
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c0c1cc] transition-colors active:bg-[rgba(255,255,255,0.04)] disabled:opacity-50"
                  >
                    <Save className="h-5 w-5 text-[#e8a849]" />
                    {isSaving ? "Saving..." : "Save to My Projects"}
                  </button>
                )}
                {savedProjectId && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#3ecfb4]"
                  >
                    <Check className="h-5 w-5" />
                    Saved — View in Dashboard
                  </Link>
                )}
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c0c1cc] transition-colors active:bg-[rgba(255,255,255,0.04)]"
                >
                  <Rocket className="h-5 w-5 text-[#3ecfb4]" />
                  Publish with Custom Domain
                </button>
                <button
                  onClick={() => void handleShare()}
                  disabled={isGeneratingShareLink}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c0c1cc] transition-colors active:bg-[rgba(255,255,255,0.04)] disabled:opacity-50"
                >
                  <Share2 className="h-5 w-5 text-[#e8a849]" />
                  {isGeneratingShareLink ? "Generating link..." : "Share Preview"}
                </button>
                <button
                  onClick={() => void handleScreenshot()}
                  disabled={isCapturing}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#c0c1cc] transition-colors active:bg-[rgba(255,255,255,0.04)] disabled:opacity-50"
                >
                  <Camera className="h-5 w-5 text-[#3ecfb4]" />
                  {isCapturing ? "Capturing..." : "Take Screenshot"}
                </button>
                <button
                  onClick={() => void handleExport(mobileEffectiveSpec, activeTheme)}
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

        {/* Tab bar — fades in after reveal */}
        <AnimatePresence>
          {!isRevealing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Banner — positioned above tab bar */}
        {sessionId && !isRevealing && <FeedbackBanner sessionId={sessionId} isMobile />}
      </div>
    );
  }

  /* ── Desktop layout ────────────────────────────────── */
  return (
    <div className="flex h-screen flex-col bg-[#0a0b0f]">
      {/* Toolbar — minimal during reveal, full after */}
      {isRevealing ? (
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[#0d0e14] px-4">
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {spec.businessName}
            </span>
            <span className="rounded-full bg-[#3ecfb4]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#3ecfb4]">
              Preview
            </span>
          </div>
        </div>
      ) : (
        <PreviewToolbar
          businessName={spec.businessName}
          viewport={viewport}
          onViewportChange={setViewport}
          onExport={() => handleExport(mobileEffectiveSpec, activeTheme)}
          isExporting={isExporting}
          onScreenshot={() => void handleScreenshot()}
          isCapturing={isCapturing}
          activeVariant={activeVariant}
          onVariantChange={setActiveVariant}
          activePresetName={activePresetId ? getPresetById(activePresetId)?.name : null}
          onShare={() => void handleShare()}
          isGeneratingShareLink={isGeneratingShareLink}
          shareUrl={shareUrl}
          onShareModalClose={handleShareModalClose}
        />
      )}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Customization Sidebar — hidden during reveal */}
        {!isRevealing && sidebarOpen && (
          <CustomizationSidebar
            spec={spec}
            activeTheme={activeTheme}
            activePresetId={activePresetId}
            primaryColorOverride={primaryColorOverride}
            fontPairingId={fontPairingId}
            aiFontPairingId={aiFontPairingId}
            hasChanges={custHasChanges}
            activePage={activePage}
            onPageChange={setActivePage}
            onPresetChange={handlePresetChange}
            onColorChange={handleColorChange}
            onFontChange={handleFontChange}
            onContentChange={handleContentChange}
            onReset={handleResetCustomization}
            onClose={() => setSidebarOpen(false)}
            emotionalGoals={effectiveEmotionalGoals}
            voiceProfile={effectiveVoiceProfile}
            brandArchetype={effectiveBrandArchetype}
            antiReferences={effectiveAntiRefs}
            siteType={spec.siteType}
            expressMode={expressMode}
            onEmotionChange={handleEmotionChange}
            onVoiceChange={handleVoiceChange}
            onArchetypeChange={handleArchetypeChange}
            onAntiRefChange={handleAntiRefChange}
          />
        )}

        {/* Toggle sidebar button when closed (after reveal) */}
        {!isRevealing && !sidebarOpen && (
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

        {/* Main preview area — iframe for real responsive breakpoints */}
        <div
          className="flex flex-1 justify-center overflow-auto p-4"
          onClick={isRevealing ? skipReveal : undefined}
        >
          <div
            className="shadow-2xl transition-[width] duration-300"
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              maxWidth: "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`/demo/preview/render?session=${encodeURIComponent(sessionId ?? "")}`}
              className="h-full w-full rounded-lg border border-[rgba(255,255,255,0.06)]"
              style={{ minHeight: "100vh" }}
              title={`${spec.businessName} Preview`}
            />
          </div>
        </div>

        {/* Immersive reveal overlay — desktop */}
        <AnimatePresence>
          {isRevealing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl bg-black/50 px-10 py-6 text-center backdrop-blur-lg"
              >
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your website is ready
                </p>
                <p className="mt-2 text-sm text-white/50">Click anywhere to customize</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Project floating prompt — shows after reveal, before save */}
      <AnimatePresence>
        {!isRevealing && !savedProjectId && !showSavePrompt && existingProject === null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2"
          >
            <button
              onClick={() => {
                if (isSignedIn) {
                  void handleSaveProject();
                } else {
                  setShowSavePrompt(true);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-accent)] bg-[var(--color-bg-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-xl transition-all hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-glow)]"
            >
              <Save className="h-4 w-4 text-[var(--color-accent)]" />
              Save to My Projects
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save confirmation badge — shows after successful save */}
      <AnimatePresence>
        {savedProjectId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#3ecfb4]/15 px-4 py-2 text-sm font-medium text-[#3ecfb4]">
              <Check className="h-4 w-4" />
              Saved!
              <Link
                href="/dashboard"
                className="ml-1 underline underline-offset-2 hover:no-underline"
              >
                View in Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign-in prompt for save */}
      <AnimatePresence>
        {showSavePrompt && !isSignedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSavePrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl"
            >
              <h3
                className="mb-2 text-lg font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Sign in to save
              </h3>
              <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
                Create a free account to save your website and return to edit it anytime.
              </p>
              <div className="flex gap-3">
                <SignInButton mode="modal">
                  <button className="flex-1 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform hover:scale-[1.02]">
                    Sign In
                  </button>
                </SignInButton>
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish + AI Chat action buttons — floating bottom-left on desktop */}
      {!isMobile && !isRevealing && (
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setShowPricingModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#3ecfb4]/30 bg-[var(--color-bg-elevated)] px-4 py-2 text-xs font-semibold text-[#3ecfb4] shadow-lg transition-all hover:border-[#3ecfb4]/60 hover:shadow-xl"
          >
            <Rocket className="h-3.5 w-3.5" />
            Publish
          </button>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-lg transition-all hover:shadow-xl ${
              chatOpen
                ? "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            AI Chat
          </button>
        </div>
      )}

      {/* Design Chat panel — slides in from right */}
      {chatOpen && sessionId && (
        <DesignChat
          spec={spec}
          sessionId={sessionId}
          onApplyPatches={() => {
            // Patches apply via spec updates — placeholder for now
          }}
          onClose={() => setChatOpen(false)}
        />
      )}

      {/* Pricing / upgrade modal */}
      <MakeItYoursModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        projectId={savedProjectId ?? undefined}
      />

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
      {sessionId && !isRevealing && <FeedbackBanner sessionId={sessionId} />}
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

"use client";

import { useMemo } from "react";
import { X, FileText, Layers, Palette, RotateCcw, Heart, Mic, Ban } from "lucide-react";
import type { SiteIntentDocument } from "@/lib/assembly";
import { generateThemeFromVector } from "@/lib/theme";
import type { PersonalityVector } from "@/lib/theme";
import { useIntakeStore } from "@/lib/stores/intake-store";
import { useRouter } from "next/navigation";

interface PreviewSidebarProps {
  spec: SiteIntentDocument;
  activePage: string;
  onPageChange: (slug: string) => void;
  onClose: () => void;
}

const PERSONALITY_LABELS = [
  { label: "Density", left: "Minimal", right: "Rich" },
  { label: "Tone", left: "Playful", right: "Serious" },
  { label: "Temp", left: "Warm", right: "Cool" },
  { label: "Weight", left: "Light", right: "Bold" },
  { label: "Era", left: "Classic", right: "Modern" },
  { label: "Energy", left: "Calm", right: "Dynamic" },
];

export function PreviewSidebar({
  spec,
  activePage,
  onPageChange,
  onClose,
}: PreviewSidebarProps): React.ReactElement {
  const router = useRouter();
  const resetStore = useIntakeStore((s) => s.reset);

  const theme = useMemo(
    () => generateThemeFromVector(spec.personalityVector as PersonalityVector),
    [spec.personalityVector]
  );

  const activePageSpec = spec.pages.find((p) => p.slug === activePage) ?? spec.pages[0];

  return (
    <div className="flex w-80 shrink-0 flex-col overflow-y-auto border-r border-[rgba(255,255,255,0.06)] bg-[#0d0e14]">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2
            className="truncate text-sm font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {spec.businessName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#9496a8] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
            title="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
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
      <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-[#9496a8]" />
          <span
            className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pages
          </span>
        </div>
        <div className="space-y-1">
          {spec.pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => onPageChange(page.slug)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                activePage === page.slug
                  ? "bg-[#e8a849]/10 text-[#e8a849]"
                  : "text-[#c0c1cc] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
              }`}
            >
              {page.title}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Colors */}
      <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-[#9496a8]" />
          <span
            className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Theme
          </span>
        </div>
        <div className="mb-3 flex gap-2">
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
                title={`${swatch.label}: ${swatch.color}`}
              />
              <span className="text-[9px] text-[#9496a8]">{swatch.label}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1 text-[10px] text-[#9496a8]">
          <p>Heading: {theme.fontHeading.split(",")[0].replace(/'/g, "")}</p>
          <p>Body: {theme.fontBody.split(",")[0].replace(/'/g, "")}</p>
        </div>
      </div>

      {/* Components */}
      <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-[#9496a8]" />
          <span
            className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Components ({activePageSpec?.components.length ?? 0})
          </span>
        </div>
        <div className="space-y-1">
          {activePageSpec?.components
            .sort((a, b) => a.order - b.order)
            .map((comp, i) => (
              <div
                key={`${comp.componentId}-${i}`}
                className="flex items-center justify-between rounded-md px-3 py-1.5 text-xs"
              >
                <span className="font-mono text-[#c0c1cc]">{comp.componentId}</span>
                <span className="text-[#9496a8]">{comp.variant}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Personality */}
      <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
        <span
          className="mb-3 block text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Personality
        </span>
        <div className="space-y-2.5">
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
        <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-[#9496a8]" />
            <span
              className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
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
        <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Mic className="h-3.5 w-3.5 text-[#9496a8]" />
            <span
              className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
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
            {spec.narrativePrompts && Object.values(spec.narrativePrompts).some((v) => v) && (
              <div className="mt-2 space-y-1.5">
                {spec.narrativePrompts.come_because && (
                  <p className="text-[10px] leading-relaxed text-[#9496a8]">
                    <span className="text-[#c0c1cc]">Why:</span> &ldquo;
                    {spec.narrativePrompts.come_because}&rdquo;
                  </p>
                )}
                {spec.narrativePrompts.frustrated_with && (
                  <p className="text-[10px] leading-relaxed text-[#9496a8]">
                    <span className="text-[#c0c1cc]">Pain:</span> &ldquo;
                    {spec.narrativePrompts.frustrated_with}&rdquo;
                  </p>
                )}
                {spec.narrativePrompts.after_feel && (
                  <p className="text-[10px] leading-relaxed text-[#9496a8]">
                    <span className="text-[#c0c1cc]">After:</span> &ldquo;
                    {spec.narrativePrompts.after_feel}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anti-References */}
      {spec.antiReferences && spec.antiReferences.length > 0 && (
        <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Ban className="h-3.5 w-3.5 text-[#9496a8]" />
            <span
              className="text-xs font-semibold tracking-wider text-[#9496a8] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
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

      {/* Actions */}
      <div className="mt-auto p-4">
        <button
          onClick={() => {
            resetStore();
            router.push("/demo");
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2 text-xs font-medium text-[#9496a8] transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-white focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start Over
        </button>
      </div>
    </div>
  );
}

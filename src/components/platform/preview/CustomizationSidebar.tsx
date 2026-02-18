"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  X,
  RotateCcw,
  Sparkles,
  Lock,
  ChevronDown,
  FileText,
  Layers,
  Heart,
  Mic,
  Ban,
  Palette,
} from "lucide-react";
import type { SiteIntentDocument } from "@/lib/assembly";
import type { ThemeTokens } from "@/lib/theme";
import { THEME_PRESETS, FONT_PAIRINGS, FREE_FONT_IDS } from "@/lib/theme";
import type { FontPairing } from "@/lib/theme";
import { useSubscription } from "@/lib/hooks/use-subscription";
import {
  EMOTIONAL_OUTCOMES,
  VOICE_TONE_CARDS,
  BRAND_ARCHETYPES,
  ANTI_REFERENCES,
  INDUSTRY_ANTI_REFERENCES,
} from "@/lib/types/brand-character";
import { getVoiceKeyedHeadline } from "@/lib/content";

/* ────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────── */

interface CustomizationSidebarProps {
  spec: SiteIntentDocument;
  activeTheme: ThemeTokens;
  activePresetId: string | null;
  primaryColorOverride: string | null;
  fontPairingId: string | null;
  /** The font pairing ID that the AI originally selected */
  aiFontPairingId: string | null;
  hasChanges: boolean;
  activePage: string;
  onPageChange: (slug: string) => void;
  onPresetChange: (presetId: string | null) => void;
  onColorChange: (hex: string | null) => void;
  onFontChange: (fontPairingId: string | null) => void;
  onContentChange: (componentIndex: number, field: string, value: string) => void;
  onReset: () => void;
  onClose: () => void;
  /** Brand Discovery props */
  emotionalGoals: string[];
  voiceProfile: string | null;
  brandArchetype: string | null;
  antiReferences: string[];
  siteType: string;
  expressMode: boolean;
  onEmotionChange: (goals: string[]) => void;
  onVoiceChange: (voice: string | null) => void;
  onArchetypeChange: (archetype: string | null) => void;
  onAntiRefChange: (refs: string[]) => void;
}

/* ────────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────────── */

const PERSONALITY_LABELS = [
  { label: "Density", left: "Minimal", right: "Rich" },
  { label: "Tone", left: "Playful", right: "Serious" },
  { label: "Temp", left: "Warm", right: "Cool" },
  { label: "Weight", left: "Light", right: "Bold" },
  { label: "Era", left: "Classic", right: "Modern" },
  { label: "Energy", left: "Calm", right: "Dynamic" },
];

/* ────────────────────────────────────────────────────────────
 * Subcomponents
 * ──────────────────────────────────────────────────────────── */

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: typeof Palette;
  title: string;
}): React.ReactElement {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-[#9496a8]" />
      <span className="text-[11px] font-semibold tracking-wider text-[#9496a8] uppercase">
        {title}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Preset Switcher
 * ──────────────────────────────────────────────────────────── */

function PresetSwitcher({
  activePresetId,
  onPresetChange,
}: {
  activePresetId: string | null;
  onPresetChange: (presetId: string | null) => void;
}): React.ReactElement {
  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
      <SectionHeader icon={Palette} title="Theme Preset" />
      <div className="grid grid-cols-2 gap-2">
        {/* AI Original option */}
        <button
          onClick={() => onPresetChange(null)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-all ${
            activePresetId === null
              ? "border-[#e8a849]/40 bg-[#e8a849]/8"
              : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)]"
          }`}
        >
          <Sparkles
            className={`h-3.5 w-3.5 shrink-0 ${activePresetId === null ? "text-[#e8a849]" : "text-[#9496a8]"}`}
          />
          <span
            className={`text-[11px] font-medium ${activePresetId === null ? "text-[#e8a849]" : "text-[#c0c1cc]"}`}
          >
            AI Original
          </span>
        </button>

        {/* Preset cards */}
        {THEME_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-all ${
                isActive
                  ? "border-[#e8a849]/40 bg-[#e8a849]/8"
                  : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)]"
              }`}
            >
              {/* Color swatch */}
              <div className="flex shrink-0 -space-x-1">
                <div
                  className="h-4 w-4 rounded-full border border-[rgba(255,255,255,0.1)]"
                  style={{ backgroundColor: preset.tokens.colorPrimary }}
                />
                <div
                  className="h-4 w-4 rounded-full border border-[rgba(255,255,255,0.1)]"
                  style={{ backgroundColor: preset.tokens.colorBackground }}
                />
              </div>
              <span
                className={`truncate text-[11px] font-medium ${isActive ? "text-[#e8a849]" : "text-[#c0c1cc]"}`}
              >
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Color Picker
 * ──────────────────────────────────────────────────────────── */

function ColorPicker({
  currentColor,
  onColorChange,
}: {
  currentColor: string;
  onColorChange: (hex: string | null) => void;
}): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hexInput, setHexInput] = useState(currentColor);

  // Sync external changes
  useEffect(() => {
    setHexInput(currentColor);
  }, [currentColor]);

  const handleColorInput = useCallback(
    (value: string): void => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onColorChange(value);
      }, 100);
    },
    [onColorChange]
  );

  const handleHexSubmit = useCallback(
    (value: string): void => {
      const cleaned = value.startsWith("#") ? value : `#${value}`;
      if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
        onColorChange(cleaned);
      }
    },
    [onColorChange]
  );

  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
      <SectionHeader icon={Palette} title="Primary Color" />
      <div className="flex items-center gap-3">
        {/* Swatch that opens native color picker */}
        <button
          onClick={() => inputRef.current?.click()}
          className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border-2 border-[rgba(255,255,255,0.12)] transition-colors hover:border-[rgba(255,255,255,0.25)]"
          style={{ backgroundColor: currentColor }}
          title="Pick a color"
        >
          <input
            ref={inputRef}
            type="color"
            value={currentColor}
            onChange={(e) => {
              setHexInput(e.target.value);
              handleColorInput(e.target.value);
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
            tabIndex={-1}
          />
        </button>

        {/* Hex text input */}
        <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1.5">
          <span className="text-[11px] font-medium text-[#6b6d80]">#</span>
          <input
            type="text"
            value={hexInput.replace("#", "")}
            onChange={(e) => {
              const val = e.target.value.slice(0, 6);
              setHexInput(`#${val}`);
            }}
            onBlur={() => handleHexSubmit(hexInput)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleHexSubmit(hexInput);
            }}
            className="w-[5.5ch] bg-transparent font-mono text-[11px] text-[#c0c1cc] outline-none"
            maxLength={6}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Font Selector
 * ──────────────────────────────────────────────────────────── */

function FontSelector({
  activeFontId,
  aiFontPairingId,
  onFontChange,
  userPlan = "free",
}: {
  activeFontId: string | null;
  aiFontPairingId: string | null;
  onFontChange: (id: string | null) => void;
  userPlan?: "free" | "starter" | "pro";
}): React.ReactElement {
  const [upgradeNudgeId, setUpgradeNudgeId] = useState<string | null>(null);
  const hasProAccess = userPlan === "pro";

  const handleClick = useCallback(
    (pairing: FontPairing): void => {
      const isFree =
        hasProAccess || FREE_FONT_IDS.has(pairing.id) || pairing.id === aiFontPairingId;
      if (!isFree) {
        setUpgradeNudgeId((prev) => (prev === pairing.id ? null : pairing.id));
        return;
      }
      // Clicking the active font resets to AI original
      if (activeFontId === pairing.id) {
        onFontChange(null);
      } else {
        onFontChange(pairing.id);
      }
      setUpgradeNudgeId(null);
    },
    [activeFontId, aiFontPairingId, onFontChange, hasProAccess]
  );

  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
      <SectionHeader icon={Palette} title="Font Pairing" />
      <div className="max-h-[240px] space-y-1 overflow-y-auto pr-1">
        {FONT_PAIRINGS.map((pairing) => {
          const isFree =
            hasProAccess || FREE_FONT_IDS.has(pairing.id) || pairing.id === aiFontPairingId;
          const isActive =
            activeFontId === pairing.id ||
            (activeFontId === null && pairing.id === aiFontPairingId);
          const isAiDefault = pairing.id === aiFontPairingId;

          return (
            <div key={pairing.id}>
              <button
                onClick={() => handleClick(pairing)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all ${
                  isActive
                    ? "bg-[#e8a849]/8 ring-1 ring-[#e8a849]/30"
                    : "hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                {/* Font preview */}
                <span
                  className={`flex-1 truncate text-[13px] ${isActive ? "text-white" : isFree ? "text-[#c0c1cc]" : "text-[#6b6d80]"}`}
                  style={{ fontFamily: pairing.heading }}
                >
                  {pairing.displayName}
                </span>

                {/* Badges */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {isAiDefault && (
                    <span className="rounded-full bg-[#3ecfb4]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#3ecfb4]">
                      AI
                    </span>
                  )}
                  {!isFree && <Lock className="h-3 w-3 text-[#6b6d80]" />}
                </div>
              </button>

              {/* Upgrade nudge (inline) */}
              {upgradeNudgeId === pairing.id && !isFree && (
                <div className="mx-3 mt-1 mb-1 rounded-md bg-[#e8a849]/8 px-3 py-2">
                  <p className="text-[10px] leading-relaxed text-[#e8a849]">
                    Unlock all 14 font pairings with Pro.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Headline Editor
 * ──────────────────────────────────────────────────────────── */

interface EditableHeadline {
  componentIndex: number;
  componentId: string;
  field: string;
  label: string;
  value: string;
  isHero: boolean;
}

function HeadlineEditor({
  headlines,
  onContentChange,
}: {
  headlines: EditableHeadline[];
  onContentChange: (componentIndex: number, field: string, value: string) => void;
}): React.ReactElement {
  const debounceRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const handleChange = useCallback(
    (componentIndex: number, field: string, value: string): void => {
      const key = `${componentIndex}-${field}`;
      const existing = debounceRefs.current.get(key);
      if (existing) clearTimeout(existing);
      debounceRefs.current.set(
        key,
        setTimeout(() => {
          onContentChange(componentIndex, field, value);
        }, 300)
      );
    },
    [onContentChange]
  );

  if (headlines.length === 0) return <></>;

  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] p-4">
      <SectionHeader icon={FileText} title="Headlines" />
      <div className="space-y-3">
        {headlines.map((h) => (
          <div key={`${h.componentIndex}-${h.field}`}>
            <label className="mb-1 block text-[10px] font-medium text-[#6b6d80]">{h.label}</label>
            <input
              type="text"
              defaultValue={h.value}
              onChange={(e) => handleChange(h.componentIndex, h.field, e.target.value)}
              className={`w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 text-[#c0c1cc] transition-colors outline-none placeholder:text-[#4a4c5c] focus:border-[#e8a849]/40 ${
                h.isHero ? "py-2.5 text-sm font-semibold" : "py-2 text-xs"
              }`}
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Brand Discovery
 * ──────────────────────────────────────────────────────────── */

function getLucideIcon(name: string): React.ComponentType<{ className?: string }> {
  const icon = (LucideIcons as Record<string, unknown>)[name];
  return (icon as React.ComponentType<{ className?: string }>) ?? LucideIcons.Circle;
}

function BrandDiscovery({
  emotionalGoals,
  voiceProfile,
  brandArchetype,
  antiReferences,
  siteType,
  businessName,
  expressMode,
  onEmotionChange,
  onVoiceChange,
  onArchetypeChange,
  onAntiRefChange,
}: {
  emotionalGoals: string[];
  voiceProfile: string | null;
  brandArchetype: string | null;
  antiReferences: string[];
  siteType: string;
  businessName: string;
  expressMode: boolean;
  onEmotionChange: (goals: string[]) => void;
  onVoiceChange: (voice: string | null) => void;
  onArchetypeChange: (archetype: string | null) => void;
  onAntiRefChange: (refs: string[]) => void;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(expressMode);
  const hasBrandCharacter =
    emotionalGoals.length > 0 || voiceProfile || brandArchetype || antiReferences.length > 0;

  const allAntiRefs = [...ANTI_REFERENCES, ...(INDUSTRY_ANTI_REFERENCES[siteType] ?? [])];

  return (
    <div className="border-b border-[rgba(255,255,255,0.06)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)]"
      >
        <div className="flex items-center gap-2">
          <Heart className="h-3.5 w-3.5 text-[#e8a849]" />
          <span className="text-[11px] font-semibold tracking-wider text-[#9496a8] uppercase">
            Brand Character
          </span>
          {!isOpen && hasBrandCharacter && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8a849]" />
          )}
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#6b6d80] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 px-4 pb-4">
          {expressMode && !hasBrandCharacter && (
            <p className="text-[10px] leading-relaxed text-[#6b6d80]">
              Discover your brand&apos;s personality — changes apply instantly
            </p>
          )}

          {/* a) Emotion Picker — 5x2 grid, max 2 */}
          <div>
            <span className="mb-2 block text-[10px] font-medium text-[#6b6d80]">
              How should visitors feel? <span className="text-[#4a4c5c]">(pick up to 2)</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {EMOTIONAL_OUTCOMES.map((e) => {
                const isActive = emotionalGoals.includes(e.id);
                const Icon = getLucideIcon(e.icon);
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      const next = isActive
                        ? emotionalGoals.filter((g) => g !== e.id)
                        : emotionalGoals.length < 2
                          ? [...emotionalGoals, e.id]
                          : [emotionalGoals[1], e.id];
                      onEmotionChange(next);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                      isActive
                        ? "border-[#e8a849]/40 bg-[#e8a849]/8"
                        : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)]"
                    }`}
                  >
                    <Icon
                      className={`h-3 w-3 shrink-0 ${isActive ? "text-[#e8a849]" : "text-[#6b6d80]"}`}
                    />
                    <span
                      className={`text-[10px] font-medium ${isActive ? "text-[#e8a849]" : "text-[#c0c1cc]"}`}
                    >
                      {e.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* b) Voice Picker — 3 cards with headline preview */}
          <div>
            <span className="mb-2 block text-[10px] font-medium text-[#6b6d80]">Voice tone</span>
            <div className="space-y-1.5">
              {VOICE_TONE_CARDS.map((v) => {
                const isActive = voiceProfile === v.id;
                const Icon = getLucideIcon(v.icon);
                const preview = getVoiceKeyedHeadline(businessName, siteType, v.id);
                return (
                  <button
                    key={v.id}
                    onClick={() => onVoiceChange(isActive ? null : v.id)}
                    className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-all ${
                      isActive
                        ? "border-[#e8a849]/40 bg-[#e8a849]/8"
                        : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)]"
                    }`}
                  >
                    <Icon
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#e8a849]" : "text-[#6b6d80]"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`block text-[11px] font-semibold ${isActive ? "text-[#e8a849]" : "text-[#c0c1cc]"}`}
                      >
                        {v.label}
                      </span>
                      <span className="block truncate text-[9px] text-[#4a4c5c] italic">
                        &ldquo;{preview}&rdquo;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* c) Archetype Picker — 2x3 grid */}
          <div>
            <span className="mb-2 block text-[10px] font-medium text-[#6b6d80]">
              Brand archetype
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {BRAND_ARCHETYPES.map((a) => {
                const isActive = brandArchetype === a.id;
                const Icon = getLucideIcon(a.icon);
                return (
                  <button
                    key={a.id}
                    onClick={() => onArchetypeChange(isActive ? null : a.id)}
                    className={`flex flex-col items-start gap-1 rounded-lg border px-2.5 py-2 text-left transition-all ${
                      isActive
                        ? "border-[#e8a849]/40 bg-[#e8a849]/8"
                        : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={`h-3 w-3 shrink-0 ${isActive ? "text-[#e8a849]" : "text-[#6b6d80]"}`}
                      />
                      <span
                        className={`text-[10px] font-semibold ${isActive ? "text-[#e8a849]" : "text-[#c0c1cc]"}`}
                      >
                        {a.label}
                      </span>
                    </div>
                    <span className="text-[9px] leading-tight text-[#4a4c5c]">{a.tagline}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* d) Anti-Reference Pills */}
          <div>
            <span className="mb-2 block text-[10px] font-medium text-[#6b6d80]">NOT like this</span>
            <div className="flex flex-wrap gap-1.5">
              {allAntiRefs.map((ref) => {
                const isActive = antiReferences.includes(ref.id);
                return (
                  <button
                    key={ref.id}
                    onClick={() => {
                      const next = isActive
                        ? antiReferences.filter((r) => r !== ref.id)
                        : [...antiReferences, ref.id];
                      onAntiRefChange(next);
                    }}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      isActive
                        ? "border-red-500/30 bg-red-500/8 text-red-400/80"
                        : "border-[rgba(255,255,255,0.08)] text-[#6b6d80] hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                    title={ref.description}
                  >
                    {ref.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Site Info Accordion (metadata from old PreviewSidebar)
 * ──────────────────────────────────────────────────────────── */

function SiteInfoAccordion({
  spec,
  activeTheme,
  activePage,
  onPageChange,
}: {
  spec: SiteIntentDocument;
  activeTheme: ThemeTokens;
  activePage: string;
  onPageChange: (slug: string) => void;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const activePageSpec = spec.pages.find((p) => p.slug === activePage) ?? spec.pages[0];

  return (
    <div className="border-b border-[rgba(255,255,255,0.06)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase transition-colors hover:text-[#9496a8]"
      >
        <span>Site Details</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="space-y-4 px-4 pb-4">
          {/* Business info */}
          <div>
            {spec.tagline && (
              <p className="text-xs leading-relaxed text-[#9496a8]">{spec.tagline}</p>
            )}
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
          <div>
            <SectionHeader icon={FileText} title="Pages" />
            <div className="space-y-1">
              {spec.pages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => onPageChange(page.slug)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
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

          {/* Theme colors */}
          <div>
            <SectionHeader icon={Palette} title="Active Theme" />
            <div className="flex gap-2">
              {[
                { label: "Primary", color: activeTheme.colorPrimary },
                { label: "Secondary", color: activeTheme.colorSecondary },
                { label: "Accent", color: activeTheme.colorAccent },
                { label: "Bg", color: activeTheme.colorBackground },
                { label: "Text", color: activeTheme.colorText },
              ].map((swatch) => (
                <div key={swatch.label} className="text-center">
                  <div
                    className="mb-1 h-7 w-7 rounded-lg border border-[rgba(255,255,255,0.1)]"
                    style={{ backgroundColor: swatch.color }}
                    title={`${swatch.label}: ${swatch.color}`}
                  />
                  <span className="text-[8px] text-[#6b6d80]">{swatch.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Components */}
          <div>
            <SectionHeader
              icon={Layers}
              title={`Components (${activePageSpec?.components.length ?? 0})`}
            />
            <div className="space-y-1">
              {activePageSpec?.components
                .sort((a, b) => a.order - b.order)
                .map((comp, i) => (
                  <div
                    key={`${comp.componentId}-${i}`}
                    className="flex items-center justify-between py-1 text-xs"
                  >
                    <span className="font-mono text-[#c0c1cc]">{comp.componentId}</span>
                    <span className="text-[#6b6d80]">{comp.variant}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Personality */}
          <div>
            <span className="mb-2 block text-[11px] font-semibold tracking-wider text-[#9496a8] uppercase">
              Personality
            </span>
            <div className="space-y-2">
              {PERSONALITY_LABELS.map((axis, i) => (
                <div key={axis.label}>
                  <div className="mb-0.5 flex justify-between text-[10px] text-[#6b6d80]">
                    <span>{axis.left}</span>
                    <span className="font-semibold text-[#9496a8]">{axis.label}</span>
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
              <SectionHeader icon={Heart} title="Emotional Goals" />
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
              <SectionHeader icon={Mic} title="Voice & Character" />
              <div className="space-y-2">
                {spec.voiceProfile && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6b6d80]">Voice:</span>
                    <span className="rounded-full bg-[#3ecfb4]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#3ecfb4] capitalize">
                      {spec.voiceProfile}
                    </span>
                  </div>
                )}
                {spec.brandArchetype && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6b6d80]">Archetype:</span>
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
              <SectionHeader icon={Ban} title="Avoid" />
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
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Main CustomizationSidebar
 * ──────────────────────────────────────────────────────────── */

export function CustomizationSidebar({
  spec,
  activeTheme,
  activePresetId,
  primaryColorOverride,
  fontPairingId,
  aiFontPairingId,
  hasChanges,
  activePage,
  onPageChange,
  onPresetChange,
  onColorChange,
  onFontChange,
  onContentChange,
  onReset,
  onClose,
  emotionalGoals,
  voiceProfile,
  brandArchetype,
  antiReferences,
  siteType,
  expressMode,
  onEmotionChange,
  onVoiceChange,
  onArchetypeChange,
  onAntiRefChange,
}: CustomizationSidebarProps): React.ReactElement {
  const { plan } = useSubscription();

  // Build editable headlines from spec
  const headlines: EditableHeadline[] = [];
  const firstPage = spec.pages.find((p) => p.slug === activePage) ?? spec.pages[0];
  if (firstPage) {
    firstPage.components
      .sort((a, b) => a.order - b.order)
      .forEach((comp, index) => {
        const content = comp.content as Record<string, unknown>;
        if (!content) return;

        const isHero = comp.componentId.startsWith("hero-");

        if (typeof content.headline === "string") {
          headlines.push({
            componentIndex: index,
            componentId: comp.componentId,
            field: "headline",
            label: isHero ? "Hero Headline" : `${comp.componentId} — Headline`,
            value: content.headline,
            isHero,
          });
        }
        if (typeof content.subheadline === "string" && isHero) {
          headlines.push({
            componentIndex: index,
            componentId: comp.componentId,
            field: "subheadline",
            label: "Hero Subheadline",
            value: content.subheadline,
            isHero: false,
          });
        }
      });
  }

  return (
    <div className="flex w-80 shrink-0 flex-col overflow-hidden border-r border-[rgba(255,255,255,0.06)] bg-[#12131a]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white">Customize</h2>
          {hasChanges && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8a849]" title="Unsaved changes" />
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-[#6b6d80] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
          title="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. Preset Switcher */}
        <PresetSwitcher activePresetId={activePresetId} onPresetChange={onPresetChange} />

        {/* 2. Color Picker */}
        <ColorPicker
          currentColor={primaryColorOverride ?? activeTheme.colorPrimary}
          onColorChange={onColorChange}
        />

        {/* 3. Font Selector */}
        <FontSelector
          activeFontId={fontPairingId}
          aiFontPairingId={aiFontPairingId}
          onFontChange={onFontChange}
          userPlan={plan}
        />

        {/* 4. Brand Discovery */}
        <BrandDiscovery
          emotionalGoals={emotionalGoals}
          voiceProfile={voiceProfile}
          brandArchetype={brandArchetype}
          antiReferences={antiReferences}
          siteType={siteType}
          businessName={spec.businessName}
          expressMode={expressMode}
          onEmotionChange={onEmotionChange}
          onVoiceChange={onVoiceChange}
          onArchetypeChange={onArchetypeChange}
          onAntiRefChange={onAntiRefChange}
        />

        {/* 5. Headline Editor */}
        <HeadlineEditor headlines={headlines} onContentChange={onContentChange} />

        {/* 6. Site Info Accordion */}
        <SiteInfoAccordion
          spec={spec}
          activeTheme={activeTheme}
          activePage={activePage}
          onPageChange={onPageChange}
        />
      </div>

      {/* Reset button — sticky at bottom */}
      <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] p-3">
        <button
          onClick={onReset}
          disabled={!hasChanges}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all ${
            hasChanges
              ? "border-[rgba(255,255,255,0.1)] text-[#c0c1cc] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
              : "cursor-not-allowed border-[rgba(255,255,255,0.04)] text-[#4a4c5c]"
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to AI Original
        </button>
      </div>
    </div>
  );
}

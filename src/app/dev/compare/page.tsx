"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { GitCompareArrows, ArrowLeft, Loader2, Palette, Type, FileText } from "lucide-react";
import Link from "next/link";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import { applyEmotionalOverrides } from "@/lib/theme/emotional-overrides";
import type { ThemeTokens, PersonalityVector } from "@/lib/theme/theme.types";

/* ── Types ─────────────────────────────────────────────── */

interface SpecSnapshot {
  personalityVector?: number[];
  siteType?: string;
  emotionalGoals?: string[];
  antiReferences?: string[];
  pages?: Array<{
    components?: Array<{
      componentId: string;
      variant: string;
      content?: Record<string, unknown>;
    }>;
  }>;
}

interface PipelineLog {
  sessionId: string;
  method: string;
  intakeData: Record<string, unknown>;
  specSnapshot?: SpecSnapshot;
  validationResult?: {
    warnings?: Array<{ message: string; severity: string }>;
    subType?: string;
  };
  processingTimeMs: number;
  createdAt: number;
}

/* ── Helpers ────────────────────────────────────────────── */

type CompareTab = "theme" | "content" | "components";

const TAB_CONFIG: { id: CompareTab; label: string; icon: React.ReactNode }[] = [
  { id: "theme", label: "Theme Diff", icon: <Palette className="h-3.5 w-3.5" /> },
  { id: "content", label: "Content Diff", icon: <FileText className="h-3.5 w-3.5" /> },
  { id: "components", label: "Components", icon: <Type className="h-3.5 w-3.5" /> },
];

function getThemeFromSpec(spec: SpecSnapshot | undefined): ThemeTokens | null {
  if (!spec?.personalityVector || spec.personalityVector.length !== 6) return null;
  const base = generateThemeFromVector(spec.personalityVector as PersonalityVector, {
    businessType: spec.siteType,
  });
  if (spec.emotionalGoals?.length) {
    return applyEmotionalOverrides(base, spec.emotionalGoals, spec.antiReferences ?? []);
  }
  return base;
}

function extractContent(spec: SpecSnapshot | undefined): { label: string; value: string }[] {
  if (!spec?.pages) return [];
  const items: { label: string; value: string }[] = [];
  for (const page of spec.pages) {
    for (const comp of page.components ?? []) {
      const c = comp.content ?? {};
      if (typeof c.headline === "string") {
        items.push({ label: `${comp.componentId} headline`, value: c.headline });
      }
      if (typeof c.subheadline === "string") {
        items.push({ label: `${comp.componentId} subheadline`, value: c.subheadline });
      }
      if (typeof c.body === "string") {
        items.push({ label: `${comp.componentId} body`, value: c.body });
      }
      const cta = c.cta as { text?: string } | undefined;
      if (cta?.text) {
        items.push({ label: `${comp.componentId} CTA`, value: cta.text });
      }
    }
  }
  return items;
}

function extractComponents(
  spec: SpecSnapshot | undefined
): { componentId: string; variant: string }[] {
  if (!spec?.pages) return [];
  const items: { componentId: string; variant: string }[] = [];
  for (const page of spec.pages) {
    for (const comp of page.components ?? []) {
      items.push({ componentId: comp.componentId, variant: comp.variant });
    }
  }
  return items;
}

const COLOR_KEYS = [
  "colorPrimary",
  "colorPrimaryLight",
  "colorPrimaryDark",
  "colorSecondary",
  "colorAccent",
  "colorBackground",
  "colorSurface",
  "colorText",
  "colorTextSecondary",
  "colorBorder",
] as const;

/* ── Comparison Tabs ───────────────────────────────────── */

function ThemeDiffTab({
  left,
  right,
}: {
  left: ThemeTokens | null;
  right: ThemeTokens | null;
}): React.ReactElement {
  if (!left || !right) {
    return (
      <p className="py-8 text-center text-[13px] text-[#6b6d80]">
        Theme data unavailable for one or both sessions.
      </p>
    );
  }

  const diffs: { key: string; leftVal: string; rightVal: string; isColor: boolean }[] = [];
  for (const key of Object.keys(left) as (keyof ThemeTokens)[]) {
    if (left[key] !== right[key]) {
      diffs.push({
        key,
        leftVal: left[key],
        rightVal: right[key],
        isColor: key.startsWith("color"),
      });
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Color swatches side by side */}
      <div>
        <h4 className="mb-3 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Color Tokens
        </h4>
        <div className="space-y-1">
          {COLOR_KEYS.map((key) => {
            const lv = left[key];
            const rv = right[key];
            const changed = lv !== rv;
            return (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-lg px-2 py-1 ${changed ? "bg-amber-500/5" : ""}`}
              >
                <span className="w-36 shrink-0 text-[11px] text-[#6b6d80]">
                  {key.replace("color", "")}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 w-5 rounded border border-[rgba(255,255,255,0.1)]"
                    style={{ backgroundColor: lv }}
                  />
                  <span
                    className="w-20 text-[11px] text-[#9496a8]"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {lv}
                  </span>
                </div>
                {changed ? (
                  <>
                    <span className="text-[#e8a849]">&rarr;</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 w-5 rounded border border-[rgba(255,255,255,0.1)]"
                        style={{ backgroundColor: rv }}
                      />
                      <span
                        className="w-20 text-[11px] text-emerald-400"
                        style={{ fontFamily: "var(--font-mono, monospace)" }}
                      >
                        {rv}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-[11px] text-[#6b6d80]/50">same</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-color diffs */}
      {diffs.filter((d) => !d.isColor).length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
            Other Token Changes ({diffs.filter((d) => !d.isColor).length})
          </h4>
          <div className="space-y-0.5">
            {diffs
              .filter((d) => !d.isColor)
              .map((d) => (
                <div key={d.key} className="flex items-center gap-2 py-0.5 text-[12px]">
                  <span className="w-40 shrink-0 text-[11px] text-[#6b6d80]">{d.key}</span>
                  <span
                    className="text-red-400/60 line-through"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {d.leftVal}
                  </span>
                  <span className="text-[#6b6d80]">&rarr;</span>
                  <span
                    className="text-emerald-400"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {d.rightVal}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {diffs.length === 0 && (
        <p className="py-4 text-center text-[13px] text-emerald-400/60">
          Themes are identical — no token differences.
        </p>
      )}

      <p className="text-[11px] text-[#6b6d80]">
        Total changes: {diffs.length} token{diffs.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function ContentDiffTab({
  left,
  right,
}: {
  left: { label: string; value: string }[];
  right: { label: string; value: string }[];
}): React.ReactElement {
  // Align by label
  const allLabels = Array.from(
    new Set([...left.map((l) => l.label), ...right.map((r) => r.label)])
  );

  return (
    <div className="space-y-2 p-4">
      <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
        Content Comparison
      </h4>
      {allLabels.map((label) => {
        const lv = left.find((l) => l.label === label)?.value ?? "—";
        const rv = right.find((r) => r.label === label)?.value ?? "—";
        const changed = lv !== rv;

        return (
          <div
            key={label}
            className={`rounded-lg border p-3 ${
              changed
                ? "border-amber-500/20 bg-amber-500/5"
                : "border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)]"
            }`}
          >
            <span className="mb-1 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
              {label}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <p className="text-[12px] leading-relaxed text-[#9496a8]">{lv}</p>
              <p
                className={`text-[12px] leading-relaxed ${changed ? "text-emerald-400" : "text-[#9496a8]"}`}
              >
                {rv}
              </p>
            </div>
          </div>
        );
      })}
      {allLabels.length === 0 && (
        <p className="py-4 text-center text-[13px] text-[#6b6d80]">No content fields to compare.</p>
      )}
    </div>
  );
}

function ComponentsDiffTab({
  left,
  right,
}: {
  left: { componentId: string; variant: string }[];
  right: { componentId: string; variant: string }[];
}): React.ReactElement {
  const maxLen = Math.max(left.length, right.length);

  return (
    <div className="p-4">
      <h4 className="mb-3 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
        Component Stack
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Left
        </div>
        <div className="text-center text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Right
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {Array.from({ length: maxLen }, (_, i) => {
          const l = left[i];
          const r = right[i];
          const same = l?.componentId === r?.componentId && l?.variant === r?.variant;

          return (
            <div
              key={i}
              className={`grid grid-cols-2 gap-4 rounded-lg px-2 py-1.5 ${
                same ? "" : "bg-amber-500/5"
              }`}
            >
              <div className="text-[12px]">
                {l ? (
                  <span className="text-[#c8c9d4]">
                    {l.componentId}{" "}
                    <span className="text-[10px] text-[#6b6d80]">({l.variant})</span>
                  </span>
                ) : (
                  <span className="text-[#6b6d80]/40">—</span>
                )}
              </div>
              <div className="text-[12px]">
                {r ? (
                  <span className={same ? "text-[#c8c9d4]" : "text-emerald-400"}>
                    {r.componentId}{" "}
                    <span
                      className={`text-[10px] ${same ? "text-[#6b6d80]" : "text-emerald-400/60"}`}
                    >
                      ({r.variant})
                    </span>
                  </span>
                ) : (
                  <span className="text-[#6b6d80]/40">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */

function CompareContent(): React.ReactElement {
  const [leftSession, setLeftSession] = useState("");
  const [rightSession, setRightSession] = useState("");
  const [activeTab, setActiveTab] = useState<CompareTab>("theme");

  // Fetch pipeline logs for both sessions
  const leftLog = useQuery(
    api.pipelineLogs.getPipelineLog,
    leftSession ? { sessionId: leftSession } : "skip"
  ) as PipelineLog | null | undefined;

  const rightLog = useQuery(
    api.pipelineLogs.getPipelineLog,
    rightSession ? { sessionId: rightSession } : "skip"
  ) as PipelineLog | null | undefined;

  // Also load test cases for the session picker
  const testCases = useQuery(api.testCases.listTestCases) as
    | Array<{ _id: string; name: string; intakeSnapshot: Record<string, unknown> }>
    | undefined;

  // Derive comparison data
  const leftTheme = useMemo(() => getThemeFromSpec(leftLog?.specSnapshot), [leftLog?.specSnapshot]);
  const rightTheme = useMemo(
    () => getThemeFromSpec(rightLog?.specSnapshot),
    [rightLog?.specSnapshot]
  );
  const leftContent = useMemo(() => extractContent(leftLog?.specSnapshot), [leftLog?.specSnapshot]);
  const rightContent = useMemo(
    () => extractContent(rightLog?.specSnapshot),
    [rightLog?.specSnapshot]
  );
  const leftComponents = useMemo(
    () => extractComponents(leftLog?.specSnapshot),
    [leftLog?.specSnapshot]
  );
  const rightComponents = useMemo(
    () => extractComponents(rightLog?.specSnapshot),
    [rightLog?.specSnapshot]
  );

  // Get URL params for pre-fill
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const urlLeft = params?.get("left");
  const urlRight = params?.get("right");

  // Pre-fill from URL on mount
  useState(() => {
    if (urlLeft && !leftSession) setLeftSession(urlLeft);
    if (urlRight && !rightSession) setRightSession(urlRight);
  });

  return (
    <div className="min-h-screen bg-[#08090d]">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0a0b0f]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dev/test-cases"
              className="rounded-lg p-2 text-[#6b6d80] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#c8c9d4]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <GitCompareArrows className="h-5 w-5 text-[#e8a849]" />
              <h1
                className="text-lg font-bold text-[#e0e1e8]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Compare
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Session selectors */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0a0b0f]/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 py-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
              Left (Before)
            </label>
            <input
              type="text"
              value={leftSession}
              onChange={(e) => setLeftSession(e.target.value)}
              placeholder="Session ID or select test case below"
              className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-[12px] text-[#c8c9d4] placeholder-[#6b6d80] outline-none focus:border-[#e8a849]/40"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            />
            {leftLog && (
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${leftLog.method === "ai" ? "bg-purple-500/15 text-purple-400" : "bg-amber-500/15 text-amber-400"}`}
                >
                  {leftLog.method === "ai" ? "AI" : "Det."}
                </span>
                <span className="text-[10px] text-[#6b6d80]">{leftLog.processingTimeMs}ms</span>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-[#6b6d80] uppercase">
              Right (After)
            </label>
            <input
              type="text"
              value={rightSession}
              onChange={(e) => setRightSession(e.target.value)}
              placeholder="Session ID or select test case below"
              className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-[12px] text-[#c8c9d4] placeholder-[#6b6d80] outline-none focus:border-[#e8a849]/40"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            />
            {rightLog && (
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${rightLog.method === "ai" ? "bg-purple-500/15 text-purple-400" : "bg-amber-500/15 text-amber-400"}`}
                >
                  {rightLog.method === "ai" ? "AI" : "Det."}
                </span>
                <span className="text-[10px] text-[#6b6d80]">{rightLog.processingTimeMs}ms</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Quick pick from test case runs */}
        {testCases && testCases.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
              Quick Pick from Pipeline Logs
            </h3>
            <p className="mb-3 text-[12px] text-[#6b6d80]/70">
              Paste session IDs from test case runs above, or enter any session ID from the preview
              URL.
            </p>
          </div>
        )}

        {/* Comparison tabs */}
        {leftLog && rightLog && (
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0e13]">
            <div className="flex gap-0 border-b border-[rgba(255,255,255,0.06)]">
              {TAB_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-[#e8a849] text-[#e8a849]"
                      : "text-[#6b6d80] hover:text-[#9496a8]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {activeTab === "theme" && <ThemeDiffTab left={leftTheme} right={rightTheme} />}
              {activeTab === "content" && (
                <ContentDiffTab left={leftContent} right={rightContent} />
              )}
              {activeTab === "components" && (
                <ComponentsDiffTab left={leftComponents} right={rightComponents} />
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!leftSession || !rightSession) && (
          <div className="flex flex-col items-center gap-3 py-16">
            <GitCompareArrows className="h-12 w-12 text-[#6b6d80]/30" />
            <h2 className="text-[15px] font-semibold text-[#6b6d80]">
              Enter two session IDs to compare
            </h2>
            <p className="max-w-md text-center text-[13px] text-[#6b6d80]/70">
              Run a test case from{" "}
              <Link href="/dev/test-cases" className="text-[#e8a849] hover:underline">
                /dev/test-cases
              </Link>
              , then paste both session IDs here to see the diff.
            </p>
          </div>
        )}

        {/* Loading */}
        {leftSession && rightSession && (leftLog === undefined || rightLog === undefined) && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#6b6d80]" />
          </div>
        )}

        {/* No data found */}
        {leftSession &&
          rightSession &&
          leftLog !== undefined &&
          rightLog !== undefined &&
          (!leftLog || !rightLog) && (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-[13px] text-[#6b6d80]">
                {!leftLog && `No pipeline log found for left session: ${leftSession}`}
                {!rightLog && `No pipeline log found for right session: ${rightSession}`}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

const ComparePage = dynamic(() => Promise.resolve({ default: CompareContent }), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-[#08090d]">
      <Loader2 className="h-8 w-8 animate-spin text-[#e8a849]" />
    </div>
  ),
});

export default ComparePage;

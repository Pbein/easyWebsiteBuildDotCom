"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  ChevronDown,
  ChevronUp,
  Activity,
  ClipboardList,
  AlertTriangle,
  Code2,
  Palette,
  Save,
  Check,
  Eye,
  Loader2,
  Sparkles,
} from "lucide-react";
import { generateThemeFromVector } from "@/lib/theme/generate-theme";
import { applyEmotionalOverrides } from "@/lib/theme/emotional-overrides";
import type { ThemeTokens, PersonalityVector } from "@/lib/theme/theme.types";
import type { SiteIntentDocument } from "@/lib/assembly/spec.types";

interface DevPanelProps {
  sessionId: string;
  screenshotBase64?: string;
  spec?: SiteIntentDocument;
  onApplyAdjustments?: (adjustments: Record<string, string>) => void;
}

type Tab = "pipeline" | "intake" | "theme" | "validation" | "raw" | "vlm";

const TAB_CONFIG: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "pipeline", label: "Pipeline", icon: <Activity className="h-3.5 w-3.5" /> },
  { id: "intake", label: "Intake", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { id: "theme", label: "Theme", icon: <Palette className="h-3.5 w-3.5" /> },
  { id: "validation", label: "Validation", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: "raw", label: "Raw", icon: <Code2 className="h-3.5 w-3.5" /> },
  { id: "vlm", label: "VLM", icon: <Eye className="h-3.5 w-3.5" /> },
];

function MethodBadge({ method }: { method: string }): React.ReactElement {
  const isAI = method === "ai";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        isAI ? "bg-purple-500/15 text-purple-400" : "bg-amber-500/15 text-amber-400"
      }`}
    >
      {isAI ? "AI" : "Deterministic"}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: "error" | "warning" }): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
        severity === "error" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
      }`}
    >
      {severity}
    </span>
  );
}

function KeyValue({ label, value }: { label: string; value: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex items-baseline gap-3 border-b border-[rgba(255,255,255,0.04)] py-2 last:border-b-0">
      <span className="shrink-0 text-[11px] font-medium tracking-wider text-[#6b6d80] uppercase">
        {label}
      </span>
      <span
        className="min-w-0 text-[13px] text-[#c8c9d4]"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {value}
      </span>
    </div>
  );
}

function PipelineTab({ log }: { log: Record<string, unknown> | null }): React.ReactElement {
  if (!log) {
    return (
      <p className="py-4 text-center text-[13px] text-[#6b6d80]">
        No pipeline log found for this session.
      </p>
    );
  }
  return (
    <div className="space-y-1 p-4">
      <KeyValue label="Method" value={<MethodBadge method={log.method as string} />} />
      <KeyValue label="Processing" value={`${log.processingTimeMs}ms`} />
      <KeyValue label="Generated" value={new Date(log.createdAt as number).toLocaleString()} />
      {(log.validationResult as { subType?: string })?.subType && (
        <KeyValue label="Sub-Type" value={(log.validationResult as { subType: string }).subType} />
      )}
      <KeyValue
        label="Warnings"
        value={(
          (log.validationResult as { warnings?: unknown[] })?.warnings?.length ?? 0
        ).toString()}
      />
    </div>
  );
}

function IntakeTab({ log }: { log: Record<string, unknown> | null }): React.ReactElement {
  if (!log) {
    return <p className="py-4 text-center text-[13px] text-[#6b6d80]">No intake data available.</p>;
  }
  const intake = log.intakeData as Record<string, unknown> | undefined;
  if (!intake) {
    return <p className="py-4 text-center text-[13px] text-[#6b6d80]">No intake data recorded.</p>;
  }
  return (
    <div className="space-y-1 p-4">
      {Object.entries(intake).map(([key, val]) => {
        let display: string;
        if (val === undefined || val === null) {
          display = "—";
        } else if (Array.isArray(val)) {
          display = val.length > 0 ? val.join(", ") : "—";
        } else if (typeof val === "object") {
          display = JSON.stringify(val, null, 2);
        } else {
          display = String(val);
        }
        return <KeyValue key={key} label={key} value={display} />;
      })}
    </div>
  );
}

interface ValidationWarningData {
  severity: "error" | "warning";
  componentRef?: string;
  field?: string;
  message: string;
  suggestion?: string;
}

interface AutoFixData {
  componentRef: string;
  field: string;
  original: string;
  replacement: string;
  rule: string;
}

function ValidationTab({ log }: { log: Record<string, unknown> | null }): React.ReactElement {
  if (!log) {
    return (
      <p className="py-4 text-center text-[13px] text-[#6b6d80]">No validation data available.</p>
    );
  }
  const result = log.validationResult as
    | { warnings: ValidationWarningData[]; subType: string; autoFixes?: AutoFixData[] }
    | undefined;
  const autoFixes = result?.autoFixes ?? [];
  if (!result || (result.warnings.length === 0 && autoFixes.length === 0)) {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[13px] text-[#9496a8]">No validation issues detected</p>
      </div>
    );
  }
  const errors = result.warnings.filter((w) => w.severity === "error");
  const warnings = result.warnings.filter((w) => w.severity === "warning");
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-3 text-[12px] text-[#6b6d80]">
        <span>
          Sub-type: <span className="text-[#c8c9d4]">{result.subType}</span>
        </span>
        {errors.length > 0 && (
          <span className="text-red-400">
            {errors.length} error{errors.length !== 1 ? "s" : ""}
          </span>
        )}
        {warnings.length > 0 && (
          <span className="text-yellow-400">
            {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
          </span>
        )}
        {autoFixes.length > 0 && (
          <span className="text-emerald-400">
            {autoFixes.length} auto-fix{autoFixes.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>
      {autoFixes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold tracking-wider text-emerald-400/70 uppercase">
            Auto-Fixes Applied
          </h4>
          {autoFixes.map((f, i) => (
            <div
              key={`fix-${i}`}
              className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-3"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                  {f.rule}
                </span>
                <span
                  className="text-[11px] text-[#6b6d80]"
                  style={{ fontFamily: "var(--font-mono, monospace)" }}
                >
                  {f.componentRef}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-red-400/70 line-through">{f.original}</span>
                <span className="text-[#6b6d80]">&rarr;</span>
                <span className="text-emerald-400">{f.replacement}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {result.warnings.map((w, i) => (
          <div
            key={i}
            className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <SeverityBadge severity={w.severity} />
              {w.componentRef && (
                <span
                  className="text-[11px] text-[#6b6d80]"
                  style={{ fontFamily: "var(--font-mono, monospace)" }}
                >
                  {w.componentRef}
                </span>
              )}
            </div>
            <p className="text-[13px] leading-relaxed text-[#c8c9d4]">{w.message}</p>
            {w.suggestion && <p className="mt-1 text-[12px] text-[#6b6d80]">{w.suggestion}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const PERSONALITY_AXES = [
  "Minimal→Rich",
  "Playful→Serious",
  "Warm→Cool",
  "Light→Bold",
  "Classic→Modern",
  "Calm→Dynamic",
];

const COLOR_TOKEN_KEYS = [
  "colorPrimary",
  "colorPrimaryLight",
  "colorPrimaryDark",
  "colorSecondary",
  "colorSecondaryLight",
  "colorAccent",
  "colorBackground",
  "colorSurface",
  "colorSurfaceElevated",
  "colorText",
  "colorTextSecondary",
  "colorTextOnPrimary",
  "colorTextOnDark",
  "colorBorder",
  "colorBorderLight",
  "colorSuccess",
  "colorWarning",
  "colorError",
] as const;

function ColorSwatch({ color, label }: { color: string; label: string }): React.ReactElement {
  const isHex = color.startsWith("#");
  return (
    <div className="flex items-center gap-2 py-1">
      <div
        className="h-4 w-4 shrink-0 rounded border border-[rgba(255,255,255,0.1)]"
        style={{ backgroundColor: isHex ? color : undefined }}
      />
      <span className="w-28 shrink-0 text-[11px] text-[#6b6d80]">{label}</span>
      <span
        className="text-[12px] text-[#9496a8]"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {color}
      </span>
    </div>
  );
}

function TokenDiff({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2 py-0.5 text-[12px]">
      <span className="w-36 shrink-0 text-[11px] text-[#6b6d80]">{label}</span>
      <span
        className="text-red-400/60 line-through"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {before}
      </span>
      <span className="text-[#6b6d80]">&rarr;</span>
      <span className="text-emerald-400" style={{ fontFamily: "var(--font-mono, monospace)" }}>
        {after}
      </span>
    </div>
  );
}

function ThemeTab({ log }: { log: Record<string, unknown> | null }): React.ReactElement {
  if (!log) {
    return <p className="py-4 text-center text-[13px] text-[#6b6d80]">No theme data available.</p>;
  }

  const spec = log.specSnapshot as Record<string, unknown> | undefined;
  if (!spec) {
    return (
      <p className="py-4 text-center text-[13px] text-[#6b6d80]">
        No spec snapshot in pipeline log.
      </p>
    );
  }

  const pv = spec.personalityVector as number[] | undefined;
  const siteType = spec.siteType as string | undefined;
  const emotionalGoals = spec.emotionalGoals as string[] | undefined;
  const antiReferences = spec.antiReferences as string[] | undefined;

  if (!pv || pv.length !== 6) {
    return (
      <p className="py-4 text-center text-[13px] text-[#6b6d80]">Invalid personality vector.</p>
    );
  }

  // Generate base theme
  const baseTheme = generateThemeFromVector(pv as PersonalityVector, { businessType: siteType });

  // Apply emotional overrides if present
  let finalTheme = baseTheme;
  const overrideDiffs: { label: string; before: string; after: string }[] = [];
  if (emotionalGoals?.length) {
    finalTheme = applyEmotionalOverrides(baseTheme, emotionalGoals, antiReferences ?? []);
    // Compute diffs
    for (const key of Object.keys(baseTheme) as (keyof ThemeTokens)[]) {
      if (baseTheme[key] !== finalTheme[key]) {
        overrideDiffs.push({ label: key, before: baseTheme[key], after: finalTheme[key] });
      }
    }
  }

  // Dark mode info
  const lightBold = pv[3];
  const isDark =
    finalTheme.colorBackground.startsWith("#0") || finalTheme.colorBackground.startsWith("#1");

  return (
    <div className="space-y-4 p-4">
      {/* Personality Vector */}
      <div>
        <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Personality Vector
        </h4>
        <div className="space-y-1">
          {pv.map((val, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-32 shrink-0 text-[11px] text-[#6b6d80]">
                {PERSONALITY_AXES[i]}
              </span>
              <div className="relative h-2 flex-1 rounded-full bg-[rgba(255,255,255,0.06)]">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-[#e8a849]"
                  style={{ width: `${val * 100}%` }}
                />
              </div>
              <span
                className="w-8 text-right text-[11px] text-[#9496a8]"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dark/Light Mode */}
      <div>
        <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Mode Decision
        </h4>
        <div className="flex items-center gap-3 text-[12px]">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isDark ? "bg-indigo-500/15 text-indigo-400" : "bg-amber-500/15 text-amber-400"}`}
          >
            {isDark ? "Dark" : "Light"}
          </span>
          <span className="text-[#6b6d80]">lightBold={lightBold.toFixed(2)}</span>
          {siteType && <span className="text-[#6b6d80]">business={siteType}</span>}
        </div>
      </div>

      {/* Font Pairing */}
      <div>
        <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Font Pairing
        </h4>
        <KeyValue label="Heading" value={finalTheme.fontHeading} />
        <KeyValue label="Body" value={finalTheme.fontBody} />
        <KeyValue label="Accent" value={finalTheme.fontAccent} />
      </div>

      {/* Color Tokens */}
      <div>
        <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Color Tokens
        </h4>
        <div className="space-y-0.5">
          {COLOR_TOKEN_KEYS.map((key) => (
            <ColorSwatch key={key} color={finalTheme[key]} label={key.replace("color", "")} />
          ))}
        </div>
      </div>

      {/* Emotional Overrides */}
      {overrideDiffs.length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
            Emotional Overrides ({overrideDiffs.length} tokens changed)
          </h4>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {emotionalGoals?.map((g) => (
              <span
                key={g}
                className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold text-purple-400"
              >
                {g}
              </span>
            ))}
            {antiReferences?.map((a) => (
              <span
                key={a}
                className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="space-y-0.5">
            {overrideDiffs.map((d) => (
              <TokenDiff key={d.label} {...d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RawTab({ log }: { log: Record<string, unknown> | null }): React.ReactElement {
  if (!log) {
    return <p className="py-4 text-center text-[13px] text-[#6b6d80]">No raw data available.</p>;
  }
  const promptSent = log.promptSent as string | undefined;
  const rawAiResponse = log.rawAiResponse as string | undefined;
  return (
    <div className="space-y-4 p-4">
      <div>
        <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Prompt Sent
        </h4>
        <pre
          className="max-h-64 overflow-auto rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-3 text-[12px] leading-relaxed text-[#9496a8]"
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          {promptSent || "N/A (deterministic path)"}
        </pre>
      </div>
      <div>
        <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
          Raw AI Response
        </h4>
        <pre
          className="max-h-64 overflow-auto rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-3 text-[12px] leading-relaxed text-[#9496a8]"
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          {rawAiResponse || "N/A (deterministic path)"}
        </pre>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Score bar color helper
 * ──────────────────────────────────────────────────────────── */
function scoreColor(score: number): string {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 4) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreTextColor(score: number): string {
  if (score >= 7) return "text-emerald-400";
  if (score >= 4) return "text-yellow-400";
  return "text-red-400";
}

const DIMENSION_LABELS: Record<string, string> = {
  content_relevance: "Content Relevance",
  visual_character: "Visual Character",
  color_appropriateness: "Color Appropriateness",
  typography_fit: "Typography Fit",
  overall_cohesion: "Overall Cohesion",
};

interface DimensionScoreData {
  dimension: string;
  score: number;
  explanation: string;
  suggestedAdjustments: string[];
}

function VLMTab({
  sessionId,
  screenshotBase64,
  spec,
  onApplyAdjustments,
}: {
  sessionId: string;
  screenshotBase64?: string;
  spec?: SiteIntentDocument;
  onApplyAdjustments?: (adjustments: Record<string, string>) => void;
}): React.ReactElement {
  const [evaluating, setEvaluating] = useState(false);
  const [localResult, setLocalResult] = useState<{
    overallScore: number;
    dimensions: DimensionScoreData[];
    summary: string;
    themeAdjustments: Record<string, string>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useAction(api.ai.evaluateScreenshot.evaluateScreenshot);
  const savedEvaluation = useQuery(api.vlmEvaluations.getLatestEvaluation, { sessionId });

  // Use local result if available, otherwise fall back to saved
  const result = localResult ?? (savedEvaluation as typeof localResult | null | undefined) ?? null;

  const handleEvaluate = useCallback(async (): Promise<void> => {
    if (!screenshotBase64 || !spec || evaluating) return;
    setEvaluating(true);
    setError(null);
    try {
      const evaluation = await evaluate({
        sessionId,
        screenshotBase64,
        siteType: spec.siteType,
        businessName: spec.businessName,
        conversionGoal: spec.conversionGoal,
        personalityVector: spec.personalityVector,
        tagline: spec.tagline || undefined,
        emotionalGoals: spec.emotionalGoals,
        voiceProfile: spec.voiceProfile,
        brandArchetype: spec.brandArchetype,
        antiReferences: spec.antiReferences,
      });
      setLocalResult(evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setEvaluating(false);
    }
  }, [screenshotBase64, spec, evaluating, evaluate, sessionId]);

  // No screenshot yet
  if (!screenshotBase64) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Eye className="h-6 w-6 text-[#6b6d80]" />
        <p className="text-[13px] text-[#6b6d80]">
          Take a screenshot first using the toolbar button
        </p>
      </div>
    );
  }

  const adjustmentCount = result ? Object.keys(result.themeAdjustments).length : 0;

  return (
    <div className="space-y-4 p-4">
      {/* Evaluate button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => void handleEvaluate()}
          disabled={evaluating}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-[12px] font-semibold transition-colors ${
            evaluating
              ? "cursor-not-allowed bg-purple-500/10 text-purple-400/50"
              : "bg-purple-500/15 text-purple-400 hover:bg-purple-500/25"
          }`}
        >
          {evaluating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Sending to Claude Vision...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Evaluate Design
            </>
          )}
        </button>
        <span className="text-[10px] text-[#6b6d80]">~$0.03/evaluation</span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-[12px] text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Overall Score */}
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold ${scoreTextColor(result.overallScore)} bg-[rgba(255,255,255,0.04)]`}
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {result.overallScore.toFixed(1)}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#c8c9d4]">Overall Score</p>
              <p className="text-[11px] text-[#6b6d80]">Weighted average across 5 dimensions</p>
            </div>
          </div>

          {/* Dimension scores */}
          <div className="space-y-2.5">
            {result.dimensions.map((d: DimensionScoreData) => (
              <div
                key={d.dimension}
                className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#c8c9d4]">
                    {DIMENSION_LABELS[d.dimension] ?? d.dimension}
                  </span>
                  <span
                    className={`text-[13px] font-bold ${scoreTextColor(d.score)}`}
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {d.score}/10
                  </span>
                </div>
                {/* Score bar */}
                <div className="mb-2 h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.06)]">
                  <div
                    className={`h-full rounded-full transition-all ${scoreColor(d.score)}`}
                    style={{ width: `${d.score * 10}%` }}
                  />
                </div>
                <p className="text-[11px] leading-relaxed text-[#9496a8]">{d.explanation}</p>
                {d.suggestedAdjustments.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {d.suggestedAdjustments.map((adj, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-[#6b6d80] before:mr-1.5 before:content-['•']"
                      >
                        {adj}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <h4 className="mb-1 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
              Summary
            </h4>
            <p className="text-[12px] leading-relaxed text-[#c8c9d4]">{result.summary}</p>
          </div>

          {/* Apply Adjustments */}
          {adjustmentCount > 0 && onApplyAdjustments && (
            <div>
              <h4 className="mb-2 text-[11px] font-semibold tracking-wider text-[#6b6d80] uppercase">
                Suggested Theme Adjustments ({adjustmentCount})
              </h4>
              <div className="mb-3 space-y-0.5">
                {Object.entries(result.themeAdjustments).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 text-[11px]">
                    <span
                      className="w-36 shrink-0 text-[#6b6d80]"
                      style={{ fontFamily: "var(--font-mono, monospace)" }}
                    >
                      {key}
                    </span>
                    <span
                      className="text-[#c8c9d4]"
                      style={{ fontFamily: "var(--font-mono, monospace)" }}
                    >
                      {val}
                    </span>
                    {key.startsWith("color") && key !== "shadowColor" && (
                      <div
                        className="h-3 w-3 shrink-0 rounded border border-[rgba(255,255,255,0.1)]"
                        style={{ backgroundColor: val }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => onApplyAdjustments(result.themeAdjustments)}
                className="flex items-center gap-2 rounded-md bg-[#3ecfb4]/15 px-4 py-2 text-[12px] font-semibold text-[#3ecfb4] transition-colors hover:bg-[#3ecfb4]/25"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Apply Adjustments
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function DevPanel({
  sessionId,
  screenshotBase64,
  spec,
  onApplyAdjustments,
}: DevPanelProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");
  const [saveState, setSaveState] = useState<"idle" | "naming" | "saving" | "saved">("idle");
  const [testCaseName, setTestCaseName] = useState("");

  const pipelineLog = useQuery(api.pipelineLogs.getPipelineLog, { sessionId });
  const log = pipelineLog as Record<string, unknown> | null | undefined;
  const saveTestCase = useMutation(api.testCases.saveTestCase);

  const handleSaveTestCase = useCallback(async (): Promise<void> => {
    if (!log || !testCaseName.trim()) return;
    setSaveState("saving");
    try {
      const intake = log.intakeData as Record<string, unknown> | undefined;
      const spec = log.specSnapshot as Record<string, unknown> | undefined;
      const pv = spec?.personalityVector as number[] | undefined;
      await saveTestCase({
        name: testCaseName.trim(),
        intakeSnapshot: intake ?? {},
        specSnapshot: spec,
        personalityVector: pv,
        pipelineMethod: log.method as string | undefined,
        validationResult: log.validationResult as Record<string, unknown> | undefined,
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
      setTestCaseName("");
    } catch {
      setSaveState("idle");
    }
  }, [log, testCaseName, saveTestCase]);

  // Keyboard shortcut info
  useEffect(() => {
    if (log === undefined) return; // still loading
  }, [log]);

  const warningCount =
    (log?.validationResult as { warnings?: unknown[] } | undefined)?.warnings?.length ?? 0;

  return (
    <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] bg-[#0a0b0f]">
      {/* Header bar */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)]"
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-widest text-[#6b6d80] uppercase">
            Dev Panel
          </span>
          {log && <MethodBadge method={log.method as string} />}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[11px] font-semibold text-yellow-400">
              <AlertTriangle className="h-3 w-3" />
              {warningCount}
            </span>
          )}
          {log && (
            <span className="text-[11px] text-[#6b6d80]">{String(log.processingTimeMs)}ms</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Save as Test Case */}
          {log && saveState === "idle" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSaveState("naming");
              }}
              className="flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 text-[11px] font-medium text-[#6b6d80] transition-colors hover:border-[#e8a849]/30 hover:text-[#e8a849]"
              title="Save as test case"
            >
              <Save className="h-3 w-3" />
              Save Test Case
            </button>
          )}
          {saveState === "saved" && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
          {collapsed ? (
            <ChevronUp className="h-4 w-4 text-[#6b6d80]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#6b6d80]" />
          )}
        </div>
      </button>

      {/* Test case naming dialog */}
      {saveState === "naming" && (
        <div className="flex items-center gap-2 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5">
          <input
            type="text"
            value={testCaseName}
            onChange={(e) => setTestCaseName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && testCaseName.trim()) {
                void handleSaveTestCase();
              } else if (e.key === "Escape") {
                setSaveState("idle");
                setTestCaseName("");
              }
            }}
            placeholder="Test case name (e.g., LuxuryFine Mexican Restaurant)"
            className="flex-1 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-1.5 text-[12px] text-[#c8c9d4] placeholder-[#6b6d80] outline-none focus:border-[#e8a849]/40"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
            autoFocus
          />
          <button
            onClick={() => void handleSaveTestCase()}
            disabled={!testCaseName.trim()}
            className="rounded-md bg-[#e8a849] px-3 py-1.5 text-[11px] font-semibold text-[#0a0b0f] transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            Save
          </button>
          <button
            onClick={() => {
              setSaveState("idle");
              setTestCaseName("");
            }}
            className="text-[11px] text-[#6b6d80] hover:text-[#c8c9d4]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Collapsible content */}
      {!collapsed && (
        <div className="border-t border-[rgba(255,255,255,0.06)]">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-[rgba(255,255,255,0.06)]">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#e8a849] text-[#e8a849]"
                    : "text-[#6b6d80] hover:text-[#9496a8]"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "validation" && warningCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-500/15 px-1 text-[10px] font-bold text-yellow-400">
                    {warningCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="max-h-80 overflow-y-auto">
            {activeTab === "pipeline" && <PipelineTab log={log ?? null} />}
            {activeTab === "intake" && <IntakeTab log={log ?? null} />}
            {activeTab === "theme" && <ThemeTab log={log ?? null} />}
            {activeTab === "validation" && <ValidationTab log={log ?? null} />}
            {activeTab === "raw" && <RawTab log={log ?? null} />}
            {activeTab === "vlm" && (
              <VLMTab
                sessionId={sessionId}
                screenshotBase64={screenshotBase64}
                spec={spec}
                onApplyAdjustments={onApplyAdjustments}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

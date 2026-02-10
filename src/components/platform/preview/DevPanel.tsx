"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  ChevronDown,
  ChevronUp,
  Activity,
  ClipboardList,
  AlertTriangle,
  Code2,
} from "lucide-react";

interface DevPanelProps {
  sessionId: string;
}

type Tab = "pipeline" | "intake" | "validation" | "raw";

const TAB_CONFIG: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "pipeline", label: "Pipeline", icon: <Activity className="h-3.5 w-3.5" /> },
  { id: "intake", label: "Intake", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { id: "validation", label: "Validation", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: "raw", label: "Raw", icon: <Code2 className="h-3.5 w-3.5" /> },
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

function ValidationTab({ log }: { log: Record<string, unknown> | null }): React.ReactElement {
  if (!log) {
    return (
      <p className="py-4 text-center text-[13px] text-[#6b6d80]">No validation data available.</p>
    );
  }
  const result = log.validationResult as
    | { warnings: ValidationWarningData[]; subType: string }
    | undefined;
  if (!result || result.warnings.length === 0) {
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
      </div>
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

export function DevPanel({ sessionId }: DevPanelProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");

  const pipelineLog = useQuery(api.pipelineLogs.getPipelineLog, { sessionId });
  const log = pipelineLog as Record<string, unknown> | null | undefined;

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
        {collapsed ? (
          <ChevronUp className="h-4 w-4 text-[#6b6d80]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#6b6d80]" />
        )}
      </button>

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
            {activeTab === "validation" && <ValidationTab log={log ?? null} />}
            {activeTab === "raw" && <RawTab log={log ?? null} />}
          </div>
        </div>
      )}
    </div>
  );
}

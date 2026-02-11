"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  FlaskConical,
  Play,
  Trash2,
  Clock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface TestCaseRow {
  _id: Id<"testCases">;
  name: string;
  intakeSnapshot: Record<string, unknown>;
  specSnapshot?: Record<string, unknown>;
  personalityVector?: number[];
  pipelineMethod?: string;
  validationResult?: Record<string, unknown>;
  notes?: string;
  createdAt: number;
  lastRunAt?: number;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TestCaseCard({
  tc,
  onDelete,
  onRun,
  isRunning,
}: {
  tc: TestCaseRow;
  onDelete: (id: Id<"testCases">) => void;
  onRun: (tc: TestCaseRow) => void;
  isRunning: boolean;
}): React.ReactElement {
  const intake = tc.intakeSnapshot;
  const warningCount =
    (tc.validationResult as { warnings?: unknown[] } | undefined)?.warnings?.length ?? 0;

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0e13] p-5 transition-colors hover:border-[rgba(255,255,255,0.1)]">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3
            className="text-[15px] font-semibold text-[#e0e1e8]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {tc.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {typeof intake.siteType === "string" && (
              <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2.5 py-0.5 text-[11px] font-medium text-[#9496a8]">
                {intake.siteType}
              </span>
            )}
            {typeof intake.businessName === "string" && (
              <span className="text-[12px] text-[#6b6d80]">{intake.businessName}</span>
            )}
            {tc.pipelineMethod && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  tc.pipelineMethod === "ai"
                    ? "bg-purple-500/15 text-purple-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {tc.pipelineMethod === "ai" ? "AI" : "Deterministic"}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-yellow-400">
                <AlertTriangle className="h-3 w-3" />
                {warningCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRun(tc)}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[11px] font-medium text-[#e8a849] transition-colors hover:border-[#e8a849]/30 disabled:opacity-30"
            title="Re-run spec generation with this intake data"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Run
          </button>
          <button
            onClick={() => onDelete(tc._id)}
            className="rounded-lg p-1.5 text-[#6b6d80] transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Delete test case"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-4 text-[11px] text-[#6b6d80]">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Created {formatDate(tc.createdAt)}
        </span>
        {tc.lastRunAt && (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400/50" />
            Last run {formatDate(tc.lastRunAt)}
          </span>
        )}
      </div>

      {/* Emotional goals & anti-references if present */}
      {(Array.isArray(intake.emotionalGoals) || Array.isArray(intake.antiReferences)) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Array.isArray(intake.emotionalGoals) &&
            (intake.emotionalGoals as string[]).map((g) => (
              <span
                key={g}
                className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400"
              >
                {g}
              </span>
            ))}
          {Array.isArray(intake.antiReferences) &&
            (intake.antiReferences as string[]).map((a) => (
              <span
                key={a}
                className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400"
              >
                {a}
              </span>
            ))}
        </div>
      )}

      {/* Description preview */}
      {typeof intake.description === "string" && (
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#6b6d80]">
          {intake.description}
        </p>
      )}
    </div>
  );
}

function TestCasesContent(): React.ReactElement {
  const testCases = useQuery(api.testCases.listTestCases);
  const deleteTestCase = useMutation(api.testCases.deleteTestCase);
  const updateLastRun = useMutation(api.testCases.updateLastRun);
  const generateSiteSpec = useAction(api.ai.generateSiteSpec.generateSiteSpec);
  const [runningId, setRunningId] = useState<Id<"testCases"> | null>(null);
  const [lastRunResult, setLastRunResult] = useState<{
    testCaseId: Id<"testCases">;
    sessionId: string;
  } | null>(null);

  const handleDelete = async (id: Id<"testCases">): Promise<void> => {
    await deleteTestCase({ id });
  };

  const handleRun = async (tc: TestCaseRow): Promise<void> => {
    setRunningId(tc._id);
    try {
      const intake = tc.intakeSnapshot;
      const sessionId = `test-${tc._id}-${Date.now()}`;
      await generateSiteSpec({
        sessionId,
        siteType: (intake.siteType as string) || "business",
        goal: (intake.goal as string) || "leads",
        businessName: (intake.businessName as string) || "Test Business",
        description: (intake.description as string) || "",
        personality: (intake.personality as number[]) || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        aiResponses: (intake.aiResponses as Record<string, string>) || {},
        emotionalGoals: (intake.emotionalGoals as string[]) || [],
        voiceProfile: (intake.voiceProfile as string) || undefined,
        brandArchetype: (intake.brandArchetype as string) || undefined,
        antiReferences: (intake.antiReferences as string[]) || [],
        narrativePrompts: (intake.narrativePrompts as Record<string, string>) || undefined,
      });
      await updateLastRun({ id: tc._id });
      setLastRunResult({ testCaseId: tc._id, sessionId });
    } catch (err) {
      console.error("Test case run failed:", err);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d]">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0a0b0f]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/demo/preview"
              className="rounded-lg p-2 text-[#6b6d80] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#c8c9d4]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-[#e8a849]" />
              <h1
                className="text-lg font-bold text-[#e0e1e8]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Test Cases
              </h1>
            </div>
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2.5 py-0.5 text-[11px] font-medium text-[#6b6d80]">
              {testCases?.length ?? 0} saved
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Last run result banner */}
        {lastRunResult && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-[13px] font-medium text-emerald-400">Test case run complete</p>
                <p className="text-[11px] text-[#6b6d80]">Session: {lastRunResult.sessionId}</p>
              </div>
            </div>
            <Link
              href={`/demo/preview?session=${lastRunResult.sessionId}&dev=true`}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 transition-colors hover:bg-emerald-500/15"
            >
              <ExternalLink className="h-3 w-3" />
              View Preview
            </Link>
          </div>
        )}

        {/* Empty state */}
        {testCases && testCases.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <FlaskConical className="h-12 w-12 text-[#6b6d80]/30" />
            <h2 className="text-[15px] font-semibold text-[#6b6d80]">No test cases yet</h2>
            <p className="max-w-md text-center text-[13px] text-[#6b6d80]/70">
              Open a preview page with <code className="text-[#e8a849]">?dev=true</code> and click
              &quot;Save Test Case&quot; in the Dev Panel to save your first test case.
            </p>
          </div>
        )}

        {/* Test case list */}
        {testCases && testCases.length > 0 && (
          <div className="space-y-3">
            {(testCases as TestCaseRow[]).map((tc) => (
              <TestCaseCard
                key={tc._id}
                tc={tc}
                onDelete={(id) => void handleDelete(id)}
                onRun={(tc) => void handleRun(tc)}
                isRunning={runningId === tc._id}
              />
            ))}
          </div>
        )}

        {/* Loading state */}
        {testCases === undefined && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#6b6d80]" />
          </div>
        )}
      </div>
    </div>
  );
}

const TestCasesPage = dynamic(() => Promise.resolve({ default: TestCasesContent }), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-[#08090d]">
      <Loader2 className="h-8 w-8 animate-spin text-[#e8a849]" />
    </div>
  ),
});

export default TestCasesPage;

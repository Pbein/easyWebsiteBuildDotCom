/**
 * Tests for convex/pipelineLogs.ts handler logic.
 *
 * Replicates savePipelineLogInternal and getPipelineLog handler logic
 * and tests with a mock ctx.db.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/pipelineLogs.ts exactly)
// ---------------------------------------------------------------------------

async function savePipelineLogInternal(
  ctx: MockCtx,
  args: {
    sessionId: string;
    method: string;
    intakeData: unknown;
    promptSent?: string;
    rawAiResponse?: string;
    specSnapshot?: unknown;
    validationResult?: unknown;
    processingTimeMs: number;
    createdAt: number;
  }
): Promise<string> {
  // Note: unlike other handlers, this inserts args directly (createdAt is in args)
  return await ctx.db.insert("pipelineLogs", args);
}

async function getPipelineLog(ctx: MockCtx, args: { sessionId: string }): Promise<unknown | null> {
  const logs = await ctx.db
    .query("pipelineLogs")
    .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
    .order("desc")
    .take(1);
  return logs[0] ?? null;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeLogArgs(overrides: Partial<Parameters<typeof savePipelineLogInternal>[1]> = {}) {
  return {
    sessionId: "session-log-001",
    method: "ai",
    intakeData: { siteType: "restaurant", goal: "bookings" },
    promptSent: "Generate a restaurant website...",
    rawAiResponse: '{"pages": []}',
    specSnapshot: { pages: [] },
    validationResult: { valid: true, errors: [] },
    processingTimeMs: 3200,
    createdAt: Date.now(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("pipelineLogs handlers", () => {
  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  describe("savePipelineLogInternal", () => {
    it("inserts a document with all fields (createdAt from args, not Date.now)", async () => {
      const fixedTime = 1700000000000;
      const id = await savePipelineLogInternal(ctx, makeLogArgs({ createdAt: fixedTime }));
      const doc = await ctx.db.get(id);

      expect(doc).not.toBeNull();
      expect(doc!.sessionId).toBe("session-log-001");
      expect(doc!.method).toBe("ai");
      expect(doc!.processingTimeMs).toBe(3200);
      expect(doc!.createdAt).toBe(fixedTime);
      expect(doc!.promptSent).toBe("Generate a restaurant website...");
    });
  });

  describe("getPipelineLog", () => {
    it("returns null for an unknown sessionId", async () => {
      const result = await getPipelineLog(ctx, { sessionId: "nonexistent" });
      expect(result).toBeNull();
    });

    it("returns the most recent log for a sessionId", async () => {
      await savePipelineLogInternal(
        ctx,
        makeLogArgs({
          sessionId: "session-log-dup",
          method: "deterministic",
          processingTimeMs: 100,
        })
      );
      await savePipelineLogInternal(
        ctx,
        makeLogArgs({
          sessionId: "session-log-dup",
          method: "ai",
          processingTimeMs: 3500,
        })
      );

      const result = await getPipelineLog(ctx, {
        sessionId: "session-log-dup",
      });
      expect(result).not.toBeNull();
      // Ordered desc, so the most recent (second insert) comes first
      expect((result as Record<string, unknown>).method).toBe("ai");
      expect((result as Record<string, unknown>).processingTimeMs).toBe(3500);
    });
  });
});

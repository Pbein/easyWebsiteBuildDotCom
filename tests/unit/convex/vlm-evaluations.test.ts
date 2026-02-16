/**
 * Tests for convex/vlmEvaluations.ts handler logic.
 *
 * Replicates saveEvaluationInternal and getLatestEvaluation handler logic
 * and tests with a mock ctx.db.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/vlmEvaluations.ts exactly)
// ---------------------------------------------------------------------------

async function saveEvaluationInternal(
  ctx: MockCtx,
  args: {
    sessionId: string;
    overallScore: number;
    dimensions: unknown;
    summary: string;
    themeAdjustments: unknown;
    evaluatedAt: number;
  }
): Promise<string> {
  // Inserts args directly (no added createdAt)
  return await ctx.db.insert("vlmEvaluations", args);
}

async function getLatestEvaluation(
  ctx: MockCtx,
  args: { sessionId: string }
): Promise<unknown | null> {
  const results = await ctx.db
    .query("vlmEvaluations")
    .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
    .order("desc")
    .take(1);
  return results[0] ?? null;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeEvalArgs(overrides: Partial<Parameters<typeof saveEvaluationInternal>[1]> = {}) {
  return {
    sessionId: "session-vlm-001",
    overallScore: 7.5,
    dimensions: {
      typography: { score: 8, feedback: "Good hierarchy" },
      color: { score: 7, feedback: "Warm palette works well" },
      layout: { score: 8, feedback: "Clean spacing" },
      imagery: { score: 6, feedback: "Needs better placeholders" },
      branding: { score: 8, feedback: "Consistent identity" },
    },
    summary: "Overall strong design with room for imagery improvement",
    themeAdjustments: {
      spacingBase: "18px",
      borderRadiusBase: "12px",
    },
    evaluatedAt: 1700000000000,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("vlmEvaluations handlers", () => {
  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  describe("saveEvaluationInternal", () => {
    it("inserts a document with all fields (evaluatedAt from args)", async () => {
      const id = await saveEvaluationInternal(ctx, makeEvalArgs());
      const doc = await ctx.db.get(id);

      expect(doc).not.toBeNull();
      expect(doc!.sessionId).toBe("session-vlm-001");
      expect(doc!.overallScore).toBe(7.5);
      expect(doc!.summary).toBe("Overall strong design with room for imagery improvement");
      expect(doc!.evaluatedAt).toBe(1700000000000);
      expect((doc!.dimensions as Record<string, Record<string, unknown>>).typography.score).toBe(8);
    });
  });

  describe("getLatestEvaluation", () => {
    it("returns null for an unknown sessionId", async () => {
      const result = await getLatestEvaluation(ctx, {
        sessionId: "nonexistent",
      });
      expect(result).toBeNull();
    });

    it("returns the most recent evaluation for a sessionId", async () => {
      await saveEvaluationInternal(
        ctx,
        makeEvalArgs({
          sessionId: "session-vlm-dup",
          overallScore: 6.0,
          summary: "First pass",
        })
      );
      await saveEvaluationInternal(
        ctx,
        makeEvalArgs({
          sessionId: "session-vlm-dup",
          overallScore: 8.5,
          summary: "After adjustments",
        })
      );

      const result = await getLatestEvaluation(ctx, {
        sessionId: "session-vlm-dup",
      });
      expect(result).not.toBeNull();
      // Ordered desc, so the most recent (second insert) comes first
      expect((result as Record<string, unknown>).overallScore).toBe(8.5);
      expect((result as Record<string, unknown>).summary).toBe("After adjustments");
    });
  });
});

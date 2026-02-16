/**
 * Tests for convex/feedback.ts handler logic.
 *
 * Replicates saveFeedback and getFeedback handler logic
 * and tests with a mock ctx.db.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/feedback.ts exactly)
// ---------------------------------------------------------------------------

async function saveFeedback(
  ctx: MockCtx,
  args: {
    sessionId: string;
    rating: string;
    dimensions?: string[];
    freeText?: string;
  }
): Promise<string> {
  return await ctx.db.insert("feedback", {
    ...args,
    createdAt: Date.now(),
  });
}

async function getFeedback(ctx: MockCtx, args: { sessionId: string }): Promise<unknown | null> {
  const results = await ctx.db
    .query("feedback")
    .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
    .order("desc")
    .take(1);
  return results[0] ?? null;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("feedback handlers", () => {
  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  describe("saveFeedback", () => {
    it("inserts a document with all fields plus createdAt", async () => {
      const id = await saveFeedback(ctx, {
        sessionId: "session-fb-001",
        rating: "love-it",
        dimensions: ["design", "content"],
        freeText: "Great experience!",
      });
      const doc = await ctx.db.get(id);

      expect(doc).not.toBeNull();
      expect(doc!.sessionId).toBe("session-fb-001");
      expect(doc!.rating).toBe("love-it");
      expect(doc!.dimensions).toEqual(["design", "content"]);
      expect(doc!.freeText).toBe("Great experience!");
      expect(typeof doc!.createdAt).toBe("number");
    });

    it("returns a valid ID string", async () => {
      const id = await saveFeedback(ctx, {
        sessionId: "session-fb-002",
        rating: "needs-work",
      });
      expect(typeof id).toBe("string");
      expect(id).toContain("feedback:");
    });
  });

  describe("getFeedback", () => {
    it("returns null for an unknown sessionId", async () => {
      const result = await getFeedback(ctx, { sessionId: "nonexistent" });
      expect(result).toBeNull();
    });

    it("returns the most recent feedback for a sessionId", async () => {
      await saveFeedback(ctx, {
        sessionId: "session-fb-dup",
        rating: "ok",
      });
      await saveFeedback(ctx, {
        sessionId: "session-fb-dup",
        rating: "love-it",
      });

      const result = await getFeedback(ctx, { sessionId: "session-fb-dup" });
      expect(result).not.toBeNull();
      // Ordered desc, so the most recent (second insert) comes first
      expect((result as Record<string, unknown>).rating).toBe("love-it");
    });
  });
});

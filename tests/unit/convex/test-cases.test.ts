/**
 * Tests for convex/testCases.ts handler logic.
 *
 * Replicates saveTestCase, listTestCases, getTestCase, updateLastRun,
 * and deleteTestCase handler logic and tests with a mock ctx.db.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";
import { getSourceHash } from "../../helpers/convex-staleness";

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/testCases.ts exactly)
// ---------------------------------------------------------------------------

async function saveTestCase(
  ctx: MockCtx,
  args: {
    name: string;
    intakeSnapshot: unknown;
    specSnapshot?: unknown;
    personalityVector?: number[];
    pipelineMethod?: string;
    validationResult?: unknown;
    notes?: string;
  }
): Promise<string> {
  return await ctx.db.insert("testCases", {
    ...args,
    createdAt: Date.now(),
  });
}

async function listTestCases(ctx: MockCtx): Promise<unknown[]> {
  return await ctx.db.query("testCases").order("desc").collect();
}

async function getTestCase(ctx: MockCtx, args: { id: string }): Promise<unknown | null> {
  return await ctx.db.get(args.id);
}

async function updateLastRun(ctx: MockCtx, args: { id: string }): Promise<void> {
  await ctx.db.patch(args.id, { lastRunAt: Date.now() });
}

async function deleteTestCase(ctx: MockCtx, args: { id: string }): Promise<void> {
  await ctx.db.delete(args.id);
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeTestCaseArgs(overrides: Partial<Parameters<typeof saveTestCase>[1]> = {}) {
  return {
    name: "Restaurant booking flow",
    intakeSnapshot: {
      siteType: "restaurant",
      goal: "bookings",
      businessName: "The Golden Fork",
    },
    specSnapshot: { pages: [] },
    personalityVector: [0.8, 0.6, 0.4, 0.7, 0.5, 0.3],
    pipelineMethod: "ai",
    notes: "Test case for booking restaurants",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("testCases handlers", () => {
  // Staleness guard — if this fails, convex/testCases.ts was modified.
  // Update the replicated handler logic above to match the source, then update the hash.
  it("staleness guard — source file unchanged", () => {
    expect(getSourceHash("convex/testCases.ts")).toBe("e0f5bff6e2b31329");
  });

  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  describe("saveTestCase", () => {
    it("inserts a document with all fields plus createdAt", async () => {
      const id = await saveTestCase(ctx, makeTestCaseArgs());
      const doc = await ctx.db.get(id);

      expect(doc).not.toBeNull();
      expect(doc!.name).toBe("Restaurant booking flow");
      expect(doc!.intakeSnapshot).toEqual({
        siteType: "restaurant",
        goal: "bookings",
        businessName: "The Golden Fork",
      });
      expect(doc!.pipelineMethod).toBe("ai");
      expect(doc!.notes).toBe("Test case for booking restaurants");
      expect(typeof doc!.createdAt).toBe("number");
    });

    it("returns a valid ID string", async () => {
      const id = await saveTestCase(ctx, makeTestCaseArgs());
      expect(typeof id).toBe("string");
      expect(id).toContain("testCases:");
    });
  });

  describe("listTestCases", () => {
    it("returns an empty array when no test cases exist", async () => {
      const result = await listTestCases(ctx);
      expect(result).toEqual([]);
    });

    it("returns all test cases in descending creation order", async () => {
      await saveTestCase(ctx, makeTestCaseArgs({ name: "Case A" }));
      await saveTestCase(ctx, makeTestCaseArgs({ name: "Case B" }));
      await saveTestCase(ctx, makeTestCaseArgs({ name: "Case C" }));

      const result = await listTestCases(ctx);
      expect(result).toHaveLength(3);
      // Desc order: most recent first
      expect((result[0] as Record<string, unknown>).name).toBe("Case C");
      expect((result[1] as Record<string, unknown>).name).toBe("Case B");
      expect((result[2] as Record<string, unknown>).name).toBe("Case A");
    });
  });

  describe("getTestCase", () => {
    it("returns the document for a valid ID", async () => {
      const id = await saveTestCase(ctx, makeTestCaseArgs({ name: "Lookup test" }));
      const doc = await getTestCase(ctx, { id });

      expect(doc).not.toBeNull();
      expect((doc as Record<string, unknown>).name).toBe("Lookup test");
    });

    it("returns null for a non-existent ID", async () => {
      const doc = await getTestCase(ctx, { id: "testCases:999" });
      expect(doc).toBeNull();
    });
  });

  describe("updateLastRun", () => {
    it("patches lastRunAt on the specified test case", async () => {
      const id = await saveTestCase(ctx, makeTestCaseArgs());
      const before = await ctx.db.get(id);
      expect(before!.lastRunAt).toBeUndefined();

      await updateLastRun(ctx, { id });

      const after = await ctx.db.get(id);
      expect(typeof after!.lastRunAt).toBe("number");
      expect(after!.lastRunAt as number).toBeGreaterThan(0);
    });
  });

  describe("deleteTestCase", () => {
    it("removes the document from the database", async () => {
      const id = await saveTestCase(ctx, makeTestCaseArgs());
      expect(await ctx.db.get(id)).not.toBeNull();

      await deleteTestCase(ctx, { id });

      expect(await ctx.db.get(id)).toBeNull();
    });
  });
});

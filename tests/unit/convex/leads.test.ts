/**
 * Tests for convex/leads.ts handler logic.
 *
 * Replicates captureLead handler logic and tests with a mock ctx.db.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";
import { getSourceHash } from "../../helpers/convex-staleness";

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/leads.ts exactly)
// ---------------------------------------------------------------------------

async function captureLead(
  ctx: MockCtx,
  args: {
    email: string;
    sessionId?: string;
    source: string;
    siteType?: string;
    businessName?: string;
  }
): Promise<void> {
  // Deduplicate by email
  const existing = await ctx.db
    .query("leads")
    .withIndex("by_email", (q) => q.eq("email", args.email))
    .first();

  if (existing) return;

  await ctx.db.insert("leads", {
    email: args.email,
    sessionId: args.sessionId,
    source: args.source,
    siteType: args.siteType,
    businessName: args.businessName,
    createdAt: Date.now(),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

/**
 * @requirements
 * - [REQ-1]: Email leads are captured with deduplication by email (Source: convex/schema.ts by_email index)
 * - [REQ-2]: Duplicate emails are silently ignored, not errored (Source: product spec — user experience)
 * - [REQ-3]: All metadata fields (sessionId, source, siteType, businessName) are persisted (Source: convex/schema.ts leads table)
 * - [REQ-4]: createdAt timestamp is set automatically (Source: captureLead handler)
 */
describe("leads captureLead handler", () => {
  // Staleness guard — if this fails, convex/leads.ts was modified.
  // Update the replicated handler logic above to match the source, then update the hash.
  it("staleness guard — source file unchanged", () => {
    expect(getSourceHash("convex/leads.ts")).toBe("9053f217c6aa48ff");
  });

  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  describe("successful lead capture (Requirement)", () => {
    it("inserts a lead with all provided fields", async () => {
      await captureLead(ctx, {
        email: "test@example.com",
        sessionId: "session-001",
        source: "loading-screen",
        siteType: "restaurant",
        businessName: "Joe's Diner",
      });

      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(1);
      expect(docs[0].email).toBe("test@example.com");
      expect(docs[0].sessionId).toBe("session-001");
      expect(docs[0].source).toBe("loading-screen");
      expect(docs[0].siteType).toBe("restaurant");
      expect(docs[0].businessName).toBe("Joe's Diner");
    });

    it("sets createdAt as a numeric timestamp", async () => {
      const before = Date.now();
      await captureLead(ctx, {
        email: "time@example.com",
        source: "loading-screen",
      });
      const after = Date.now();

      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(1);
      const createdAt = docs[0].createdAt as number;
      expect(typeof createdAt).toBe("number");
      expect(createdAt).toBeGreaterThanOrEqual(before);
      expect(createdAt).toBeLessThanOrEqual(after);
    });

    it("allows optional fields to be undefined", async () => {
      await captureLead(ctx, {
        email: "minimal@example.com",
        source: "homepage",
      });

      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(1);
      expect(docs[0].sessionId).toBeUndefined();
      expect(docs[0].siteType).toBeUndefined();
      expect(docs[0].businessName).toBeUndefined();
    });
  });

  describe("email deduplication (Requirement)", () => {
    it("silently ignores duplicate email submissions", async () => {
      await captureLead(ctx, {
        email: "dupe@example.com",
        source: "loading-screen",
        businessName: "First Submission",
      });

      // Submit same email again with different metadata
      await captureLead(ctx, {
        email: "dupe@example.com",
        source: "homepage",
        businessName: "Second Submission",
      });

      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(1);
      // Should keep the FIRST submission's data
      expect(docs[0].businessName).toBe("First Submission");
      expect(docs[0].source).toBe("loading-screen");
    });

    it("does not throw on duplicate — dedup is silent", async () => {
      await captureLead(ctx, {
        email: "silent@example.com",
        source: "loading-screen",
      });

      // Should not throw
      await expect(
        captureLead(ctx, {
          email: "silent@example.com",
          source: "homepage",
        })
      ).resolves.toBeUndefined();
    });

    it("treats different emails as distinct leads", async () => {
      await captureLead(ctx, {
        email: "alice@example.com",
        source: "loading-screen",
      });
      await captureLead(ctx, {
        email: "bob@example.com",
        source: "loading-screen",
      });

      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(2);
    });
  });

  describe("boundary cases (Boundary)", () => {
    it("handles empty string email (schema validation would catch this in real Convex)", async () => {
      // In mock, this just inserts — real Convex validates via v.string()
      await captureLead(ctx, {
        email: "",
        source: "loading-screen",
      });

      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(1);
    });

    it("email dedup is case-sensitive (emails stored as-is)", async () => {
      await captureLead(ctx, {
        email: "Test@Example.com",
        source: "loading-screen",
      });
      await captureLead(ctx, {
        email: "test@example.com",
        source: "loading-screen",
      });

      // Both are inserted because dedup is exact-match
      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(2);
    });

    it("handles multiple different sources correctly", async () => {
      await captureLead(ctx, {
        email: "multi-source@example.com",
        source: "loading-screen",
      });

      // Same email from different source — should still be deduped
      await captureLead(ctx, {
        email: "multi-source@example.com",
        source: "homepage",
      });

      const docs = await ctx.db.query("leads").collect();
      expect(docs).toHaveLength(1);
    });
  });
});

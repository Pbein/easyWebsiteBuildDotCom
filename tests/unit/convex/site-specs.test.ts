/**
 * Tests for convex/siteSpecs.ts handler logic.
 *
 * Since Convex handlers run in a special runtime, we replicate the exact
 * handler logic as pure async functions and test them with a mock ctx.db.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";
import { getSourceHash } from "../../helpers/convex-staleness";

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/siteSpecs.ts exactly)
// ---------------------------------------------------------------------------

async function saveSiteSpec(
  ctx: MockCtx,
  args: {
    sessionId: string;
    siteType: string;
    conversionGoal: string;
    personalityVector: number[];
    businessName: string;
    tagline?: string;
    pages: unknown;
    metadata?: unknown;
    emotionalGoals?: string[];
    voiceProfile?: string;
    brandArchetype?: string;
    antiReferences?: string[];
    narrativePrompts?: unknown;
  }
): Promise<string> {
  return await ctx.db.insert("siteSpecs", {
    ...args,
    createdAt: Date.now(),
  });
}

async function getSiteSpec(ctx: MockCtx, args: { sessionId: string }): Promise<unknown | null> {
  const specs = await ctx.db
    .query("siteSpecs")
    .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
    .order("desc")
    .take(1);
  return specs[0] ?? null;
}

async function updateSiteSpecPages(
  ctx: MockCtx,
  args: { sessionId: string; pages: unknown }
): Promise<void> {
  const existing = await ctx.db
    .query("siteSpecs")
    .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
    .order("desc")
    .first();
  if (existing) {
    await ctx.db.patch(existing._id, { pages: args.pages });
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeSpecArgs(overrides: Partial<Parameters<typeof saveSiteSpec>[1]> = {}) {
  return {
    sessionId: "session-001",
    siteType: "restaurant",
    conversionGoal: "bookings",
    personalityVector: [0.8, 0.6, 0.4, 0.7, 0.5, 0.3],
    businessName: "The Golden Fork",
    tagline: "Fine dining, reimagined",
    pages: [{ name: "Home", components: [] }],
    metadata: { source: "test" },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("siteSpecs handlers", () => {
  // Staleness guard — if this fails, convex/siteSpecs.ts was modified.
  // Update the replicated handler logic above to match the source, then update the hash.
  it("staleness guard — source file unchanged", () => {
    expect(getSourceHash("convex/siteSpecs.ts")).toBe("baa20f51cf9262ef");
  });

  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  describe("saveSiteSpec", () => {
    it("inserts a document with all fields plus createdAt", async () => {
      const args = makeSpecArgs();
      const id = await saveSiteSpec(ctx, args);
      const doc = await ctx.db.get(id);

      expect(doc).not.toBeNull();
      expect(doc!.sessionId).toBe("session-001");
      expect(doc!.siteType).toBe("restaurant");
      expect(doc!.conversionGoal).toBe("bookings");
      expect(doc!.personalityVector).toEqual([0.8, 0.6, 0.4, 0.7, 0.5, 0.3]);
      expect(doc!.businessName).toBe("The Golden Fork");
      expect(doc!.tagline).toBe("Fine dining, reimagined");
      expect(doc!.pages).toEqual([{ name: "Home", components: [] }]);
      expect(doc!.metadata).toEqual({ source: "test" });
      expect(typeof doc!.createdAt).toBe("number");
      expect(doc!.createdAt).toBeGreaterThan(0);
    });

    it("returns a valid ID string", async () => {
      const id = await saveSiteSpec(ctx, makeSpecArgs());
      expect(typeof id).toBe("string");
      expect(id).toContain("siteSpecs:");
    });

    it("stores optional brand character fields", async () => {
      const id = await saveSiteSpec(
        ctx,
        makeSpecArgs({
          emotionalGoals: ["trustworthy", "welcoming"],
          voiceProfile: "warm",
          brandArchetype: "caregiver",
          antiReferences: ["corporate", "aggressive"],
          narrativePrompts: { origin: "Family recipe since 1920" },
        })
      );
      const doc = await ctx.db.get(id);

      expect(doc!.emotionalGoals).toEqual(["trustworthy", "welcoming"]);
      expect(doc!.voiceProfile).toBe("warm");
      expect(doc!.brandArchetype).toBe("caregiver");
      expect(doc!.antiReferences).toEqual(["corporate", "aggressive"]);
      expect(doc!.narrativePrompts).toEqual({ origin: "Family recipe since 1920" });
    });
  });

  describe("getSiteSpec", () => {
    it("returns null for an unknown sessionId", async () => {
      const result = await getSiteSpec(ctx, { sessionId: "nonexistent" });
      expect(result).toBeNull();
    });

    it("returns the document for a matching sessionId", async () => {
      await saveSiteSpec(ctx, makeSpecArgs({ sessionId: "session-abc" }));
      const result = await getSiteSpec(ctx, { sessionId: "session-abc" });
      expect(result).not.toBeNull();
      expect((result as Record<string, unknown>).sessionId).toBe("session-abc");
    });

    it("returns the most recent spec when multiple exist for the same sessionId", async () => {
      // Insert two specs for the same session
      await saveSiteSpec(ctx, makeSpecArgs({ sessionId: "session-dup", businessName: "First" }));
      // Small delay to ensure different _creationTime
      await saveSiteSpec(ctx, makeSpecArgs({ sessionId: "session-dup", businessName: "Second" }));

      const result = await getSiteSpec(ctx, { sessionId: "session-dup" });
      expect(result).not.toBeNull();
      // Ordered desc by _creationTime, so the second insert (most recent) should come first
      expect((result as Record<string, unknown>).businessName).toBe("Second");
    });

    it("does not return specs from other sessions", async () => {
      await saveSiteSpec(ctx, makeSpecArgs({ sessionId: "session-A" }));
      await saveSiteSpec(ctx, makeSpecArgs({ sessionId: "session-B" }));

      const result = await getSiteSpec(ctx, { sessionId: "session-A" });
      expect((result as Record<string, unknown>).sessionId).toBe("session-A");
    });
  });

  describe("updateSiteSpecPages", () => {
    it("patches the pages on the latest spec for a sessionId", async () => {
      const id = await saveSiteSpec(ctx, makeSpecArgs({ sessionId: "session-upd" }));
      const newPages = [
        { name: "Home", components: ["hero-centered"] },
        { name: "About", components: ["content-text"] },
      ];

      await updateSiteSpecPages(ctx, {
        sessionId: "session-upd",
        pages: newPages,
      });

      const doc = await ctx.db.get(id);
      expect(doc!.pages).toEqual(newPages);
    });

    it("is a no-op for an unknown sessionId (does not throw)", async () => {
      await expect(
        updateSiteSpecPages(ctx, {
          sessionId: "nonexistent",
          pages: [{ name: "Home", components: [] }],
        })
      ).resolves.toBeUndefined();
    });
  });
});

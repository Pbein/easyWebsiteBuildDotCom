/**
 * Tests for convex/sharedPreviews.ts handler logic.
 *
 * Replicates createShareLink, getSharedPreview, and incrementViewCount
 * handler logic and tests with a mock ctx.db.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";
import { getSourceHash } from "../../helpers/convex-staleness";

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/sharedPreviews.ts exactly)
// ---------------------------------------------------------------------------

async function createShareLink(
  ctx: MockCtx,
  args: {
    shareId: string;
    sessionId: string;
    customization: {
      activePresetId: string | null;
      primaryColorOverride: string | null;
      fontPairingId: string | null;
      contentOverrides: unknown;
      emotionalGoals?: string[] | null;
      voiceProfile?: string | null;
      brandArchetype?: string | null;
      antiReferences?: string[] | null;
    };
    businessName: string;
    tagline?: string;
    siteType: string;
    primaryColor: string;
  }
): Promise<string> {
  return await ctx.db.insert("sharedPreviews", {
    ...args,
    createdAt: Date.now(),
    viewCount: 0,
  });
}

async function getSharedPreview(ctx: MockCtx, args: { shareId: string }): Promise<unknown | null> {
  return await ctx.db
    .query("sharedPreviews")
    .withIndex("by_share_id", (q) => q.eq("shareId", args.shareId))
    .first();
}

async function incrementViewCount(ctx: MockCtx, args: { shareId: string }): Promise<void> {
  const preview = await ctx.db
    .query("sharedPreviews")
    .withIndex("by_share_id", (q) => q.eq("shareId", args.shareId))
    .first();
  if (preview) {
    await ctx.db.patch(preview._id, {
      viewCount: (preview.viewCount as number) + 1,
    });
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeShareArgs(overrides: Partial<Parameters<typeof createShareLink>[1]> = {}) {
  return {
    shareId: "abc123XYZw",
    sessionId: "session-001",
    customization: {
      activePresetId: "luxury-dark",
      primaryColorOverride: null,
      fontPairingId: null,
      contentOverrides: {},
    },
    businessName: "The Golden Fork",
    siteType: "restaurant",
    primaryColor: "#e8a849",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("sharedPreviews handlers", () => {
  // Staleness guard — if this fails, convex/sharedPreviews.ts was modified.
  // Update the replicated handler logic above to match the source, then update the hash.
  it("staleness guard — source file unchanged", () => {
    expect(getSourceHash("convex/sharedPreviews.ts")).toBe("db2e0feedef2f52e");
  });

  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  describe("createShareLink", () => {
    it("inserts a document with all fields, createdAt, and viewCount 0", async () => {
      const id = await createShareLink(ctx, makeShareArgs());
      const doc = await ctx.db.get(id);

      expect(doc).not.toBeNull();
      expect(doc!.shareId).toBe("abc123XYZw");
      expect(doc!.sessionId).toBe("session-001");
      expect(doc!.businessName).toBe("The Golden Fork");
      expect(doc!.siteType).toBe("restaurant");
      expect(doc!.primaryColor).toBe("#e8a849");
      expect(doc!.viewCount).toBe(0);
      expect(typeof doc!.createdAt).toBe("number");
      expect(doc!.createdAt).toBeGreaterThan(0);
      expect((doc!.customization as Record<string, unknown>).activePresetId).toBe("luxury-dark");
    });
  });

  describe("getSharedPreview", () => {
    it("returns null for an unknown shareId", async () => {
      const result = await getSharedPreview(ctx, { shareId: "nonexistent" });
      expect(result).toBeNull();
    });

    it("returns the correct preview for a known shareId", async () => {
      await createShareLink(ctx, makeShareArgs({ shareId: "share-A" }));
      await createShareLink(ctx, makeShareArgs({ shareId: "share-B" }));

      const result = await getSharedPreview(ctx, { shareId: "share-A" });
      expect(result).not.toBeNull();
      expect((result as Record<string, unknown>).shareId).toBe("share-A");
    });
  });

  describe("incrementViewCount", () => {
    it("increments viewCount from 0 to 1", async () => {
      const id = await createShareLink(ctx, makeShareArgs({ shareId: "count-test" }));

      await incrementViewCount(ctx, { shareId: "count-test" });

      const doc = await ctx.db.get(id);
      expect(doc!.viewCount).toBe(1);
    });

    it("increments viewCount from N to N+1 across multiple calls", async () => {
      const id = await createShareLink(ctx, makeShareArgs({ shareId: "multi-inc" }));

      await incrementViewCount(ctx, { shareId: "multi-inc" });
      await incrementViewCount(ctx, { shareId: "multi-inc" });
      await incrementViewCount(ctx, { shareId: "multi-inc" });

      const doc = await ctx.db.get(id);
      expect(doc!.viewCount).toBe(3);
    });

    it("is a no-op for an unknown shareId (does not throw)", async () => {
      await expect(incrementViewCount(ctx, { shareId: "nonexistent" })).resolves.toBeUndefined();
    });
  });
});

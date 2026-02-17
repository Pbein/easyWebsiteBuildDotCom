/**
 * Tests for convex/imageCache.ts handler logic.
 *
 * Replicates getCachedResults and saveCachedResults handler logic
 * and tests with a mock ctx.db. Uses vi.spyOn(Date, "now") to control
 * time for TTL expiration tests.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { createMockCtx, type MockCtx } from "../../helpers/mock-convex-db";
import { getSourceHash } from "../../helpers/convex-staleness";

// ---------------------------------------------------------------------------
// Constants (mirrors convex/imageCache.ts)
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------------------------------------------------------------------------
// Replicated handler logic (mirrors convex/imageCache.ts exactly)
// ---------------------------------------------------------------------------

async function getCachedResults(
  ctx: MockCtx,
  args: { queryHash: string }
): Promise<unknown | null> {
  const cached = await ctx.db
    .query("imageCache")
    .withIndex("by_query", (q) => q.eq("queryHash", args.queryHash))
    .first();

  if (!cached) return null;

  // Check TTL
  if (Date.now() > (cached.expiresAt as number)) {
    return null; // Expired — caller should refetch
  }

  return cached.results;
}

async function saveCachedResults(
  ctx: MockCtx,
  args: {
    queryHash: string;
    provider: string;
    query: string;
    orientation?: string;
    results: unknown;
  }
): Promise<void> {
  // Upsert: delete old entry if exists
  const existing = await ctx.db
    .query("imageCache")
    .withIndex("by_query", (q) => q.eq("queryHash", args.queryHash))
    .first();

  if (existing) {
    await ctx.db.delete(existing._id);
  }

  const now = Date.now();
  await ctx.db.insert("imageCache", {
    ...args,
    cachedAt: now,
    expiresAt: now + CACHE_TTL_MS,
  });
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeCacheArgs(overrides: Partial<Parameters<typeof saveCachedResults>[1]> = {}) {
  return {
    queryHash: "hash-abc123",
    provider: "unsplash",
    query: "restaurant interior",
    results: [
      { url: "https://images.unsplash.com/photo-1", alt: "Restaurant" },
      { url: "https://images.unsplash.com/photo-2", alt: "Interior" },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("imageCache handlers", () => {
  // Staleness guard — if this fails, convex/imageCache.ts was modified.
  // Update the replicated handler logic above to match the source, then update the hash.
  it("staleness guard — source file unchanged", () => {
    expect(getSourceHash("convex/imageCache.ts")).toBe("73286a212c17fa20");
  });

  let ctx: MockCtx;

  beforeEach(() => {
    ctx = createMockCtx();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getCachedResults", () => {
    it("returns null for an unknown queryHash", async () => {
      const result = await getCachedResults(ctx, { queryHash: "nonexistent" });
      expect(result).toBeNull();
    });

    it("returns results for a valid (non-expired) cache entry", async () => {
      const baseTime = 1700000000000;
      vi.spyOn(Date, "now").mockReturnValue(baseTime);

      await saveCachedResults(ctx, makeCacheArgs({ queryHash: "hash-valid" }));

      // Still within TTL (1 hour later)
      vi.spyOn(Date, "now").mockReturnValue(baseTime + 60 * 60 * 1000);

      const result = await getCachedResults(ctx, { queryHash: "hash-valid" });
      expect(result).not.toBeNull();
      expect(result).toEqual([
        { url: "https://images.unsplash.com/photo-1", alt: "Restaurant" },
        { url: "https://images.unsplash.com/photo-2", alt: "Interior" },
      ]);
    });

    it("returns null for an expired cache entry", async () => {
      const baseTime = 1700000000000;
      vi.spyOn(Date, "now").mockReturnValue(baseTime);

      await saveCachedResults(ctx, makeCacheArgs({ queryHash: "hash-expired" }));

      // 25 hours later — past the 24-hour TTL
      vi.spyOn(Date, "now").mockReturnValue(baseTime + 25 * 60 * 60 * 1000);

      const result = await getCachedResults(ctx, { queryHash: "hash-expired" });
      expect(result).toBeNull();
    });
  });

  describe("saveCachedResults", () => {
    it("creates a new entry with cachedAt and expiresAt", async () => {
      const baseTime = 1700000000000;
      vi.spyOn(Date, "now").mockReturnValue(baseTime);

      await saveCachedResults(ctx, makeCacheArgs({ queryHash: "hash-new" }));

      // Verify the stored document via a query
      const doc = await ctx.db
        .query("imageCache")
        .withIndex("by_query", (q) => q.eq("queryHash", "hash-new"))
        .first();

      expect(doc).not.toBeNull();
      expect(doc!.queryHash).toBe("hash-new");
      expect(doc!.provider).toBe("unsplash");
      expect(doc!.query).toBe("restaurant interior");
      expect(doc!.cachedAt).toBe(baseTime);
      expect(doc!.expiresAt).toBe(baseTime + CACHE_TTL_MS);
    });

    it("replaces an existing entry for the same queryHash (upsert)", async () => {
      const baseTime = 1700000000000;
      vi.spyOn(Date, "now").mockReturnValue(baseTime);

      await saveCachedResults(
        ctx,
        makeCacheArgs({
          queryHash: "hash-upsert",
          results: [{ url: "old-photo", alt: "Old" }],
        })
      );

      // Save again with new results
      vi.spyOn(Date, "now").mockReturnValue(baseTime + 1000);

      await saveCachedResults(
        ctx,
        makeCacheArgs({
          queryHash: "hash-upsert",
          results: [{ url: "new-photo", alt: "New" }],
        })
      );

      // Should only have one entry
      const allDocs = await ctx.db
        .query("imageCache")
        .withIndex("by_query", (q) => q.eq("queryHash", "hash-upsert"))
        .collect();

      expect(allDocs).toHaveLength(1);
      expect(allDocs[0].results).toEqual([{ url: "new-photo", alt: "New" }]);
      expect(allDocs[0].cachedAt).toBe(baseTime + 1000);
    });
  });
});

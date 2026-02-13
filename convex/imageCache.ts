import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const getCachedResults = internalQuery({
  args: { queryHash: v.string() },
  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query("imageCache")
      .withIndex("by_query", (q) => q.eq("queryHash", args.queryHash))
      .first();

    if (!cached) return null;

    // Check TTL
    if (Date.now() > cached.expiresAt) {
      return null; // Expired — caller should refetch
    }

    return cached.results;
  },
});

export const saveCachedResults = internalMutation({
  args: {
    queryHash: v.string(),
    provider: v.string(),
    query: v.string(),
    orientation: v.optional(v.string()),
    results: v.any(),
  },
  handler: async (ctx, args) => {
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
  },
});

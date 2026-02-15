import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createShareLink = mutation({
  args: {
    shareId: v.string(),
    sessionId: v.string(),
    customization: v.object({
      activePresetId: v.union(v.string(), v.null()),
      primaryColorOverride: v.union(v.string(), v.null()),
      fontPairingId: v.union(v.string(), v.null()),
      contentOverrides: v.any(),
    }),
    businessName: v.string(),
    tagline: v.optional(v.string()),
    siteType: v.string(),
    primaryColor: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sharedPreviews", {
      ...args,
      createdAt: Date.now(),
      viewCount: 0,
    });
  },
});

export const getSharedPreview = query({
  args: { shareId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sharedPreviews")
      .withIndex("by_share_id", (q) => q.eq("shareId", args.shareId))
      .first();
  },
});

export const incrementViewCount = mutation({
  args: { shareId: v.string() },
  handler: async (ctx, args) => {
    const preview = await ctx.db
      .query("sharedPreviews")
      .withIndex("by_share_id", (q) => q.eq("shareId", args.shareId))
      .first();
    if (preview) {
      await ctx.db.patch(preview._id, { viewCount: preview.viewCount + 1 });
    }
  },
});

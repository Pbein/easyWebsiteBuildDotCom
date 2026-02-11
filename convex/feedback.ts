import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveFeedback = mutation({
  args: {
    sessionId: v.string(),
    rating: v.string(),
    dimensions: v.optional(v.array(v.string())),
    freeText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedback", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getFeedback = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("feedback")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(1);
    return results[0] ?? null;
  },
});

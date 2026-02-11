import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveEvaluationInternal = internalMutation({
  args: {
    sessionId: v.string(),
    overallScore: v.float64(),
    dimensions: v.any(),
    summary: v.string(),
    themeAdjustments: v.any(),
    evaluatedAt: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vlmEvaluations", args);
  },
});

export const getLatestEvaluation = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("vlmEvaluations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(1);
    return results[0] ?? null;
  },
});

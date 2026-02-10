import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const savePipelineLogInternal = internalMutation({
  args: {
    sessionId: v.string(),
    method: v.string(),
    intakeData: v.any(),
    promptSent: v.optional(v.string()),
    rawAiResponse: v.optional(v.string()),
    specSnapshot: v.optional(v.any()),
    validationResult: v.optional(v.any()),
    processingTimeMs: v.number(),
    createdAt: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pipelineLogs", args);
  },
});

export const getPipelineLog = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("pipelineLogs")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(1);
    return logs[0] ?? null;
  },
});

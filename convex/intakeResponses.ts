import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveResponse = mutation({
  args: {
    sessionId: v.string(),
    step: v.number(),
    questionKey: v.string(),
    response: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("intakeResponses", {
      sessionId: args.sessionId,
      step: args.step,
      questionKey: args.questionKey,
      response: args.response,
      createdAt: Date.now(),
    });
  },
});

export const getBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("intakeResponses")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

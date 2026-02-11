import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveTestCase = mutation({
  args: {
    name: v.string(),
    intakeSnapshot: v.any(),
    specSnapshot: v.optional(v.any()),
    personalityVector: v.optional(v.array(v.float64())),
    pipelineMethod: v.optional(v.string()),
    validationResult: v.optional(v.any()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testCases", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listTestCases = query({
  handler: async (ctx) => {
    return await ctx.db.query("testCases").order("desc").collect();
  },
});

export const getTestCase = query({
  args: { id: v.id("testCases") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateLastRun = mutation({
  args: { id: v.id("testCases") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { lastRunAt: Date.now() });
  },
});

export const deleteTestCase = mutation({
  args: { id: v.id("testCases") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

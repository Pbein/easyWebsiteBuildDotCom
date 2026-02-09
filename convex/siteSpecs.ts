import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const saveSiteSpec = mutation({
  args: {
    sessionId: v.string(),
    siteType: v.string(),
    conversionGoal: v.string(),
    personalityVector: v.array(v.float64()),
    businessName: v.string(),
    tagline: v.optional(v.string()),
    pages: v.any(),
    metadata: v.optional(v.any()),
    emotionalGoals: v.optional(v.array(v.string())),
    voiceProfile: v.optional(v.string()),
    brandArchetype: v.optional(v.string()),
    antiReferences: v.optional(v.array(v.string())),
    narrativePrompts: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("siteSpecs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const saveSiteSpecInternal = internalMutation({
  args: {
    sessionId: v.string(),
    siteType: v.string(),
    conversionGoal: v.string(),
    personalityVector: v.array(v.float64()),
    businessName: v.string(),
    tagline: v.optional(v.string()),
    pages: v.any(),
    metadata: v.optional(v.any()),
    emotionalGoals: v.optional(v.array(v.string())),
    voiceProfile: v.optional(v.string()),
    brandArchetype: v.optional(v.string()),
    antiReferences: v.optional(v.array(v.string())),
    narrativePrompts: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("siteSpecs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getSiteSpec = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const specs = await ctx.db
      .query("siteSpecs")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(1);
    return specs[0] ?? null;
  },
});

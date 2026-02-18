import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Capture an email lead. Deduplicates by email — if the same email
 * already exists, silently succeeds without creating a duplicate.
 */
export const captureLead = mutation({
  args: {
    email: v.string(),
    sessionId: v.optional(v.string()),
    source: v.string(),
    siteType: v.optional(v.string()),
    businessName: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    // Deduplicate by email
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) return;

    await ctx.db.insert("leads", {
      email: args.email,
      sessionId: args.sessionId,
      source: args.source,
      siteType: args.siteType,
      businessName: args.businessName,
      createdAt: Date.now(),
    });
  },
});

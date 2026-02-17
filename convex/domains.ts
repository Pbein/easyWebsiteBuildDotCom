import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Add a domain record for a project.
 */
export const addDomain = mutation({
  args: {
    domain: v.string(),
    projectId: v.id("projects"),
    registrar: v.union(v.literal("vercel"), v.literal("external")),
    vercelDomainId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify project ownership
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Project not found or access denied");
    }

    // Check domain uniqueness
    const existing = await ctx.db
      .query("domains")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();

    if (existing) {
      throw new Error("Domain is already in use");
    }

    return await ctx.db.insert("domains", {
      domain: args.domain,
      projectId: args.projectId,
      userId: identity.subject,
      status: "pending",
      registrar: args.registrar,
      vercelDomainId: args.vercelDomainId,
      createdAt: Date.now(),
    });
  },
});

/**
 * Look up domain by hostname — used for custom domain routing.
 * Must be fast (indexed query).
 */
export const getDomainByHostname = query({
  args: { domain: v.string() },
  handler: async (ctx, { domain }) => {
    return await ctx.db
      .query("domains")
      .withIndex("by_domain", (q) => q.eq("domain", domain))
      .first();
  },
});

/**
 * Get all domains for the current user.
 */
export const getUserDomains = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("domains")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

/**
 * Update domain status — called after Vercel verification.
 */
export const updateDomainStatus = mutation({
  args: {
    domain: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("failed"),
      v.literal("expired")
    ),
    sslStatus: v.optional(v.string()),
  },
  handler: async (ctx, { domain, status, sslStatus }) => {
    const record = await ctx.db
      .query("domains")
      .withIndex("by_domain", (q) => q.eq("domain", domain))
      .first();

    if (!record) throw new Error("Domain record not found");

    const updates: Record<string, unknown> = { status };
    if (sslStatus !== undefined) updates.sslStatus = sslStatus;

    await ctx.db.patch(record._id, updates);
  },
});

/**
 * Delete a domain record.
 */
export const deleteDomain = mutation({
  args: { domain: v.string() },
  handler: async (ctx, { domain }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const record = await ctx.db
      .query("domains")
      .withIndex("by_domain", (q) => q.eq("domain", domain))
      .first();

    if (!record || record.userId !== identity.subject) {
      throw new Error("Domain not found or access denied");
    }

    await ctx.db.delete(record._id);
  },
});

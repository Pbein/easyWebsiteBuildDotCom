import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get or create a user from Clerk identity.
 * Called on sign-in — upserts by clerkId using ctx.auth.getUserIdentity().
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Check for existing user
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existing) {
      // Update last login + any changed profile fields
      await ctx.db.patch(existing._id, {
        lastLoginAt: Date.now(),
        email: identity.email ?? existing.email,
        name: identity.name ?? existing.name,
      });
      return existing._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId,
      email: identity.email ?? undefined,
      name: identity.name ?? undefined,
      plan: "free",
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });
  },
});

/**
 * Get the current authenticated user's record.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

/**
 * Get user by Clerk ID — used for subscription checks and webhooks.
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

/**
 * Update subscription data — called by Stripe webhook handler.
 */
export const updateSubscription = mutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
    stripeCustomerId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(
      v.union(
        v.literal("active"),
        v.literal("past_due"),
        v.literal("canceled"),
        v.literal("incomplete"),
        v.literal("trialing")
      )
    ),
    currentPeriodEnd: v.optional(v.number()),
    ownItPurchased: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...updates } = args;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error(`User not found for clerkId: ${clerkId}`);
    }

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});

/**
 * Get user by Stripe customer ID — used for webhook correlation.
 */
export const getUserByStripeCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_stripe_customer", (q) => q.eq("stripeCustomerId", stripeCustomerId))
      .first();
  },
});

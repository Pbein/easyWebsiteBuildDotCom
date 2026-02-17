import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all projects for the current authenticated user.
 */
export const getUserProjects = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return projects;
  },
});

/**
 * Get a single project by ID — validates ownership.
 */
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== identity.subject) return null;

    return project;
  },
});

/**
 * Create a new project from a generated site spec.
 * Called after site generation when user clicks "Save to My Projects".
 */
export const createProject = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    siteType: v.string(),
    tagline: v.optional(v.string()),
    customization: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      siteType: args.siteType,
      tagline: args.tagline,
      sessionId: args.sessionId,
      customization: args.customization,
      userId: identity.subject,
      status: "preview",
      publishStatus: "draft",
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

/**
 * Update a project's editable fields.
 */
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    customization: v.optional(v.any()),
    tagline: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Project not found or access denied");
    }

    const filteredUpdates: Record<string, unknown> = { updatedAt: Date.now() };
    if (updates.name !== undefined) filteredUpdates.name = updates.name;
    if (updates.customization !== undefined) filteredUpdates.customization = updates.customization;
    if (updates.tagline !== undefined) filteredUpdates.tagline = updates.tagline;

    await ctx.db.patch(projectId, filteredUpdates);
    return projectId;
  },
});

/**
 * Delete a project (hard delete).
 */
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Project not found or access denied");
    }

    await ctx.db.delete(projectId);
  },
});

/**
 * Mark a project as published with a custom domain.
 */
export const publishProject = mutation({
  args: {
    projectId: v.id("projects"),
    domain: v.string(),
  },
  handler: async (ctx, { projectId, domain }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Project not found or access denied");
    }

    await ctx.db.patch(projectId, {
      publishStatus: "published",
      publishedDomain: domain,
      status: "deployed",
      updatedAt: Date.now(),
    });
  },
});

/**
 * Unpublish a project — revert to draft.
 */
export const unpublishProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Project not found or access denied");
    }

    await ctx.db.patch(projectId, {
      publishStatus: "draft",
      publishedDomain: undefined,
      status: "preview",
      updatedAt: Date.now(),
    });
  },
});

/**
 * Check if the current user already has a project for this session.
 */
export const getProjectBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const project = await ctx.db
      .query("projects")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!project || project.userId !== identity.subject) return null;
    return project;
  },
});

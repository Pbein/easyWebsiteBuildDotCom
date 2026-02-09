import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    siteType: v.string(),
    industry: v.optional(v.string()),
    status: v.union(
      v.literal("intake"),
      v.literal("assembling"),
      v.literal("preview"),
      v.literal("approved"),
      v.literal("deployed")
    ),
    siteIntentDocument: v.optional(v.any()),
    userId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  siteSpecs: defineTable({
    sessionId: v.string(),
    siteType: v.string(),
    conversionGoal: v.string(),
    personalityVector: v.array(v.float64()),
    businessName: v.string(),
    tagline: v.optional(v.string()),
    pages: v.any(),
    metadata: v.optional(v.any()),
    createdAt: v.float64(),
  }).index("by_session", ["sessionId"]),

  intakeResponses: defineTable({
    projectId: v.optional(v.id("projects")),
    sessionId: v.string(),
    step: v.number(),
    questionKey: v.string(),
    response: v.any(),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),

  intentPaths: defineTable({
    step: v.string(),
    question: v.string(),
    inputType: v.union(v.literal("deterministic"), v.literal("ai_interpreted")),
    userInput: v.string(),
    interpretation: v.string(),
    resultingDecisions: v.optional(v.any()),
    embedding: v.optional(v.array(v.float64())),
    usageCount: v.number(),
    confirmationCount: v.number(),
    confirmationRate: v.number(),
    status: v.union(v.literal("candidate"), v.literal("proven"), v.literal("deprecated")),
    parentPathId: v.optional(v.id("intentPaths")),
    createdAt: v.number(),
    promotedAt: v.optional(v.number()),
    lastUsedAt: v.number(),
  }).index("by_step", ["step", "status"]),

  components: defineTable({
    componentId: v.string(),
    category: v.string(),
    name: v.string(),
    description: v.string(),
    siteTypes: v.array(v.string()),
    personalityFit: v.optional(v.any()),
    requiredProps: v.optional(v.array(v.any())),
    optionalProps: v.optional(v.array(v.any())),
    consumedTokens: v.optional(v.array(v.string())),
    variants: v.optional(v.array(v.any())),
    usageCount: v.number(),
    averageApprovalRate: v.number(),
    tags: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_category", ["category"]),

  themes: defineTable({
    name: v.string(),
    personalityVector: v.array(v.float64()),
    tokens: v.any(),
    presetBase: v.optional(v.string()),
    overrides: v.optional(v.any()),
    industries: v.optional(v.array(v.string())),
    usageCount: v.number(),
    approvalRate: v.number(),
    screenshots: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }),

  assets: defineTable({
    type: v.union(
      v.literal("image"),
      v.literal("icon"),
      v.literal("illustration"),
      v.literal("pattern"),
      v.literal("animation")
    ),
    tags: v.array(v.string()),
    industries: v.optional(v.array(v.string())),
    personalityFit: v.optional(v.array(v.float64())),
    usageCount: v.number(),
    projects: v.optional(v.array(v.string())),
    fileRef: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }),

  recipes: defineTable({
    name: v.string(),
    componentId: v.string(),
    variant: v.string(),
    configuration: v.optional(v.any()),
    contentStructure: v.optional(v.any()),
    context: v.optional(v.any()),
    approvalCount: v.number(),
    lastUsed: v.number(),
    tags: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_component", ["componentId"]),

  users: defineTable({
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    plan: v.optional(
      v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("enterprise"))
    ),
    projectIds: v.optional(v.array(v.id("projects"))),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  }),
});

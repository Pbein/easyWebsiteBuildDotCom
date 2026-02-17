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
    /** Session ID linking to siteSpecs table */
    sessionId: v.optional(v.string()),
    /** Customization snapshot from customization store */
    customization: v.optional(v.any()),
    /** Custom domain when published */
    publishedDomain: v.optional(v.string()),
    /** Publish lifecycle status */
    publishStatus: v.optional(
      v.union(v.literal("draft"), v.literal("published"), v.literal("suspended"))
    ),
    /** Tagline for display on dashboard cards */
    tagline: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  siteSpecs: defineTable({
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

  pipelineLogs: defineTable({
    sessionId: v.string(),
    method: v.string(),
    intakeData: v.any(),
    promptSent: v.optional(v.string()),
    rawAiResponse: v.optional(v.string()),
    specSnapshot: v.optional(v.any()),
    validationResult: v.optional(v.any()),
    processingTimeMs: v.number(),
    createdAt: v.float64(),
  }).index("by_session", ["sessionId"]),

  feedback: defineTable({
    sessionId: v.string(),
    rating: v.string(),
    dimensions: v.optional(v.array(v.string())),
    freeText: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_session", ["sessionId"]),

  vlmEvaluations: defineTable({
    sessionId: v.string(),
    overallScore: v.float64(),
    dimensions: v.any(),
    summary: v.string(),
    themeAdjustments: v.any(),
    evaluatedAt: v.float64(),
  }).index("by_session", ["sessionId"]),

  testCases: defineTable({
    name: v.string(),
    intakeSnapshot: v.any(),
    specSnapshot: v.optional(v.any()),
    personalityVector: v.optional(v.array(v.float64())),
    pipelineMethod: v.optional(v.string()),
    validationResult: v.optional(v.any()),
    notes: v.optional(v.string()),
    createdAt: v.float64(),
    lastRunAt: v.optional(v.float64()),
  }).index("by_name", ["name"]),

  imageCache: defineTable({
    queryHash: v.string(),
    provider: v.string(),
    query: v.string(),
    orientation: v.optional(v.string()),
    results: v.any(), // StockPhoto[]
    cachedAt: v.float64(),
    expiresAt: v.float64(), // 24hr TTL
  }).index("by_query", ["queryHash"]),

  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
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
    /** One-time purchase: "own_it" tier was purchased */
    ownItPurchased: v.optional(v.boolean()),
    projectIds: v.optional(v.array(v.id("projects"))),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  domains: defineTable({
    /** Full domain name, e.g. "highclassspa.com" */
    domain: v.string(),
    projectId: v.id("projects"),
    /** Clerk userId of owner */
    userId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("failed"),
      v.literal("expired")
    ),
    /** How domain was obtained */
    registrar: v.union(v.literal("vercel"), v.literal("external")),
    /** Vercel API reference ID */
    vercelDomainId: v.optional(v.string()),
    sslStatus: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_domain", ["domain"])
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"]),

  chatCredits: defineTable({
    /** Clerk userId */
    userId: v.string(),
    /** Messages used this billing period */
    messagesUsed: v.number(),
    /** When this period started (reset on subscription renewal) */
    periodStart: v.number(),
  }).index("by_user", ["userId"]),

  sharedPreviews: defineTable({
    shareId: v.string(),
    sessionId: v.string(),
    customization: v.object({
      activePresetId: v.union(v.string(), v.null()),
      primaryColorOverride: v.union(v.string(), v.null()),
      fontPairingId: v.union(v.string(), v.null()),
      contentOverrides: v.any(),
      emotionalGoals: v.optional(v.union(v.array(v.string()), v.null())),
      voiceProfile: v.optional(v.union(v.string(), v.null())),
      brandArchetype: v.optional(v.union(v.string(), v.null())),
      antiReferences: v.optional(v.union(v.array(v.string()), v.null())),
    }),
    businessName: v.string(),
    tagline: v.optional(v.string()),
    siteType: v.string(),
    primaryColor: v.string(),
    createdAt: v.float64(),
    viewCount: v.number(),
  }).index("by_share_id", ["shareId"]),
});

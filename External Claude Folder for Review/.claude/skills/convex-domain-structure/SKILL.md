---
name: convex-domain-structure
description: Enforces consistent Convex domain folder structure. Auto-applies when creating new domain folders in packages/convex/.
allowed-tools:
  - Read
  - Glob
  - Bash
  - Edit
---

# Convex Domain Structure

This skill ensures consistent organization of Convex backend domains.

## Standard Domain Structure

Every domain folder should follow this pattern:

```
packages/convex/{domain}/
├── queries.ts          # Public orgQuery-wrapped reads
├── mutations.ts        # Public orgMutation-wrapped writes
├── actions.ts          # External API calls (Twilio, Stripe, etc.)
├── internal.ts         # Internal functions (webhook handlers, scheduled jobs)
├── helpers/
│   ├── queries.ts      # Pure query helper functions
│   ├── mutations.ts    # Pure mutation helper functions
│   └── execution.ts    # Business logic execution
├── validators.ts       # Convex v-validators
├── types.ts            # TypeScript type definitions
└── __tests__/
    ├── functionality.test.ts      # Core functionality tests
    ├── security-wrappers.test.ts  # Security wrapper tests
    └── queries.security.test.ts   # Cross-tenant isolation tests
```

## File Purposes

### queries.ts - Public Reads

```typescript
import { v } from "convex/values";

import { orgQuery } from "../lib/orgWrappers";

/**
 * List all items for an organization
 */
export const listItems = orgQuery({
  args: {
    organizationId: v.id("organizations"),
    limit: v.optional(v.number()),
  },
  handler: async ({ db }, args) => {
    return await db
      .query("items")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .take(args.limit ?? 50);
  },
});
```

### mutations.ts - Public Writes

```typescript
import { v } from "convex/values";

import { orgMutation } from "../lib/orgWrappers";

/**
 * Create a new item
 */
export const createItem = orgMutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
  },
  handler: async ({ db, user }, args) => {
    return await db.insert("items", {
      ...args,
      createdBy: user._id,
      createdAt: Date.now(),
    });
  },
});
```

### actions.ts - External APIs

```typescript
import { v } from "convex/values";

import { orgAction } from "../lib/orgWrappers";

/**
 * Call external API (runs in Node.js runtime)
 */
export const syncWithExternalService = orgAction({
  args: {
    organizationId: v.id("organizations"),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    // External API calls go here
    const response = await fetch("https://api.external.com/...");
    return await response.json();
  },
});
```

### internal.ts - Internal Functions

```typescript
import { v } from "convex/values";

import { internalMutation, internalQuery } from "../_generated/server";

/**
 * Called by webhook handlers or scheduled jobs
 * NOT directly accessible from client
 */
export const updateFromWebhook = internalMutation({
  args: {
    externalId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // No auth check needed - only callable internally
    const item = await ctx.db
      .query("items")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.externalId))
      .first();

    if (item) {
      await ctx.db.patch(item._id, { status: args.status });
    }
  },
});
```

### helpers/ - Pure Business Logic

```typescript
// helpers/mutations.ts
import type { MutationCtx } from "../../_generated/server";

/**
 * Pure function - no auth, just business logic
 * Called by mutations.ts after auth is verified
 */
export async function createItemHelper(
  ctx: MutationCtx,
  args: { organizationId: Id<"organizations">; name: string; userId: Id<"users"> }
) {
  // Validation
  if (!args.name.trim()) {
    throw new ConvexError({ code: "INVALID_INPUT", message: "Name required" });
  }

  // Business logic
  return await ctx.db.insert("items", {
    ...args,
    createdAt: Date.now(),
  });
}
```

## Critical Rules

### 1. Security Wrapper Usage

| File           | Wrapper            | Purpose                 |
| -------------- | ------------------ | ----------------------- |
| `queries.ts`   | `orgQuery`         | Public reads with auth  |
| `mutations.ts` | `orgMutation`      | Public writes with auth |
| `actions.ts`   | `orgAction`        | External APIs with auth |
| `internal.ts`  | `internalMutation` | Internal only, no auth  |

### 2. Index Usage

Always use indexes for organization-scoped queries:

```typescript
// CORRECT - Uses index
.withIndex("by_organization", q => q.eq("organizationId", args.organizationId))

// WRONG - Full table scan
.filter(q => q.eq(q.field("organizationId"), args.organizationId))
```

### 3. Test Organization

Every domain needs security tests:

```typescript
// __tests__/security-wrappers.test.ts
describe("Security", () => {
  it("rejects unauthenticated access", async () => {
    // Test that queries/mutations reject without auth
  });

  it("prevents cross-tenant access", async () => {
    // Test that org A cannot access org B data
  });
});
```

## Creating a New Domain

```bash
# 1. Create domain folder
mkdir -p packages/convex/{domain}
mkdir -p packages/convex/{domain}/helpers
mkdir -p packages/convex/{domain}/__tests__

# 2. Create standard files
touch packages/convex/{domain}/queries.ts
touch packages/convex/{domain}/mutations.ts
touch packages/convex/{domain}/actions.ts
touch packages/convex/{domain}/internal.ts
touch packages/convex/{domain}/helpers/mutations.ts
touch packages/convex/{domain}/validators.ts
touch packages/convex/{domain}/__tests__/functionality.test.ts
touch packages/convex/{domain}/__tests__/security-wrappers.test.ts
```

## Validation Checklist

Before completing domain work:

- [ ] All public queries use `orgQuery`?
- [ ] All public mutations use `orgMutation`?
- [ ] All actions use `orgAction`?
- [ ] Webhook handlers use `internalMutation`?
- [ ] Queries use indexes (not filters)?
- [ ] Security tests exist in `__tests__/`?
- [ ] Pure business logic extracted to `helpers/`?

## Reference Files

- **Example domain**: `packages/convex/campaigns/`
- **Security wrappers**: `packages/convex/lib/orgWrappers.ts`
- **Security tests**: `packages/convex/campaigns/__tests__/security-wrappers.test.ts`

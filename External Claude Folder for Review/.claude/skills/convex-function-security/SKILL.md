---
name: convex-function-security
description: Enforces multi-tenant security wrappers for all Convex functions. Auto-applies when creating or editing Convex function files in packages/convex/.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Edit
---

# Convex Function Security

This skill ensures all Convex functions use proper security wrappers to prevent cross-tenant data leaks.

## Critical Rules

### 1. ALWAYS Use Security Wrappers

```typescript
// WRONG - Never use bare wrappers (SECURITY VULNERABILITY!)
export const listContacts = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.query("contacts")...  // NO AUTH CHECK!
  }
});

// CORRECT - Use orgQuery wrapper
import { orgQuery } from "../lib/orgWrappers";

export const listContacts = orgQuery({
  args: { organizationId: v.id("organizations") },
  handler: async ({ db, user, membership }, args) => {
    // User access ALREADY verified by wrapper!
    return await db.query("contacts")
      .withIndex("by_organization", q => q.eq("organizationId", args.organizationId))
      .collect();
  }
});
```

### 2. Wrapper Selection Guide

| Use Case                       | Wrapper            | Import                        |
| ------------------------------ | ------------------ | ----------------------------- |
| Read org data                  | `orgQuery`         | `from "../lib/orgWrappers"`   |
| Write org data                 | `orgMutation`      | `from "../lib/orgWrappers"`   |
| External APIs (Twilio, Stripe) | `orgAction`        | `from "../lib/orgWrappers"`   |
| Webhook handlers               | `internalMutation` | `from "../_generated/server"` |
| Public form submissions        | `publicMutation`   | `from "../lib/orgWrappers"`   |
| Admin-only functions           | `adminMutation`    | `from "../lib/orgWrappers"`   |

### 3. Handler Context

The wrapper provides verified context:

```typescript
export const updateContact = orgMutation({
  args: {
    organizationId: v.id("organizations"),
    contactId: v.id("contacts"),
    name: v.string(),
  },
  handler: async ({ db, user, membership }, args) => {
    // ✅ db = database context
    // ✅ user = verified current user (Doc<"users">)
    // ✅ membership = verified org membership (Doc<"organizationMemberships">)

    return await db.patch(args.contactId, { name: args.name });
  },
});
```

### 4. Premium Feature Gating

Gate premium features with `requirePayment: true`:

```typescript
export const sendCampaign = orgMutation({
  args: { organizationId: v.id("organizations"), campaignId: v.id("campaigns") },
  requirePayment: true, // Throws PAYMENT_REQUIRED if org not paid
  handler: async ({ db, user, membership }, args) => {
    // Only paid orgs reach here
  },
});
```

**Features requiring `requirePayment: true`:**

- `sendCampaign` / `scheduleAICampaign`
- A2P registration
- SMS AI Agent conversations
- Advanced analytics

### 5. Billing Operations

Allow billing ops even for restricted orgs:

```typescript
export const updatePaymentMethod = orgMutation({
  args: { organizationId: v.id("organizations"), paymentMethodId: v.string() },
  bypassOrgStatus: true, // Users can always fix billing
  handler: async ({ db, user, membership }, args) => {
    // Works even if org is past_due or suspended
  },
});
```

### 6. Defense in Depth

Even with wrappers, verify resource ownership:

```typescript
export const updateContact = orgMutation({
  args: {
    organizationId: v.id("organizations"),
    contactId: v.id("contacts"),
    name: v.string(),
  },
  handler: async ({ db, user, membership }, args) => {
    // Double-check contact belongs to org (defense in depth)
    const contact = await db.get(args.contactId);
    if (!contact || contact.organizationId !== args.organizationId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Contact not found" });
    }

    return await db.patch(args.contactId, { name: args.name });
  },
});
```

## Validation Checklist

Before completing any Convex function work:

- [ ] Using `orgQuery`/`orgMutation`/`orgAction` wrapper? (NOT bare `query`/`mutation`)
- [ ] Includes `organizationId: v.id("organizations")` in args?
- [ ] Handler destructures `{ db, user, membership }` from context?
- [ ] Resource ownership verified (defense in depth)?
- [ ] Premium feature? Added `requirePayment: true`?
- [ ] Billing operation? Added `bypassOrgStatus: true`?
- [ ] Security test exists in `__tests__/` folder?

## Reference Files

- **Wrapper implementation**: `packages/convex/lib/orgWrappers.ts`
- **RBAC functions**: `packages/convex/rbac.ts`
- **Billing checks**: `packages/convex/lib/billing.ts`
- **Security tests**: `packages/convex/lib/__tests__/orgWrappers.security.test.ts`

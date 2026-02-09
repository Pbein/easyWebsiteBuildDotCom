---
name: billing-accuracy
description: Ensures billing calculations, usage tracking, and Stripe integration are accurate. Auto-applies when working on billing, payment, or usage tracking code.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Edit
---

# Billing Accuracy

This skill ensures revenue-critical billing code is accurate and prevents financial discrepancies.

## Critical Rules

### 1. Message Usage Tracking

Track usage accurately at the point of sending:

```typescript
// CORRECT - Track after successful send
const result = await twilioClient.messages.create({ to, from, body });
if (result.status !== "failed") {
  await ctx.runMutation(internal.billing.mutations.recordMessageUsage, {
    organizationId,
    messageId: result.sid,
    status: "sent",
    segmentCount: 1  // We charge per message, not per segment
  });
}

// WRONG - Tracking before confirming send
await ctx.runMutation(internal.billing.mutations.recordMessageUsage, { ... });
await twilioClient.messages.create({ to, from, body });  // Might fail!
```

### 2. Failed Message Handling

Don't charge for failed messages:

```typescript
// When message fails, don't deduct from balance
if (deliveryStatus === "failed" || deliveryStatus === "undelivered") {
  await ctx.runMutation(internal.billing.mutations.refundMessageUsage, {
    organizationId,
    messageId,
    reason: deliveryStatus,
  });
}
```

### 3. Stripe Webhook Idempotency

ALL Stripe webhook handlers MUST be idempotent:

```typescript
export const handleInvoicePaid = internalMutation({
  args: { stripeEventId: v.string(), invoiceId: v.string(), ... },
  handler: async (ctx, args) => {
    // Check if already processed
    const existing = await ctx.db.query("stripeEvents")
      .withIndex("by_event_id", q => q.eq("eventId", args.stripeEventId))
      .first();

    if (existing) {
      console.log(`Event ${args.stripeEventId} already processed`);
      return;  // Idempotent - don't double-process
    }

    // Process the event
    await ctx.db.insert("stripeEvents", { eventId: args.stripeEventId, ... });
    // ... rest of handler
  }
});
```

### 4. Subscription State Machine

Handle subscription states correctly:

```typescript
// States that allow full access
const ACTIVE_STATES = ["active", "trialing"];

// States with limited access (can still read, fix billing)
const RESTRICTED_STATES = ["past_due", "payment_failed"];

// States with no access
const BLOCKED_STATES = ["suspended", "cancelled"];

// Check in orgMutation wrapper
if (BLOCKED_STATES.includes(org.subscriptionStatus)) {
  throw new ConvexError({
    code: "ORG_SUSPENDED",
    message: "Account suspended. Contact support.",
  });
}
```

### 5. Premium Feature Gating

Gate premium features correctly:

```typescript
// In convex/lib/orgWrappers.ts
export const orgMutation = ({ requirePayment, bypassOrgStatus, ...config }) => {
  return mutation({
    handler: async (ctx, args) => {
      // ... auth checks ...

      // Payment gate
      if (requirePayment) {
        const isPaid = await isPaidOrganization(ctx.db, org);
        if (!isPaid) {
          throw new ConvexError({
            code: "PAYMENT_REQUIRED",
            message: "Upgrade to access this feature",
          });
        }
      }
    },
  });
};
```

### 6. Usage Limits

Enforce usage limits before sending:

```typescript
export const sendCampaign = orgMutation({
  requirePayment: true,
  handler: async ({ db }, args) => {
    // Check message balance BEFORE sending
    const usage = await db
      .query("usage")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
      .first();

    if (usage.messagesRemaining < args.recipientCount) {
      throw new ConvexError({
        code: "INSUFFICIENT_BALANCE",
        message: `Need ${args.recipientCount} messages, only ${usage.messagesRemaining} remaining`,
      });
    }

    // Proceed with sending
  },
});
```

## Validation Checklist

Before completing billing-related work:

- [ ] Usage tracked AFTER successful operation (not before)?
- [ ] Failed operations don't deduct from balance?
- [ ] Webhook handlers are idempotent (check for duplicate events)?
- [ ] Subscription states handled correctly?
- [ ] Premium features gated with `requirePayment: true`?
- [ ] Usage limits enforced before expensive operations?
- [ ] Billing mutations use `bypassOrgStatus: true` (users can fix billing)?

## Common Mistakes

| Mistake                        | Impact                          | Fix                              |
| ------------------------------ | ------------------------------- | -------------------------------- |
| Track usage before send        | Overcharge for failed sends     | Track after confirmed success    |
| Non-idempotent webhooks        | Double-charge on retry          | Check event ID before processing |
| Missing payment gate           | Free access to premium features | Add `requirePayment: true`       |
| Wrong subscription state check | Block paying customers          | Use correct state arrays         |

## Reference Files

- **Billing helpers**: `packages/convex/billing/helpers.ts`
- **Usage tracking**: `packages/convex/billing/mutations.ts`
- **Stripe webhooks**: `packages/convex/http/webhooks/stripe/`
- **Payment checks**: `packages/convex/lib/billing.ts`
- **Org wrappers**: `packages/convex/lib/orgWrappers.ts`

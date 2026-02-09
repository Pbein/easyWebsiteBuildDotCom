---
name: webhook-protection
description: Prevents modification of production webhook routes. Auto-applies when editing convex/http.ts or convex/http/webhooks/ files. READ-ONLY guidance - warns before any edit.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Webhook Protection

This skill protects production webhook infrastructure from accidental breaking changes.

## Protected Files

**DO NOT MODIFY without explicit approval:**

- `packages/convex/http.ts` - Webhook route registration
- `packages/convex/http/webhooks/twilio/index.ts` - Twilio handlers
- `packages/convex/http/webhooks/stripe/index.ts` - Stripe handlers
- `packages/convex/http/webhooks/workos/index.ts` - WorkOS handlers

## Critical Rules

### 1. NEVER Consolidate Webhook Routes

Each webhook type REQUIRES a separate URL endpoint:

```typescript
// CORRECT - Keep these separate routes
http.route({ path: "/webhooks/twilio/inbound", handler: twilioWebhook.inbound });
http.route({ path: "/webhooks/twilio/status", handler: twilioWebhook.status });
http.route({ path: "/webhooks/twilio/link-clicks", handler: twilioWebhook.linkClicks });
http.route({ path: "/webhooks/twilio/brand-status", handler: twilioWebhook.brandStatus });
http.route({ path: "/webhooks/twilio/campaign-status", handler: twilioWebhook.campaignStatus });

// WRONG - This breaks 4 critical webhook types
http.route({ path: "/webhooks/twilio", handler: twilioWebhook.inbound });
```

### 2. Why Separate Routes Are Required

| Service    | Reason                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------ |
| **Twilio** | Inbound SMS, delivery status, link clicks, brand status, campaign status are ALL different |
| **Stripe** | Subscription events, payment events, invoice events have different payloads                |
| **WorkOS** | Directory sync, SSO events, user events are separate                                       |

**External services configure SPECIFIC webhook URLs** - consolidating breaks their configurations.

### 3. Webhook Handler Pattern

All handlers MUST use `internalMutation`:

```typescript
// CORRECT
export const handleInboundSMS = internalMutation({
  args: {
    /* validated webhook payload */
  },
  handler: async (ctx, args) => {
    // Process webhook
  },
});

// WRONG - Security vulnerability
export const handleInboundSMS = mutation({
  // NO AUTH!
  args: {
    /* ... */
  },
  handler: async (ctx, args) => {
    /* ... */
  },
});
```

### 4. Signature Validation Required

All webhooks MUST validate signatures:

```typescript
// Twilio
import { validateTwilioSignature } from "../lib/crypto/twilio";

// Stripe
import { validateStripeSignature } from "../lib/crypto/stripe";

// Always verify before processing
const isValid = validateTwilioSignature(payload, signature, url);
if (!isValid) {
  return new Response("Invalid signature", { status: 401 });
}
```

### 5. Organization Resolution

Multi-tenant webhooks MUST resolve the organization:

```typescript
// Find org by phone number (Twilio inbound)
const phoneNumber = await ctx.db
  .query("phoneNumbers")
  .withIndex("by_number", (q) => q.eq("number", payload.To))
  .first();

if (!phoneNumber) {
  return new Response("Unknown number", { status: 404 });
}

const organizationId = phoneNumber.organizationId;
```

## Production Incident History

**January 14, 2025**: Routes consolidated to single endpoint, causing:

- Delivery status tracking broken (billing accuracy lost)
- Link click analytics broken (campaign metrics gone)
- A2P brand registration stuck (orgs in PENDING forever)
- A2P campaign approval blocked (messaging services disabled)

## Before Modifying Webhook Routes

**MANDATORY STEPS:**

1. Read `docs/active/WEBHOOK_ROUTES_VERIFICATION.md` completely
2. Understand why each route exists (not "duplication")
3. Verify external service webhook configuration
4. Test ALL webhook types after changes
5. Have Karen verify the changes are production-safe

## Reference Files

- **Route registration**: `packages/convex/http.ts`
- **Twilio handlers**: `packages/convex/http/webhooks/twilio/`
- **Stripe handlers**: `packages/convex/http/webhooks/stripe/`
- **Signature validation**: `packages/convex/lib/crypto/`
- **Documentation**: `docs/active/WEBHOOK_ROUTES_VERIFICATION.md`

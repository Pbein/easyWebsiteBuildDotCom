---
name: a2p-compliance-flow
description: Guides A2P 10DLC registration implementation with Twilio. Auto-applies when working on A2P, brand registration, or Twilio campaign code.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Edit
---

# A2P 10DLC Compliance Flow

This skill ensures proper implementation of Twilio's A2P 10DLC (Application-to-Person 10-Digit Long Code) registration process.

## State Machine

The A2P registration follows a strict state progression:

```
NOT_STARTED
    ↓
BUSINESS_PROFILE_PENDING → BUSINESS_PROFILE_REJECTED
    ↓
BUSINESS_PROFILE_APPROVED
    ↓
BRAND_REGISTRATION_PENDING → BRAND_REGISTRATION_REJECTED
    ↓
BRAND_REGISTRATION_APPROVED
    ↓
CAMPAIGN_PENDING → CAMPAIGN_REJECTED
    ↓
CAMPAIGN_VERIFIED (Note: "VERIFIED" not "APPROVED")
    ↓
PHONE_NUMBER_PENDING
    ↓
COMPLETED
```

## Critical Rules

### 1. State Transitions

Only allow valid transitions:

```typescript
const VALID_TRANSITIONS: Record<A2PStatus, A2PStatus[]> = {
  NOT_STARTED: ["BUSINESS_PROFILE_PENDING"],
  BUSINESS_PROFILE_PENDING: ["BUSINESS_PROFILE_APPROVED", "BUSINESS_PROFILE_REJECTED"],
  BUSINESS_PROFILE_APPROVED: ["BRAND_REGISTRATION_PENDING"],
  BRAND_REGISTRATION_PENDING: ["BRAND_REGISTRATION_APPROVED", "BRAND_REGISTRATION_REJECTED"],
  BRAND_REGISTRATION_APPROVED: ["CAMPAIGN_PENDING"],
  CAMPAIGN_PENDING: ["CAMPAIGN_VERIFIED", "CAMPAIGN_REJECTED"],
  CAMPAIGN_VERIFIED: ["PHONE_NUMBER_PENDING"],
  PHONE_NUMBER_PENDING: ["COMPLETED"],
  // Rejection states can retry
  BUSINESS_PROFILE_REJECTED: ["BUSINESS_PROFILE_PENDING"],
  BRAND_REGISTRATION_REJECTED: ["BRAND_REGISTRATION_PENDING"],
  CAMPAIGN_REJECTED: ["CAMPAIGN_PENDING"],
};

function canTransition(from: A2PStatus, to: A2PStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
```

### 2. Webhook Handlers Required

Each status update comes via Twilio webhooks:

```typescript
// Brand status webhook
export const handleBrandStatus = internalMutation({
  args: {
    brandSid: v.string(),
    status: v.string(),
    failureReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("a2pRegistrations")
      .withIndex("by_brand_sid", (q) => q.eq("brandSid", args.brandSid))
      .first();

    if (!registration) return;

    // Map Twilio status to our status
    const newStatus = mapTwilioStatus(args.status);
    await updateA2PStatus(ctx.db, registration._id, newStatus, args.failureReason);
  },
});
```

### 3. Required Business Information

For business profile submission:

```typescript
interface BusinessProfile {
  // Required fields
  legalBusinessName: string; // Exact legal name
  ein: string; // 9-digit EIN
  businessType: BusinessType; // LLC, Corporation, etc.
  industry: Industry; // NAICS code
  physicalAddress: Address; // Must be verifiable
  contactEmail: string;
  contactPhone: string;

  // Optional but recommended
  websiteUrl?: string;
  stockSymbol?: string; // For public companies
}
```

### 4. Campaign Use Cases

Select appropriate use case:

```typescript
const USE_CASES = {
  MARKETING: "Marketing messages and promotional content",
  LOW_VOLUME: "Low volume, mixed use case",
  "2FA": "Two-factor authentication",
  CUSTOMER_CARE: "Customer support and service",
  ACCOUNT_NOTIFICATION: "Account alerts and notifications",
  DELIVERY_NOTIFICATION: "Delivery and shipping updates",
};

// Most SMS Marketing platforms use:
const primaryUseCase = "MARKETING"; // or "LOW_VOLUME" for smaller volumes
```

### 5. Sample Messages Required

Campaigns require sample messages:

```typescript
const sampleMessages = [
  "Hey {firstName}! Check out our new arrivals. Reply STOP to opt out.",
  "Limited time offer: 20% off your next purchase. Use code SAVE20. Reply STOP to unsubscribe.",
  "{businessName}: Your appointment is confirmed for tomorrow at 2 PM. Reply STOP to opt out.",
];

// Requirements:
// - Must include opt-out language
// - Must be representative of actual messages
// - Must include dynamic fields if used
```

### 6. Error Handling

Handle rejection states:

```typescript
export const handleRejection = internalMutation({
  handler: async (ctx, args) => {
    // Update status with reason
    await ctx.db.patch(args.registrationId, {
      status: args.rejectionStatus,
      failureReason: args.reason,
      rejectedAt: Date.now(),
    });

    // Notify organization
    await ctx.scheduler.runAfter(0, internal.notifications.sendA2PRejection, {
      organizationId: args.organizationId,
      reason: args.reason,
      nextSteps: getNextSteps(args.reason),
    });
  },
});
```

## Validation Checklist

Before A2P implementation:

- [ ] State machine with all valid transitions implemented?
- [ ] Webhook handlers for brand-status and campaign-status?
- [ ] Business profile validation before submission?
- [ ] Sample messages include opt-out language?
- [ ] Error/rejection states handled with user notification?
- [ ] Phone number assignment only after CAMPAIGN_VERIFIED?

## Common Issues

| Issue                   | Cause                      | Fix                            |
| ----------------------- | -------------------------- | ------------------------------ |
| Brand stuck in PENDING  | Missing webhook handler    | Implement brand-status webhook |
| Campaign rejected       | Missing opt-out in samples | Add "Reply STOP to opt out"    |
| Phone not sending       | Assigned before verified   | Wait for CAMPAIGN_VERIFIED     |
| EIN verification failed | Wrong format               | Use 9 digits, no dashes        |

## Reference Files

- **A2P actions**: `packages/convex/a2p/actions.ts`
- **A2P queries**: `packages/convex/a2p/queries.ts`
- **Twilio webhooks**: `packages/convex/http/webhooks/twilio/`
- **State machine**: `packages/convex/a2p/helpers/state-machine.ts`

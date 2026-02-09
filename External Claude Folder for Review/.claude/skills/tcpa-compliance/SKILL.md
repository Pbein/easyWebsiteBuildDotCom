---
name: tcpa-compliance
description: Ensures SMS messages comply with TCPA regulations and state-specific laws. Auto-applies when working on campaigns, messages, or SMS content.
allowed-tools:
  - Read
  - Grep
  - Glob
---

# TCPA Compliance

This skill ensures SMS campaigns comply with the Telephone Consumer Protection Act (TCPA) and state-specific regulations.

## Critical Rules

### 1. Opt-Out Language Required

ALL marketing SMS messages MUST include opt-out instructions:

```
CORRECT:
"[Message content] Reply STOP to opt out"

WRONG:
"[Message content]"  // Missing opt-out!
```

### 2. Time Window Restrictions

Messages can ONLY be sent during allowed hours in the RECIPIENT'S local time:

```typescript
// CORRECT - Check recipient timezone
const recipientTime = getRecipientLocalTime(recipientPhoneNumber);
const hour = recipientTime.getHours();

if (hour < 8 || hour >= 21) {
  // Before 8 AM or after 9 PM
  throw new Error("Cannot send outside 8 AM - 9 PM recipient time");
}

// WRONG - Using sender's timezone
const senderTime = new Date(); // Don't use this!
```

**Allowed window: 8:00 AM - 9:00 PM recipient local time**

### 3. State-Specific Rules

#### California (CA)

- Opt-out language MUST be 50+ characters
- Age verification required for age-restricted products (alcohol, cannabis)
- Enhanced disclosure requirements

#### Washington (WA)

- Must comply with FDA regulations for cannabis messaging
- Clear opt-out language required
- Health claims must be substantiated

#### Florida (FL)

- Telemarketing restrictions apply
- State Do Not Call list compliance
- Clear identification of sender

#### Texas (TX)

- Follow federal TCPA as baseline
- Additional best practices enforcement
- Clear business identification

### 4. Consent Verification

Always verify consent before sending:

```typescript
// CORRECT - Check opt-in status
const contact = await db.get(args.contactId);
if (contact.optedOut || contact.status === "unsubscribed") {
  throw new Error("Cannot send to opted-out contact");
}

// Check consent timestamp exists
if (!contact.consentTimestamp) {
  throw new Error("No consent record for contact");
}
```

### 5. Message Content Validation

Run content through TCPA validator:

```typescript
import { validateTCPA } from "../lib/compliance/tcpa_validator";

const validation = validateTCPA({
  message: args.messageBody,
  recipientState: contact.state,
  productCategory: campaign.productCategory,
});

if (!validation.isValid) {
  throw new ConvexError({
    code: "TCPA_VIOLATION",
    message: validation.errors.join(", "),
  });
}
```

### 6. Required Disclosures

For certain message types:

| Category       | Required Disclosure              |
| -------------- | -------------------------------- |
| Marketing      | "Reply STOP to opt out"          |
| Promotional    | Business name + opt-out          |
| Transactional  | Business name (opt-out optional) |
| Age-restricted | Age verification notice          |

## Validation Checklist

Before sending any SMS campaign:

- [ ] Message includes opt-out language ("Reply STOP to opt out")?
- [ ] Sending within 8 AM - 9 PM recipient local time?
- [ ] Contact has valid opt-in consent recorded?
- [ ] State-specific rules checked (CA, WA, FL, TX)?
- [ ] No health claims without substantiation?
- [ ] Business clearly identified in message?
- [ ] Ran through `validateTCPA()` function?

## Common Violations

| Violation         | Fine                    | Prevention                      |
| ----------------- | ----------------------- | ------------------------------- |
| Missing opt-out   | $500-$1,500 per message | Include "Reply STOP to opt out" |
| Wrong time window | $500-$1,500 per message | Check recipient timezone        |
| No consent record | $500-$1,500 per message | Verify consent before send      |
| Ignoring opt-out  | $500-$1,500 per message | Check optedOut flag             |

## Reference Files

- **TCPA validator**: `packages/convex/lib/compliance/tcpa_validator.ts`
- **Timezone utilities**: `packages/convex/lib/timezone.ts`
- **Consent tracking**: `packages/convex/contacts/mutations.ts`
- **Campaign validation**: `packages/convex/campaigns/helpers/mutations.ts`

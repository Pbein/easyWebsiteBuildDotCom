---
name: messaging-terminology
description: Enforces correct business terminology in user-facing content, UI text, and documentation. Auto-applies when writing user-facing content.
allowed-tools:
  - Read
  - Grep
  - Edit
---

# Messaging Terminology

This skill ensures consistent and accurate business terminology across all user-facing content.

## Core Terminology Rules

### 1. "Messages" NOT "Credits"

```
CORRECT:
"You have 5,000 messages remaining"
"Each campaign uses messages from your balance"
"Purchase additional messages"

WRONG:
"You have 5,000 credits remaining"  // Confusing
"Each campaign uses credits"         // Gaming language
"Purchase additional credits"        // Not simple
```

### 2. "Messages" NOT "Segments"

We charge per FULL message regardless of technical segments:

```
CORRECT:
"Send 1,000 messages"
"Message sent successfully"
"Cost: 1 message"

WRONG:
"Send 1,000 segments"              // Technical jargon
"This is a 3-segment message"      // Confusing pricing
"Cost: 3 segments (long message)"  // We don't charge this way
```

### 3. One Message = One Message

Simple, predictable pricing:

```
CORRECT:
"Each SMS costs 1 message, regardless of length"
"Send unlimited characters per message"
"Simple per-message pricing"

WRONG:
"160 characters = 1 segment, 320 = 2 segments"
"Long messages cost more segments"
```

### 4. SMS AI Agent is "INCLUDED"

The AI Agent is part of the subscription, not a free bonus:

```
CORRECT:
"SMS AI Agent included in your subscription"
"AI-powered conversations are included"
"Your plan includes unlimited AI Agent conversations"

WRONG:
"Free SMS AI Agent"           // Implies it could cost extra
"Bonus: Free AI Agent"        // Marketing speak
"AI Agent at no extra cost"   // Still sounds like an add-on
```

### 5. Subscription Language

```
CORRECT:
"Your subscription includes..."
"Upgrade your plan"
"Monthly subscription"

WRONG:
"Buy credits"
"Top up your account"
"Pay as you go"
```

## UI Text Examples

### Balance Display

```typescript
// CORRECT
<p>Messages remaining: {balance.messagesRemaining}</p>
<p>Used this month: {balance.messagesUsed}</p>

// WRONG
<p>Credits remaining: {balance.creditsRemaining}</p>
<p>Segments used: {balance.segmentsUsed}</p>
```

### Campaign Summary

```typescript
// CORRECT
<p>This campaign will send {recipientCount} messages</p>
<p>Estimated cost: {recipientCount} messages</p>

// WRONG
<p>This campaign will use {recipientCount * avgSegments} segments</p>
<p>Estimated cost: {segmentCount} credits</p>
```

### Upgrade Prompts

```typescript
// CORRECT
<UpgradePrompt>
  <h3>Need more messages?</h3>
  <p>Upgrade your plan to send more messages each month.</p>
</UpgradePrompt>

// WRONG
<UpgradePrompt>
  <h3>Out of credits?</h3>
  <p>Purchase additional credits to continue sending.</p>
</UpgradePrompt>
```

### AI Agent Feature

```typescript
// CORRECT
<Feature>
  <h3>SMS AI Agent</h3>
  <p>Included with your subscription. Unlimited AI-powered conversations.</p>
</Feature>

// WRONG
<Feature>
  <h3>Free SMS AI Agent</h3>
  <p>Get free AI conversations with your plan!</p>
</Feature>
```

## Terminology Quick Reference

| Avoid           | Use Instead                |
| --------------- | -------------------------- |
| credits         | messages                   |
| segments        | messages                   |
| free AI         | included AI                |
| buy credits     | upgrade plan               |
| top up          | purchase messages          |
| pay per segment | simple per-message pricing |
| bonus feature   | included feature           |

## Validation Checklist

Before completing user-facing content:

- [ ] Using "messages" not "credits"?
- [ ] Using "messages" not "segments"?
- [ ] AI Agent described as "included" not "free"?
- [ ] Pricing described as simple and predictable?
- [ ] No gaming or credit-based language?
- [ ] Consistent with existing UI patterns?

## Where This Applies

- Dashboard UI text
- Email templates
- Marketing copy
- Help documentation
- Error messages
- Toast notifications
- Landing pages
- Pricing pages

## Reference Files

- **Billing UI**: `apps/dashboard/src/app/(dashboard)/org/[slug]/billing/`
- **Campaign UI**: `apps/dashboard/src/app/(dashboard)/org/[slug]/texts/`
- **Marketing pages**: `apps/marketing/src/app/`

# A2P Test Messaging & Campaign Blocking - Implementation Plan

## Problem Statement

Users can currently click "Send Now" on campaigns even when A2P registration is incomplete. This results in:

1. Campaign starts processing
2. Every individual SMS fails with cryptic "A2P compliance required" error
3. Poor user experience and confusion

**Goal**: Block campaign sends early with clear messaging, but allow test messages to team members using the Hermes platform number.

---

## Solution Overview

### Two-Part Approach

1. **Backend**: Block campaigns at mutation level (before processing starts)
2. **Frontend**: Disable Send/Schedule buttons with helpful messaging, keep "Send Test" working

### Security Model for Test Messages

| Who Can Receive     | Verification Method                                            |
| ------------------- | -------------------------------------------------------------- |
| Current user (self) | Authenticated user with phone in profile                       |
| Team members        | Must have `organizationMembership` record (invited via WorkOS) |
| External contacts   | **BLOCKED** - Requires A2P                                     |

**No rate limits** - Security comes from restricting WHO can receive, not how many.

---

## Implementation Details

### Phase 1: Backend (COMPLETED ✅)

#### 1.1 New Action: `sendTestToTeamMember`

**File**: `packages/convex/actions/twilio/testSMS.ts` ✅ CREATED

```typescript
// Key features:
- Uses Hermes platform number (+15716242043) - bypasses A2P
- Validates recipient is org member via getMembershipByUserAndOrg
- Validates recipient has phone number in profile
- NO payment required (platform absorbs cost)
- Message prefixed with [TEST from {OrgName}]
- Logs for audit trail
```

**Exports**:

- `getTeamMembersForTesting` - Returns team members with phone numbers
- `sendTestToTeamMember` - Send test to any team member
- `sendTestToSelf` - Convenience wrapper for self-test

#### 1.2 Campaign A2P Check

**File**: `packages/convex/campaigns/helpers/execution.ts` ✅ MODIFIED

Added A2P check in `sendCampaignHelper` BEFORE TCPA validation:

```typescript
const a2pStatus = await ctx.runQuery(internal.a2p.internal.status.canSendSMS, {
  organizationId,
});

if (!a2pStatus.canSend) {
  return {
    success: false,
    error: "A2P verification required before sending campaigns...",
  };
}
```

---

### Phase 2: Frontend Hook

#### 2.1 New Hook: `useA2PSendPermission`

**File**: `apps/dashboard/src/hooks/sms/use-a2p-send-permission.ts` (TO CREATE)

```typescript
interface A2PSendPermission {
  // Can this org send campaigns to contacts?
  canSendCampaigns: boolean;

  // Can users send test messages to team?
  canSendTests: boolean;

  // Why are campaigns blocked?
  blockReason: string | null;

  // What step are they on? (for progress display)
  currentStep: number; // 1-5
  totalSteps: number; // 5
  stepName: string; // e.g., "Brand Registration"

  // Overall status for UI
  status:
    | "not_started"
    | "in_progress"
    | "pending_review"
    | "action_required"
    | "failed"
    | "complete";

  // Loading state
  isLoading: boolean;
}

export function useA2PSendPermission(organizationId: Id<"organizations">): A2PSendPermission;
```

**Logic**:

- Uses existing `useCompleteA2PState` hook
- Derives `canSendCampaigns` from: campaign.status === "approved" && hasPhoneNumber && hasMessagingService
- `canSendTests` is always true (team-only restriction is backend-enforced)
- Maps A2P state to human-readable step names

---

### Phase 3: Frontend UI Components

#### 3.1 New Component: `A2PBlockingBanner`

**File**: `apps/dashboard/src/app/(dashboard)/org/[slug]/texts/components/A2PBlockingBanner.tsx` (TO CREATE)

**States & Copy**:

| Status            | Icon                   | Title                       | Body                                                          | CTA                    |
| ----------------- | ---------------------- | --------------------------- | ------------------------------------------------------------- | ---------------------- |
| `not_started`     | AlertCircle (amber)    | "A2P Verification Required" | "Complete verification to send campaigns to your contacts."   | "Start Verification →" |
| `in_progress`     | Clock (blue)           | "Verification In Progress"  | "Step {N} of 5: {StepName}"                                   | "Continue Setup →"     |
| `pending_review`  | Clock (blue)           | "Under Review"              | "Your {step} is being reviewed (1-3 business days)."          | "View Status"          |
| `action_required` | AlertTriangle (orange) | "Action Required"           | "Additional information needed for your {step}."              | "Fix Issues →"         |
| `failed`          | XCircle (red)          | "Verification Issue"        | "Your {step} was not approved. Review feedback and resubmit." | "Review & Fix →"       |
| `complete`        | _(no banner)_          | -                           | -                                                             | -                      |

**Props**:

```typescript
interface A2PBlockingBannerProps {
  organizationId: Id<"organizations">;
  organizationSlug: string;
  status: A2PSendPermission["status"];
  currentStep: number;
  stepName: string;
  className?: string;
}
```

#### 3.2 Modify: `AudienceCostCard`

**File**: `apps/dashboard/src/app/(dashboard)/org/[slug]/texts/components/AudienceCostCard.tsx`

**Changes**:

1. Accept new prop: `a2pPermission: A2PSendPermission`
2. Show `A2PBlockingBanner` above send buttons when `!canSendCampaigns`
3. Disable "Send Now" button when `!canSendCampaigns`
4. Disable "Schedule" button when `!canSendCampaigns`
5. Keep "Send Test to My Phone" always enabled

**Button States**:

```
When A2P NOT complete:
┌─────────────────────────────────────┐
│ ⚠️ A2P Verification Required        │
│ Complete verification to send...    │
│ [Continue Setup →]                  │
├─────────────────────────────────────┤
│ [Send Now]        ← DISABLED (gray) │
│ [Schedule]        ← DISABLED (gray) │
│                                     │
│ [📱 Send Test to My Phone]  ← WORKS │
└─────────────────────────────────────┘

When A2P complete:
┌─────────────────────────────────────┐
│ [Send Now]        ← ENABLED (green) │
│ [Schedule]        ← ENABLED         │
│                                     │
│ [📱 Send Test to My Phone]  ← WORKS │
└─────────────────────────────────────┘
```

#### 3.3 Modify: `UpsertTextClient`

**File**: `apps/dashboard/src/app/(dashboard)/org/[slug]/texts/new/UpsertTextClient.tsx`

**Changes**:

1. Add `useA2PSendPermission` hook call
2. Pass `a2pPermission` to `AudienceCostCard`
3. Update `canSubmit` logic to include `a2pPermission.canSendCampaigns`

#### 3.4 Modify: `SendTestButton`

**File**: `apps/dashboard/src/app/(dashboard)/org/[slug]/texts/components/SendTestButton.tsx`

**Changes**:

1. Switch from `contacts.actions.sendTestToSelf` to `actions.twilio.testSMS.sendTestToSelf`
2. Remove payment requirement check (tests are free)
3. Update error messages for clarity

---

### Phase 4: Team Member Selection (Future Enhancement)

For now, "Send Test to My Phone" only sends to the current user. Future enhancement:

**Dropdown for Team Selection**:

```
[📱 Send Test ▼]
├── To My Phone (+1555***1234)
├── To John Doe (+1555***5678)
└── To Jane Smith (No phone number)
```

This requires:

1. Calling `getTeamMembersForTesting` to populate dropdown
2. UI for selecting recipient
3. Calling `sendTestToTeamMember` with selected user ID

**Recommendation**: Ship without dropdown first. Add in Phase 2 if users request it.

---

## File Summary

| File                                                        | Action          | Priority |
| ----------------------------------------------------------- | --------------- | -------- |
| `packages/convex/actions/twilio/testSMS.ts`                 | ✅ CREATED      | -        |
| `packages/convex/campaigns/helpers/execution.ts`            | ✅ MODIFIED     | -        |
| `apps/dashboard/src/hooks/sms/use-a2p-send-permission.ts`   | CREATE          | HIGH     |
| `apps/dashboard/src/hooks/sms/index.ts`                     | MODIFY (export) | HIGH     |
| `apps/dashboard/.../texts/components/A2PBlockingBanner.tsx` | CREATE          | HIGH     |
| `apps/dashboard/.../texts/components/AudienceCostCard.tsx`  | MODIFY          | HIGH     |
| `apps/dashboard/.../texts/new/UpsertTextClient.tsx`         | MODIFY          | HIGH     |
| `apps/dashboard/.../texts/components/SendTestButton.tsx`    | MODIFY          | MEDIUM   |

---

## Testing Plan

### Backend Tests

1. `sendTestToTeamMember` - Verify only org members can receive
2. `sendTestToTeamMember` - Verify non-members are rejected
3. `sendTestToTeamMember` - Verify users without phone are rejected
4. `sendCampaignHelper` - Verify A2P check blocks incomplete orgs
5. `sendCampaignHelper` - Verify A2P-complete orgs can send

### Frontend Tests

1. `useA2PSendPermission` - Returns correct state for each A2P status
2. `A2PBlockingBanner` - Renders correct content for each status
3. `AudienceCostCard` - Disables buttons when A2P incomplete
4. `AudienceCostCard` - Enables buttons when A2P complete
5. `SendTestButton` - Works regardless of A2P status

### E2E Tests

1. User without A2P sees blocking banner, cannot send campaign
2. User without A2P can send test to self
3. User with A2P complete can send campaign
4. User with A2P pending sees "Under Review" state

---

## Risks & Mitigations

| Risk                                   | Mitigation                               |
| -------------------------------------- | ---------------------------------------- |
| Hermes number rate limited by Twilio   | Monitor usage; low risk since team-only  |
| Users confused by "test" vs "campaign" | Clear visual hierarchy and copy          |
| Breaking existing test button          | Keep same UX, just change backend action |
| A2P status query performance           | Already optimized with compound indexes  |

---

## Rollout Plan

1. **Deploy backend changes** (already done) - A2P check silently blocks but doesn't break UI
2. **Deploy frontend changes** - UI now shows why sends are blocked
3. **Monitor** - Check for user confusion, error rates
4. **Iterate** - Add team member dropdown if requested

---

## Questions for You

1. **Test message format**: Is this OK?

   ```
   [TEST from Uraeus Holdings]

   Your message content here

   --
   Test preview sent by Crishon
   ```

2. **Team dropdown**: Ship now with "Send Test to My Phone" only, add team dropdown later?

3. **A2P step names**: Are these clear?
   - Step 1: Business Profile
   - Step 2: Brand Registration
   - Step 3: Messaging Service
   - Step 4: Phone Number
   - Step 5: Campaign Registration

4. **Banner placement**: Inside the sidebar card (above buttons) or as a page-level banner?

---

## Approval Checklist

- [ ] Backend approach approved (team-only restriction via membership check)
- [ ] Frontend UI design approved (banner + disabled buttons)
- [ ] Test message format approved
- [ ] Step names approved
- [ ] Ready to proceed with frontend implementation

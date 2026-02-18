/**
 * Tests for the useSubscription hook contract.
 *
 * Since the hook depends on Clerk and Convex, we test the state machine
 * logic by replicating the derivation logic and verifying all branch
 * paths produce correct SubscriptionStatus values.
 */

import { describe, it, expect } from "vitest";
import { getSourceHash } from "../../helpers/convex-staleness";

// ---------------------------------------------------------------------------
// Replicated derivation logic (mirrors src/lib/hooks/use-subscription.ts)
// ---------------------------------------------------------------------------

type Plan = "free" | "starter" | "pro";

interface SubscriptionStatus {
  plan: Plan;
  isLoaded: boolean;
  isActive: boolean;
  ownItPurchased: boolean;
  currentPeriodEnd: number | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
}

interface UserRecord {
  plan?: string;
  subscriptionStatus?: string;
  ownItPurchased?: boolean;
  currentPeriodEnd?: number;
  stripeCustomerId?: string;
}

function deriveSubscriptionStatus(
  clerkLoaded: boolean,
  isSignedIn: boolean,
  user: UserRecord | null | undefined
): SubscriptionStatus {
  // Not loaded yet
  if (!clerkLoaded || (isSignedIn && user === undefined)) {
    return {
      plan: "free",
      isLoaded: false,
      isActive: false,
      ownItPurchased: false,
      currentPeriodEnd: null,
      subscriptionStatus: null,
      stripeCustomerId: null,
    };
  }

  // Not signed in
  if (!isSignedIn || !user) {
    return {
      plan: "free",
      isLoaded: true,
      isActive: false,
      ownItPurchased: false,
      currentPeriodEnd: null,
      subscriptionStatus: null,
      stripeCustomerId: null,
    };
  }

  const plan = (user.plan ?? "free") as Plan;
  const isActive =
    plan !== "free" &&
    (user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing");

  return {
    plan,
    isLoaded: true,
    isActive,
    ownItPurchased: user.ownItPurchased ?? false,
    currentPeriodEnd: user.currentPeriodEnd ?? null,
    subscriptionStatus: user.subscriptionStatus ?? null,
    stripeCustomerId: user.stripeCustomerId ?? null,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

/**
 * @requirements
 * - [REQ-1]: Returns isLoaded: false until both Clerk and Convex user data are available (Source: use-subscription.ts loading branch)
 * - [REQ-2]: Unauthenticated users always get free plan with isActive: false (Source: use-subscription.ts not-signed-in branch)
 * - [REQ-3]: isActive is true only for non-free plans with "active" or "trialing" subscription status (Source: use-subscription.ts derivation)
 * - [REQ-4]: Plan defaults to "free" when user record has no plan field (Source: use-subscription.ts ?? "free")
 * - [REQ-5]: stripeCustomerId is exposed for billing portal integration (Source: dashboard BillingSection)
 * - [REQ-6]: ownItPurchased reflects one-time $99 export purchase status (Source: BD-003-01 pricing tiers)
 */
describe("useSubscription derivation logic", () => {
  // Staleness guard — if this fails, use-subscription.ts was modified.
  // Update the replicated derivation logic above to match the source, then update the hash.
  it("staleness guard — source file unchanged", () => {
    expect(getSourceHash("src/lib/hooks/use-subscription.ts")).toBe("37a0fe7df71f94a2");
  });

  describe("loading states (Requirement REQ-1)", () => {
    it("returns isLoaded: false when Clerk has not loaded", () => {
      const status = deriveSubscriptionStatus(false, false, undefined);
      expect(status.isLoaded).toBe(false);
      expect(status.plan).toBe("free");
    });

    it("returns isLoaded: false when signed in but Convex user is undefined (still loading)", () => {
      const status = deriveSubscriptionStatus(true, true, undefined);
      expect(status.isLoaded).toBe(false);
    });

    it("returns isLoaded: true when Clerk loaded and user not signed in", () => {
      const status = deriveSubscriptionStatus(true, false, null);
      expect(status.isLoaded).toBe(true);
    });
  });

  describe("unauthenticated users (Requirement REQ-2)", () => {
    it("returns free plan for unsigned users", () => {
      const status = deriveSubscriptionStatus(true, false, null);
      expect(status.plan).toBe("free");
      expect(status.isActive).toBe(false);
    });

    it("returns free plan when signed in but user record is null", () => {
      const status = deriveSubscriptionStatus(true, true, null);
      expect(status.plan).toBe("free");
      expect(status.isActive).toBe(false);
      expect(status.isLoaded).toBe(true);
    });

    it("all nullable fields are null for unsigned users", () => {
      const status = deriveSubscriptionStatus(true, false, null);
      expect(status.currentPeriodEnd).toBeNull();
      expect(status.subscriptionStatus).toBeNull();
      expect(status.stripeCustomerId).toBeNull();
      expect(status.ownItPurchased).toBe(false);
    });
  });

  describe("plan derivation (Requirement REQ-4)", () => {
    it("defaults to 'free' when user has no plan field", () => {
      const status = deriveSubscriptionStatus(true, true, {});
      expect(status.plan).toBe("free");
    });

    it("returns 'starter' for starter plan users", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "starter",
        subscriptionStatus: "active",
      });
      expect(status.plan).toBe("starter");
    });

    it("returns 'pro' for pro plan users", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "pro",
        subscriptionStatus: "active",
      });
      expect(status.plan).toBe("pro");
    });
  });

  describe("isActive derivation (Requirement REQ-3)", () => {
    it("isActive is true for starter plan with active subscription", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "starter",
        subscriptionStatus: "active",
      });
      expect(status.isActive).toBe(true);
    });

    it("isActive is true for pro plan with trialing status", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "pro",
        subscriptionStatus: "trialing",
      });
      expect(status.isActive).toBe(true);
    });

    it("isActive is false for free plan even with active status", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "free",
        subscriptionStatus: "active",
      });
      expect(status.isActive).toBe(false);
    });

    it("isActive is false for canceled subscription", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "starter",
        subscriptionStatus: "canceled",
      });
      expect(status.isActive).toBe(false);
    });

    it("isActive is false for past_due subscription", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "pro",
        subscriptionStatus: "past_due",
      });
      expect(status.isActive).toBe(false);
    });

    it("isActive is false when subscriptionStatus is undefined", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "starter",
      });
      expect(status.isActive).toBe(false);
    });
  });

  describe("ownItPurchased (Requirement REQ-6)", () => {
    it("ownItPurchased defaults to false when not set", () => {
      const status = deriveSubscriptionStatus(true, true, {});
      expect(status.ownItPurchased).toBe(false);
    });

    it("ownItPurchased is true when set on user record", () => {
      const status = deriveSubscriptionStatus(true, true, {
        ownItPurchased: true,
      });
      expect(status.ownItPurchased).toBe(true);
    });
  });

  describe("stripeCustomerId exposure (Requirement REQ-5)", () => {
    it("exposes stripeCustomerId when present on user record", () => {
      const status = deriveSubscriptionStatus(true, true, {
        stripeCustomerId: "cus_abc123",
      });
      expect(status.stripeCustomerId).toBe("cus_abc123");
    });

    it("stripeCustomerId is null when not present", () => {
      const status = deriveSubscriptionStatus(true, true, {});
      expect(status.stripeCustomerId).toBeNull();
    });
  });

  describe("currentPeriodEnd (Contract)", () => {
    it("exposes currentPeriodEnd as Unix timestamp when present", () => {
      const timestamp = 1708185600; // Feb 17, 2024
      const status = deriveSubscriptionStatus(true, true, {
        plan: "starter",
        subscriptionStatus: "active",
        currentPeriodEnd: timestamp,
      });
      expect(status.currentPeriodEnd).toBe(timestamp);
    });

    it("currentPeriodEnd is null when not present", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "starter",
        subscriptionStatus: "active",
      });
      expect(status.currentPeriodEnd).toBeNull();
    });
  });

  describe("interface completeness (Contract)", () => {
    it("returns all 7 fields in SubscriptionStatus", () => {
      const status = deriveSubscriptionStatus(true, true, {
        plan: "pro",
        subscriptionStatus: "active",
        ownItPurchased: true,
        currentPeriodEnd: 1708185600,
        stripeCustomerId: "cus_xyz",
      });

      const keys = Object.keys(status).sort();
      expect(keys).toEqual([
        "currentPeriodEnd",
        "isActive",
        "isLoaded",
        "ownItPurchased",
        "plan",
        "stripeCustomerId",
        "subscriptionStatus",
      ]);
    });
  });
});

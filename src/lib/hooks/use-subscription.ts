"use client";

import { useUser } from "@clerk/nextjs";

type Plan = "free" | "starter" | "pro";

interface SubscriptionStatus {
  plan: Plan;
  isLoaded: boolean;
}

/**
 * Subscription status hook — reads plan from Clerk user metadata.
 * Will be wired to Stripe via Clerk user metadata in Priority 2 (BD-003-01).
 * For now, all authenticated users are "free" tier.
 */
export function useSubscription(): SubscriptionStatus {
  const { isLoaded } = useUser();

  // Will be wired to Stripe via Clerk publicMetadata.plan in Priority 2
  return { plan: "free", isLoaded };
}

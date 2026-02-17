"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type Plan = "free" | "starter" | "pro";

export interface SubscriptionStatus {
  plan: Plan;
  isLoaded: boolean;
  isActive: boolean;
  ownItPurchased: boolean;
  currentPeriodEnd: number | null;
  subscriptionStatus: string | null;
}

/**
 * Subscription status hook — reads plan from Convex users table.
 * Wired to Stripe via Convex webhook handler.
 */
export function useSubscription(): SubscriptionStatus {
  const { isLoaded: clerkLoaded, isSignedIn } = useUser();
  const user = useQuery(api.users.getCurrentUser);

  // Not loaded yet
  if (!clerkLoaded || (isSignedIn && user === undefined)) {
    return {
      plan: "free",
      isLoaded: false,
      isActive: false,
      ownItPurchased: false,
      currentPeriodEnd: null,
      subscriptionStatus: null,
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
  };
}

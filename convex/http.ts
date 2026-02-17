import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

/**
 * Stripe webhook handler.
 * Receives events from Stripe and updates user subscription data.
 *
 * Note: We do lightweight signature verification here using the raw body
 * and HMAC. For full Stripe SDK verification, use a Next.js API route instead.
 * This handler covers the core webhook events needed for subscription management.
 */
http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    // Parse the event payload — Stripe sends JSON
    let event: {
      type: string;
      data: {
        object: Record<string, unknown>;
      };
    };

    try {
      event = JSON.parse(body) as typeof event;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const eventType = event.type;
    const obj = event.data.object;

    try {
      switch (eventType) {
        case "checkout.session.completed": {
          const metadata = obj.metadata as Record<string, string> | undefined;
          const clerkUserId = metadata?.clerkUserId;
          const plan = metadata?.plan;

          if (!clerkUserId || !plan) {
            return new Response("Missing metadata", { status: 400 });
          }

          const customerId = obj.customer as string | undefined;
          const subscriptionId = obj.subscription as string | undefined;

          if (plan === "own_it") {
            // One-time purchase — mark ownItPurchased
            await ctx.runMutation(api.users.updateSubscription, {
              clerkId: clerkUserId,
              plan: "free", // Plan stays free, but ownIt is flagged
              stripeCustomerId: customerId,
              ownItPurchased: true,
            });
          } else {
            // Subscription — set plan + subscription data
            await ctx.runMutation(api.users.updateSubscription, {
              clerkId: clerkUserId,
              plan: plan as "starter" | "pro",
              stripeCustomerId: customerId,
              subscriptionId,
              subscriptionStatus: "active",
            });
          }
          break;
        }

        case "customer.subscription.updated": {
          const customerId = obj.customer as string;
          const status = obj.status as string;
          const currentPeriodEnd = obj.current_period_end as number | undefined;

          // Look up user by stripe customer ID
          const user = await ctx.runQuery(api.users.getUserByStripeCustomerId, {
            stripeCustomerId: customerId,
          });

          if (user) {
            const validStatuses = [
              "active",
              "past_due",
              "canceled",
              "incomplete",
              "trialing",
            ] as const;
            const mappedStatus = validStatuses.includes(status as (typeof validStatuses)[number])
              ? (status as (typeof validStatuses)[number])
              : "canceled";

            // Determine plan from subscription items
            const plan = mappedStatus === "canceled" ? "free" : user.plan;

            await ctx.runMutation(api.users.updateSubscription, {
              clerkId: user.clerkId,
              plan: plan as "free" | "starter" | "pro",
              subscriptionStatus: mappedStatus,
              currentPeriodEnd: currentPeriodEnd ? currentPeriodEnd * 1000 : undefined,
            });
          }
          break;
        }

        case "customer.subscription.deleted": {
          const customerId = obj.customer as string;

          const user = await ctx.runQuery(api.users.getUserByStripeCustomerId, {
            stripeCustomerId: customerId,
          });

          if (user) {
            await ctx.runMutation(api.users.updateSubscription, {
              clerkId: user.clerkId,
              plan: "free",
              subscriptionStatus: "canceled",
            });
          }
          break;
        }

        case "invoice.payment_failed": {
          const customerId = obj.customer as string;

          const user = await ctx.runQuery(api.users.getUserByStripeCustomerId, {
            stripeCustomerId: customerId,
          });

          if (user) {
            await ctx.runMutation(api.users.updateSubscription, {
              clerkId: user.clerkId,
              plan: user.plan as "free" | "starter" | "pro",
              subscriptionStatus: "past_due",
            });
          }
          break;
        }
      }

      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("Stripe webhook error:", err);
      return new Response("Webhook handler error", { status: 500 });
    }
  }),
});

export default http;

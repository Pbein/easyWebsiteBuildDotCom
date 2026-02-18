import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/stripe/portal
 *
 * Creates a Stripe Customer Portal session for the authenticated user
 * so they can manage billing, update payment methods, and cancel.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
    }

    const body = (await req.json()) as { stripeCustomerId?: string };
    if (!body.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer ID" }, { status: 400 });
    }

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const origin = req.headers.get("origin") ?? "https://easywebsitebuild.com";

    const session = await stripe.billingPortal.sessions.create({
      customer: body.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Portal session failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

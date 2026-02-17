import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
    }

    // Dynamic import so Stripe isn't instantiated at build time
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const PRICE_MAP: Record<string, string | undefined> = {
      starter: process.env.STRIPE_STARTER_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
      own_it: process.env.STRIPE_OWN_IT_PRICE_ID,
    };

    const body = (await req.json()) as {
      plan: string;
      projectId?: string;
    };

    const priceId = PRICE_MAP[body.plan];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const isOneTime = body.plan === "own_it";
    const origin = req.headers.get("origin") ?? "https://easywebsitebuild.com";

    const session = await stripe.checkout.sessions.create({
      mode: isOneTime ? "payment" : "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        clerkUserId: userId,
        projectId: body.projectId ?? "",
        plan: body.plan,
      },
      success_url: body.projectId
        ? `${origin}/dashboard/${body.projectId}?payment=success&plan=${body.plan}`
        : `${origin}/dashboard?payment=success&plan=${body.plan}`,
      cancel_url: body.projectId
        ? `${origin}/dashboard/${body.projectId}?payment=canceled`
        : `${origin}/dashboard?payment=canceled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

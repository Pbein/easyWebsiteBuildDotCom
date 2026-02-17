import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const VERCEL_API = "https://api.vercel.com";
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

function vercelHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function teamParam(): string {
  return VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : "";
}

/**
 * GET /api/domains?q=highclassspa
 * Checks domain availability across common TLDs.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!VERCEL_TOKEN) {
    return NextResponse.json({ error: "Domain service not configured" }, { status: 503 });
  }

  const query = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();
  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Search query too short" }, { status: 400 });
  }

  // Clean domain name — remove spaces, special chars
  const cleanName = query.replace(/[^a-z0-9-]/g, "");
  const tlds = [".com", ".co", ".io", ".site", ".app", ".dev"];

  try {
    const results = await Promise.all(
      tlds.map(async (tld) => {
        const domain = `${cleanName}${tld}`;
        try {
          const res = await fetch(
            `${VERCEL_API}/v4/domains/check${teamParam()}&name=${encodeURIComponent(domain)}`,
            { headers: vercelHeaders() }
          );
          const data = (await res.json()) as {
            available?: boolean;
            price?: number;
          };
          return {
            domain,
            available: data.available ?? false,
            price: data.price ?? null,
          };
        } catch {
          return { domain, available: false, price: null };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Domain check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/domains
 * Purchase a domain via Vercel Registrar API and add to project.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ error: "Domain service not configured" }, { status: 503 });
  }

  const body = (await req.json()) as { domain: string };
  const domain = body.domain?.trim().toLowerCase();

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  try {
    // 1. Purchase domain via Vercel Registrar
    const purchaseRes = await fetch(`${VERCEL_API}/v4/domains/buy${teamParam()}`, {
      method: "POST",
      headers: vercelHeaders(),
      body: JSON.stringify({ name: domain }),
    });

    if (!purchaseRes.ok) {
      const err = (await purchaseRes.json()) as { error?: { message?: string } };
      return NextResponse.json(
        { error: err.error?.message ?? "Domain purchase failed" },
        { status: purchaseRes.status }
      );
    }

    // 2. Add domain to Vercel project for DNS routing
    const addRes = await fetch(
      `${VERCEL_API}/v10/projects/${VERCEL_PROJECT_ID}/domains${teamParam()}`,
      {
        method: "POST",
        headers: vercelHeaders(),
        body: JSON.stringify({ name: domain }),
      }
    );

    if (!addRes.ok) {
      const err = (await addRes.json()) as { error?: { message?: string } };
      return NextResponse.json(
        {
          error: `Domain purchased but failed to configure: ${err.error?.message ?? "Unknown"}`,
          purchased: true,
          domain,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      domain,
      message: `${domain} is now yours! DNS will propagate shortly.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Domain purchase failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

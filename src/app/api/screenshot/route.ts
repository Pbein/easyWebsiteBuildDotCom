import { NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

const VIEWPORT_SIZES: Record<string, { width: number; height: number }> = {
  desktop: { width: 1280, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

/** Simple in-memory rate limiter: max 10 requests per 60 seconds */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  // Evict expired entries
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= RATE_LIMIT_MAX) return true;
  requestTimestamps.push(now);
  return false;
}

/** Validate URL is strictly localhost HTTP(S) — blocks IPv6, private IPs, non-http schemes */
function isAllowedUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  // Only allow http/https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

  // Only allow localhost variants — block private IPs, IPv6, etc.
  const hostname = parsed.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost")) {
    return true;
  }

  return false;
}

interface ScreenshotRequestBody {
  url: string;
  viewport?: "desktop" | "tablet" | "mobile";
  waitMs?: number;
}

/**
 * Server-side screenshot capture using Playwright.
 * POST /api/screenshot
 * Body: { url: string; viewport?: "desktop"|"tablet"|"mobile"; waitMs?: number }
 * Returns: { base64: string; width: number; height: number }
 */
export async function POST(request: Request): Promise<Response> {
  // Rate limiting
  if (isRateLimited()) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let browser;
  try {
    const body = (await request.json()) as ScreenshotRequestBody;
    const { url, viewport = "desktop", waitMs = 3000 } = body;

    // Security: strict localhost-only URL validation
    if (!isAllowedUrl(url)) {
      return NextResponse.json({ error: "Only localhost URLs are allowed" }, { status: 400 });
    }

    // Dynamic import — Playwright is a devDependency, may not be available in production
    const { chromium } = await import("playwright");

    const size = VIEWPORT_SIZES[viewport] ?? VIEWPORT_SIZES.desktop;
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: size });

    await page.goto(url, { waitUntil: "networkidle" });

    // Additional wait for fonts, animations, and paint to settle
    if (waitMs > 0) {
      await page.waitForTimeout(Math.min(waitMs, 10000));
    }

    const buffer = await page.screenshot({ fullPage: true, type: "png" });
    const base64 = buffer.toString("base64");

    const height = (await page.evaluate(() => document.body.scrollHeight)) as number;

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "server",
      event: "server_screenshot_captured",
      properties: { viewport, width: size.width, height },
    });

    return NextResponse.json({ base64, width: size.width, height });
  } catch (error) {
    // Sanitize error — never expose internal details to client
    const internalMessage = error instanceof Error ? error.message : "Unknown error";

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "server",
      event: "server_screenshot_error",
      properties: { error_message: internalMessage },
    });

    return NextResponse.json(
      { error: "Screenshot capture failed. Please try again." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

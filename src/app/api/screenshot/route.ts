import { NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

const VIEWPORT_SIZES: Record<string, { width: number; height: number }> = {
  desktop: { width: 1280, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

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
  let browser;
  try {
    const body = (await request.json()) as ScreenshotRequestBody;
    const { url, viewport = "desktop", waitMs = 3000 } = body;

    // Security: only allow localhost / same-origin URLs
    const parsed = new URL(url);
    if (
      parsed.hostname !== "localhost" &&
      parsed.hostname !== "127.0.0.1" &&
      !parsed.hostname.endsWith(".localhost")
    ) {
      return NextResponse.json(
        { error: "Only localhost URLs are allowed for security" },
        { status: 400 }
      );
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
    const message = error instanceof Error ? error.message : "Screenshot capture failed";
    // Track error in PostHog
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "server",
      event: "server_screenshot_error",
      properties: { error_message: message },
    });
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PLATFORM_HOSTS = [
  "easywebsitebuild.com",
  "www.easywebsitebuild.com",
  "localhost",
  "127.0.0.1",
];

/**
 * Custom domain routing middleware.
 *
 * If the request hostname is NOT a known platform host, it's a custom domain
 * pointing to a published site. We look up the domain → projectId mapping
 * via the Convex HTTP endpoint and rewrite to /site/[projectId].
 *
 * For platform hosts, Clerk middleware runs as normal.
 */
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const hostname = req.headers.get("host")?.split(":")[0] ?? "";

  // Check if this is a custom domain (not platform)
  const isPlatform =
    PLATFORM_HOSTS.some((h) => hostname === h) ||
    hostname.endsWith(".vercel.app") ||
    hostname.endsWith(".localhost");

  if (!isPlatform && hostname) {
    // Custom domain — rewrite to published site renderer
    // The /site/[projectId] page will look up the domain in Convex
    // For now, we pass the domain as a query param for the page to resolve
    const url = req.nextUrl.clone();
    url.pathname = "/published-site";
    url.searchParams.set("domain", hostname);
    return NextResponse.rewrite(url);
  }

  // Platform routes — just pass through Clerk
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

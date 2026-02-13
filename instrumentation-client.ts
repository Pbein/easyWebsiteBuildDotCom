import posthog from "posthog-js";

const isDev = process.env.NODE_ENV === "development";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  // In dev, hit PostHog directly — the /ingest proxy adds Turbopack headers that trigger HTTP 431
  api_host: isDev ? "https://us.i.posthog.com" : "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  // Exception autocapture lazy-loads a script that fails in local dev (Turbopack)
  capture_exceptions: !isDev,
  debug: isDev,
});

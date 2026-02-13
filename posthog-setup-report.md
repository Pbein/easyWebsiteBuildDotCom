# PostHog Post-Wizard Report

The PostHog wizard has completed a deep integration of your EasyWebsiteBuild project. This integration provides comprehensive analytics for tracking user behavior through the AI-powered website builder flow, from homepage CTAs through intake completion to website export.

## Integration Summary

### Client-Side Setup

- **`instrumentation-client.ts`** — PostHog client initialization using Next.js 16.1+ instrumentation file pattern
- Uses reverse proxy (`/ingest`) to avoid ad blockers
- Exception capture enabled for automatic error tracking
- Debug mode enabled in development

### Server-Side Setup

- **`src/lib/posthog-server.ts`** — Server-side PostHog Node client for API routes
- Used in `/api/screenshot` route for server-side event tracking

### Reverse Proxy Configuration

- **`next.config.ts`** — Added PostHog rewrites to proxy requests through `/ingest`
- Improved tracking reliability by avoiding ad blocker interference

### Environment Variables

- **`.env.local`** — PostHog API key and host configured with `NEXT_PUBLIC_` prefix

## Events Instrumented

| Event                        | Description                                              | File                                                 |
| ---------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| `intake_started`             | User begins the intake flow by selecting a site type     | `src/app/demo/page.tsx`                              |
| `intake_step_completed`      | User completes a step in the 9-step intake flow          | `src/app/demo/page.tsx`                              |
| `preview_viewed`             | User views their generated site preview (the wow moment) | `src/app/demo/preview/page.tsx`                      |
| `viewport_switched`          | User switches viewport mode (desktop/tablet/mobile)      | `src/components/platform/preview/PreviewToolbar.tsx` |
| `theme_variant_switched`     | User toggles between A/B theme variants                  | `src/app/demo/preview/page.tsx`                      |
| `export_clicked`             | User clicks export/download button                       | `src/app/demo/preview/page.tsx`                      |
| `export_completed`           | Export ZIP successfully downloaded                       | `src/app/demo/preview/page.tsx`                      |
| `screenshot_captured`        | User captures screenshot from preview                    | `src/app/demo/preview/page.tsx`                      |
| `feedback_submitted`         | User submits satisfaction rating on preview              | `src/components/platform/preview/FeedbackBanner.tsx` |
| `homepage_cta_clicked`       | User clicks a CTA button on the homepage                 | `src/app/page.tsx`                                   |
| `server_screenshot_captured` | Server-side Playwright screenshot generated              | `src/app/api/screenshot/route.ts`                    |

### Event Properties

Key events include rich properties for analysis:

- **`intake_started`**: `site_type`
- **`intake_step_completed`**: `step_number`, `step_name`, `site_type`, `goal`
- **`preview_viewed`**: `session_id`, `site_type`, `business_name`, `method`, `component_count`
- **`export_completed`**: `session_id`, `site_type`, `business_name`, `file_count`
- **`feedback_submitted`**: `session_id`, `rating`, `dimensions`, `has_free_text`
- **`homepage_cta_clicked`**: `cta_type`, `cta_text`, `location`

### Error Tracking

Exception capture is enabled via `posthog.captureException()` in:

- Export failures
- Screenshot capture failures
- Server-side screenshot errors

## Next Steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard

- **Analytics basics**: [https://us.posthog.com/project/312718/dashboard/1275871](https://us.posthog.com/project/312718/dashboard/1275871)

### Insights

- **User Journey Overview** (line chart): [https://us.posthog.com/project/312718/insights/1sdHywkQ](https://us.posthog.com/project/312718/insights/1sdHywkQ)
- **Website Builder Conversion Funnel**: [https://us.posthog.com/project/312718/insights/HYfE7h4n](https://us.posthog.com/project/312718/insights/HYfE7h4n)
- **Homepage CTA Performance**: [https://us.posthog.com/project/312718/insights/TqoQn4mS](https://us.posthog.com/project/312718/insights/TqoQn4mS)
- **User Feedback Distribution** (pie chart): [https://us.posthog.com/project/312718/insights/4SL5iCEr](https://us.posthog.com/project/312718/insights/4SL5iCEr)
- **Preview Engagement Actions** (bar chart): [https://us.posthog.com/project/312718/insights/0o9CEHpP](https://us.posthog.com/project/312718/insights/0o9CEHpP)

### Agent Skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified

| File                                                 | Change                                                                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `instrumentation-client.ts`                          | Already existed - verified PostHog initialization                                                                    |
| `next.config.ts`                                     | Added PostHog reverse proxy rewrites                                                                                 |
| `src/lib/posthog-server.ts`                          | Already existed - verified server client                                                                             |
| `src/app/demo/page.tsx`                              | Added `intake_started` and `intake_step_completed` events                                                            |
| `src/app/demo/preview/page.tsx`                      | Added `preview_viewed`, `export_clicked`, `export_completed`, `theme_variant_switched`, `screenshot_captured` events |
| `src/components/platform/preview/PreviewToolbar.tsx` | Added `viewport_switched` event                                                                                      |
| `src/components/platform/preview/FeedbackBanner.tsx` | Added `feedback_submitted` event                                                                                     |
| `src/app/page.tsx`                                   | Used `TrackedLink` for CTA tracking                                                                                  |
| `src/components/platform/TrackedLink.tsx`            | **New file** - Reusable client component for tracking link clicks                                                    |
| `src/app/api/screenshot/route.ts`                    | Added error tracking                                                                                                 |
| `.env.local`                                         | Added PostHog environment variables                                                                                  |

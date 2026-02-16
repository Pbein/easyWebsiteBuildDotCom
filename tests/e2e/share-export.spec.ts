/**
 * Share & Export E2E Tests
 *
 * Tests the sharing and export functionality on the preview page:
 * - Share button generates a shareable URL via Convex mutation
 * - Share popover shows copy UI with the generated link
 * - Export downloads a ZIP file containing static HTML/CSS
 * - Shared preview page (/s/[shareId]) loads the site with customizations
 * - "Built with EWB" badge is visible on shared previews
 *
 * Prerequisites:
 * - Next.js dev server running on http://localhost:3000
 * - Convex dev server running (share links + site specs are stored in Convex)
 * - A valid generated session for preview tests
 *
 * ALL tests are skipped because they require a fully generated preview session
 * and a running Convex backend to create/read share links.
 */
import { test, expect } from "@playwright/test";

test.describe("Share and export", () => {
  test.skip("share button is visible on toolbar after reveal", async ({ page }) => {
    // TODO: Navigate to /demo/preview?session=<validSession>
    // 1. Wait for immersive reveal to complete (3 seconds or click)
    // 2. The PreviewToolbar should now be fully visible
    // 3. Look for the Share button:
    //    - Desktop: Button with Share2 icon and "Share" text in toolbar
    //    - Has title="Share Preview"
    // 4. The button should be enabled (not disabled, not loading)
    // 5. Verify it is clickable
  });

  test.skip("share generates URL and shows copy UI", async ({ page }) => {
    // TODO: Navigate to /demo/preview?session=<validSession>
    // Wait for reveal to complete, then:
    // 1. Click the Share button in the toolbar
    // 2. The button should show loading state ("Sharing..." text, animate-pulse icon)
    // 3. After the Convex mutation completes:
    //    - A popover should appear below the Share button
    //    - The popover should contain:
    //      a. "Share Link" header
    //      b. A read-only input with the generated URL (format: /s/<10-char-id>)
    //      c. A "Copy" button
    //      d. Text: "Anyone with this link can view your customized preview."
    // 4. Click the "Copy" button
    //    - Should change to "Copied!" with a check icon
    //    - The URL should be copied to clipboard
    // 5. Click the X or click outside the popover to close it
  });

  test.skip("export downloads a ZIP file", async ({ page }) => {
    // TODO: Navigate to /demo/preview?session=<validSession>
    // Wait for reveal to complete, then:
    // 1. Find the Export button in the toolbar:
    //    - Desktop: Button with Download icon and "Export" text
    //    - Has title="Download as ZIP"
    // 2. Set up a download listener:
    //    const [download] = await Promise.all([
    //      page.waitForEvent("download"),
    //      page.click("button[title='Download as ZIP']"),
    //    ]);
    // 3. The button should show loading state ("Exporting...", animate-pulse)
    // 4. After export completes, verify the download:
    //    - Filename should match: <business-name>-website.zip
    //    - File size should be > 0 bytes
    // 5. Optionally verify ZIP contents (HTML + CSS files via JSZip)
    //    - Should contain index.html with component HTML
    //    - Should contain styles.css with theme CSS custom properties
    //    - Should include "Built with EWB" badge (free tier export)
  });

  test.skip("share link page loads the assembled site", async ({ page }) => {
    // TODO: First generate a share link (requires Convex backend):
    // 1. Navigate to /demo/preview?session=<validSession>
    // 2. Wait for reveal, click Share, copy the generated URL
    // 3. Navigate to the shared URL: /s/<shareId>
    //
    // On the shared preview page:
    // 1. Should NOT show the platform Navbar or Footer (ConditionalLayout hides them)
    // 2. Should show a loading spinner initially while fetching from Convex
    // 3. After loading, should render the full assembled website:
    //    - Navigation component at top
    //    - Hero section with business name
    //    - Content sections
    //    - Footer at bottom
    // 4. If the share included customizations (preset, color, font overrides),
    //    the theme should reflect those customizations via the 5-layer composition
    // 5. The page should be scrollable and fully interactive (no sidebar, no toolbar)
  });

  test.skip("Built with EWB badge is visible on shared preview", async ({ page }) => {
    // TODO: Navigate to /s/<validShareId> (requires existing share link in Convex)
    // 1. Wait for the shared preview to fully load
    // 2. Scroll to the bottom of the page
    // 3. Look for the "Built with EWB" badge:
    //    - The BuiltWithBadge component renders a themed footer badge
    //    - Should contain text like "Built with" and "EasyWebsiteBuild" or "EWB"
    //    - Should be styled to match the site's theme (uses theme tokens)
    // 4. The badge should contain a link back to easywebsitebuild.com
    // 5. The badge should be visible but not intrusive (small, bottom of page)
  });
});

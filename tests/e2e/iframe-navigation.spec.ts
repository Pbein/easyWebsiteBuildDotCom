/**
 * E2E tests for iframe navigation interception on the demo preview page.
 *
 * The demo preview page renders the assembled site inside an iframe
 * (`/demo/preview/render?session=<id>`). A delegated click handler on the
 * render container prevents the iframe from navigating away when users
 * click links inside the preview.
 *
 * These tests require:
 *   1. A running Next.js dev server (`npm run dev`)
 *   2. A running Convex dev server (`npx convex dev`)
 *   3. A valid session ID with a saved site spec in the database
 *
 * Run with: npx playwright test tests/e2e/iframe-navigation.spec.ts
 */

import { test, expect } from "@playwright/test";

test.describe("Iframe navigation interception", () => {
  // All tests are skipped because they require a running dev server
  // with Convex and a valid session that has a generated site spec.
  //
  // To enable these tests:
  //   1. Start dev servers: npm run dev & npx convex dev
  //   2. Generate a site through the demo flow to get a session ID
  //   3. Replace TEST_SESSION_ID below with the real session ID
  //   4. Remove the test.skip() wrappers

  const TEST_SESSION_ID = "REPLACE_WITH_VALID_SESSION_ID";
  const PREVIEW_URL = `/demo/preview?session=${TEST_SESSION_ID}`;

  test.skip("clicking nav logo does NOT navigate iframe away from preview", async ({ page }) => {
    // TODO: Navigate to the preview page with a valid session
    // await page.goto(PREVIEW_URL);
    // await page.waitForTimeout(3000); // Wait for immersive reveal to complete
    //
    // TODO: Locate the iframe element
    // const iframe = page.frameLocator("iframe");
    //
    // TODO: Click the nav logo (typically the first anchor in nav-sticky)
    // await iframe.locator("nav a").first().click();
    //
    // TODO: Assert the iframe is still showing the preview render page
    // The iframe src should still contain /demo/preview/render
    // const iframeSrc = await page.locator("iframe").getAttribute("src");
    // expect(iframeSrc).toContain("/demo/preview/render");
    //
    // TODO: Verify the preview content is still visible (not a 404 or blank page)
    // await expect(iframe.locator("body")).toBeVisible();
  });

  test.skip("clicking nav Home link stays on preview (does not navigate)", async ({ page }) => {
    // TODO: Navigate to the preview page
    // await page.goto(PREVIEW_URL);
    // await page.waitForTimeout(3000);
    //
    // TODO: Locate the iframe and find a "Home" or "/" link in the nav
    // const iframe = page.frameLocator("iframe");
    // const homeLink = iframe.locator('nav a[href="/"]');
    //
    // TODO: Click the Home link
    // await homeLink.click();
    //
    // TODO: Verify the iframe did NOT navigate away
    // The src should still point to the render page
    // const iframeSrc = await page.locator("iframe").getAttribute("src");
    // expect(iframeSrc).toContain("/demo/preview/render");
    //
    // TODO: Verify the page scrolled to top (the handler calls scrollTo)
    // const scrollY = await iframe.locator("html").evaluate((el) => el.scrollTop);
    // expect(scrollY).toBe(0);
  });

  test.skip("hash links scroll within preview without navigating", async ({ page }) => {
    // TODO: Navigate to the preview page
    // await page.goto(PREVIEW_URL);
    // await page.waitForTimeout(3000);
    //
    // TODO: Locate the iframe
    // const iframe = page.frameLocator("iframe");
    //
    // TODO: Find a hash link (e.g., a nav link pointing to #contact or #services)
    // Hash links are common in single-page assembled sites
    // const hashLink = iframe.locator('a[href^="#"]').first();
    //
    // TODO: If a hash link exists, click it
    // await hashLink.click();
    //
    // TODO: Verify the iframe src has NOT changed (hash navigation stays in-page)
    // const iframeSrc = await page.locator("iframe").getAttribute("src");
    // expect(iframeSrc).toContain("/demo/preview/render");
    //
    // TODO: Verify the page scrolled (scrollTop should have changed if the
    // target section exists further down the page)
    // This is a soft check since content length varies per spec
  });

  test.skip("external links open in a new tab, not inside the iframe", async ({ page }) => {
    // TODO: Navigate to the preview page
    // await page.goto(PREVIEW_URL);
    // await page.waitForTimeout(3000);
    //
    // TODO: Locate the iframe
    // const iframe = page.frameLocator("iframe");
    //
    // TODO: Find an external link (e.g., social media icon in the footer)
    // External links start with http:// or https://
    // const externalLink = iframe.locator('a[href^="http"]').first();
    //
    // TODO: Set up a listener for new pages (tabs) opening
    // const [newPage] = await Promise.all([
    //   page.context().waitForEvent("page"),
    //   externalLink.click(),
    // ]);
    //
    // TODO: Verify the new tab opened with the expected URL
    // expect(newPage.url()).toContain("http");
    //
    // TODO: Verify the original iframe is still on the render page
    // const iframeSrc = await page.locator("iframe").getAttribute("src");
    // expect(iframeSrc).toContain("/demo/preview/render");
    //
    // TODO: Clean up the new tab
    // await newPage.close();
  });
});

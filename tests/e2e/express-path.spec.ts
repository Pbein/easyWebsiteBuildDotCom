/**
 * Express Path E2E Tests
 *
 * Tests the 3-step express intake flow: site type -> goal -> name/description.
 * Express mode is the default mode (expressMode: true in store).
 *
 * Prerequisites:
 * - Next.js dev server running on http://localhost:3000
 * - Convex dev server running (for generation + preview tests)
 *
 * Tests marked with test.skip() require a fully running backend with Convex
 * to generate a site spec and redirect to the preview page.
 */
import { test, expect } from "@playwright/test";

test.describe("Express path flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to reset Zustand persisted state between tests
    await page.goto("/demo");
    await page.evaluate(() => localStorage.removeItem("ewb-intake"));
    await page.evaluate(() => localStorage.removeItem("ewb-customization"));
  });

  test("shows mode selector on /demo with Express and Deep options", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(500);

    // The mode selector (step 0) should show both mode cards
    await expect(page.locator("text=Express Build")).toBeVisible();
    await expect(page.locator("text=Deep Brand Capture")).toBeVisible();

    // Should display the heading for mode selection
    await expect(page.locator("text=How do you want to build?")).toBeVisible();

    // Express card should mention "60 seconds" and "3 quick steps"
    await expect(page.locator("text=60 seconds")).toBeVisible();
    await expect(page.locator("text=3 quick steps")).toBeVisible();

    // Deep card should mention "3 minutes" and "9 detailed steps"
    await expect(page.locator("text=3 minutes")).toBeVisible();
    await expect(page.locator("text=9 detailed steps")).toBeVisible();
  });

  test("selecting Express Build advances to step 1 (site type selection)", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(500);

    // Click Express Build
    await page.locator("text=Express Build").click();

    // Should advance to step 1 — site type selection
    await expect(page.locator("text=What kind of website are you building?")).toBeVisible();

    // Should show progress indicator for express mode (Step 1 of 3)
    await expect(page.locator("text=Step 1 of 3")).toBeVisible();

    // Should show site type cards
    await expect(page.locator("text=Business Website")).toBeVisible();
    await expect(page.locator("text=Online Store")).toBeVisible();
    await expect(page.locator("text=Portfolio")).toBeVisible();
  });

  test("express mode completes 3-step flow to generation trigger", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(500);

    // Step 0: Select Express Build
    await page.locator("text=Express Build").click();
    await page.waitForTimeout(300);

    // Step 1: Select "Business Website" site type
    await expect(page.locator("text=What kind of website are you building?")).toBeVisible();
    await page.locator("text=Business Website").click();

    // The Continue button should become enabled after selecting a type
    const continueBtn = page.locator("button", { hasText: "Continue" });
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();
    await page.waitForTimeout(300);

    // Step 2: Select a goal
    await expect(page.locator("text=Step 2 of 3")).toBeVisible();
    await expect(page.locator("text=What's the primary goal of business website?")).toBeVisible();
    await page.locator("text=Get people to contact me").click();

    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();
    await page.waitForTimeout(300);

    // Step 3: Enter business name + description
    await expect(page.locator("text=Step 3 of 3")).toBeVisible();
    await expect(page.locator("text=Tell us about your business or project")).toBeVisible();

    // Fill in business name
    await page.locator("#business-name").fill("Sunset Wellness Spa");

    // Fill in description (must be > 10 characters)
    await page
      .locator("#description")
      .fill("A luxury wellness spa in downtown Austin offering massage therapy and facials");

    // The "Build My Site" button should now be enabled (express mode shows this label on step 3)
    const buildBtn = page.locator("button", { hasText: "Build My Site" });
    await expect(buildBtn).toBeEnabled();

    // NOTE: Clicking "Build My Site" triggers generation (step 9) which requires Convex.
    // We verify the button is ready but don't click to avoid backend dependency.
  });

  test("Back button navigates between express steps correctly", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(500);

    // Select Express Build -> Step 1
    await page.locator("text=Express Build").click();
    await page.waitForTimeout(300);

    // Select a site type -> enable Continue
    await page.locator("text=Business Website").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    // Should be on Step 2
    await expect(page.locator("text=Step 2 of 3")).toBeVisible();

    // Click Back to go to Step 1
    await page.locator("button", { hasText: "Back" }).click();
    await page.waitForTimeout(300);

    await expect(page.locator("text=Step 1 of 3")).toBeVisible();
    await expect(page.locator("text=What kind of website are you building?")).toBeVisible();

    // Click Back again to return to mode selector
    await page.locator("button", { hasText: "Back" }).click();
    await page.waitForTimeout(300);

    await expect(page.locator("text=How do you want to build?")).toBeVisible();
  });

  test.skip("generation completes and redirects to preview", async ({ page }) => {
    // TODO: Requires running Convex backend with ANTHROPIC_API_KEY or deterministic fallback.
    // After clicking "Build My Site" on step 3:
    // 1. Step 9 (loading animation) should display with "Generating" messaging
    // 2. After AI/deterministic generation, should redirect to /demo/preview?session=<id>
    // 3. Verify URL contains /demo/preview and a session query param
  });

  test.skip("shows immersive reveal on preview load", async ({ page }) => {
    // TODO: Requires a generated session to load the preview.
    // After navigating to /demo/preview?session=<id>:
    // 1. Should show "Your website is ready" overlay text
    // 2. Should show "Click anywhere to customize" subtext
    // 3. Toolbar should be minimal (just business name + "Preview" badge)
    // 4. Sidebar should NOT be visible during reveal
    // 5. After 3 seconds (or click), reveal should dismiss
    // 6. Full toolbar + sidebar should appear
  });

  test.skip("sidebar appears after reveal completes", async ({ page }) => {
    // TODO: Requires a generated session.
    // After the 3-second immersive reveal auto-dismisses (or user clicks):
    // 1. The CustomizationSidebar should slide in from the left
    // 2. Sidebar should show "Theme Preset" section with presets
    // 3. Sidebar should show "Primary Color" section
    // 4. Sidebar should show "Fonts" section
    // 5. The PreviewToolbar should now show viewport toggles + action buttons
  });
});

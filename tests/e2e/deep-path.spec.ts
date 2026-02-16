/**
 * Deep Path E2E Tests
 *
 * Tests the full 9-step "Deep Brand Capture" intake flow:
 *   Steps 1-4: Setup (site type, goal, description, personality)
 *   Steps 5-7: Brand Character (emotion, voice, culture/archetype)
 *   Step 8:    AI Discovery (generated follow-up questions)
 *   Step 9:    Generation (loading + redirect to preview)
 *
 * Prerequisites:
 * - Next.js dev server running on http://localhost:3000
 * - Convex dev server running (for steps 8-9 which call AI actions)
 *
 * Tests marked with test.skip() require a fully running backend with Convex
 * to generate AI questions (step 8) and the site spec (step 9).
 */
import { test, expect } from "@playwright/test";

test.describe("Deep path flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to reset Zustand persisted state between tests
    await page.goto("/demo");
    await page.evaluate(() => localStorage.removeItem("ewb-intake"));
    await page.evaluate(() => localStorage.removeItem("ewb-customization"));
  });

  test("selecting Deep Brand Capture enters full 9-step flow", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(500);

    // Click Deep Brand Capture
    await page.locator("text=Deep Brand Capture").click();
    await page.waitForTimeout(300);

    // Should advance to step 1 with 9-step progress
    await expect(page.locator("text=What kind of website are you building?")).toBeVisible();
    await expect(page.locator("text=Step 1 of 9")).toBeVisible();

    // Deep mode shows segmented progress groups: Setup, Character, Discovery
    await expect(page.locator("text=Setup")).toBeVisible();
    await expect(page.locator("text=Character")).toBeVisible();
    await expect(page.locator("text=Discovery")).toBeVisible();
  });

  test("completes steps 1-4 setup sequence", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(500);

    // Step 0: Select Deep Brand Capture
    await page.locator("text=Deep Brand Capture").click();
    await page.waitForTimeout(300);

    // Step 1: Select site type
    await expect(page.locator("text=Step 1 of 9")).toBeVisible();
    await page.locator("text=Portfolio").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    // Step 2: Select goal
    await expect(page.locator("text=Step 2 of 9")).toBeVisible();
    await page.locator("text=Get hired / freelance work").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    // Step 3: Enter business name + description
    await expect(page.locator("text=Step 3 of 9")).toBeVisible();
    await page.locator("#business-name").fill("Alex Rivera Design");
    await page
      .locator("#description")
      .fill("A freelance graphic designer specializing in brand identity and packaging design");
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    // Step 4: Brand Personality — 6 axes to complete
    await expect(page.locator("text=Step 4 of 9")).toBeVisible();
    // The first personality axis should be "Density"
    await expect(page.locator("text=Density: Which feels more like your brand?")).toBeVisible();

    // Complete all 6 personality axes by clicking "Confirm & Next Axis"
    for (let i = 0; i < 6; i++) {
      const confirmBtn = page.locator("button", {
        hasText: "Confirm & Next Axis",
      });
      await expect(confirmBtn).toBeVisible();
      await confirmBtn.click();
      await page.waitForTimeout(300);
    }

    // After all 6 axes, should show "Brand Personality Captured"
    await expect(page.locator("text=Brand Personality Captured")).toBeVisible();
  });

  test.skip("steps 5-7 brand character are reachable after step 4", async ({ page }) => {
    // TODO: Requires completing steps 1-4 first (same as above), then clicking
    // "Continue to Discovery" which bridges to Zustand store and advances to step 5.
    //
    // After completing step 4 personality:
    // 1. Click Continue button to bridge to step 5
    // 2. Step 5 (Emotion): Should show "First Impression" heading with emotion cards
    //    - EMOTIONAL_OUTCOMES from brand-character.ts should be selectable
    //    - User selects 1-2 emotional goals, clicks Continue
    // 3. Step 6 (Voice): Should show "Brand Voice" heading with voice tone cards
    //    - warm, polished, direct options
    //    - Fill-in-the-blank narrative prompts
    // 4. Step 7 (Culture): Should show "Visual Culture" heading
    //    - Brand archetype selection
    //    - Anti-reference selection ("NOT like this")
    //
    // Note: Steps 5-7 manage their own navigation (no toolbar Back/Continue).
  });

  test.skip("generation completes and redirects to preview", async ({ page }) => {
    // TODO: Requires running Convex backend + completing all 9 steps.
    //
    // After step 7 completes:
    // 1. Step 8 (Discovery) triggers AI question generation via Convex action
    //    - Fallback: deterministic questions if ANTHROPIC_API_KEY not set
    //    - Should show follow-up questions based on intake inputs
    // 2. Step 9 (Loading) triggers site spec generation
    //    - Should show animated loading screen with progress messaging
    //    - On completion, redirects to /demo/preview?session=<sessionId>
    // 3. Verify the URL contains /demo/preview with session param
  });

  test.skip("preview shows brand-aware content", async ({ page }) => {
    // TODO: Requires a full deep-path generated session.
    //
    // After generation and preview load:
    // 1. The assembled site should reflect the brand character choices:
    //    - Emotional goals should influence spacing/transitions (emotional overrides)
    //    - Voice profile should influence headline/CTA copy
    //    - Brand archetype should influence visual vocabulary
    //    - Anti-references should influence what is NOT shown
    // 2. The sidebar Info section should display:
    //    - Emotional Goals tags
    //    - Voice & Character section with voice + archetype
    //    - Anti-references ("Avoid" section)
    // 3. Personality bars should reflect the 6-axis vector from step 4
  });
});

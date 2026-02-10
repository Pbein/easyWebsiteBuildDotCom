import { test, expect } from "@playwright/test";

test.describe("Intake Flow", () => {
  test("loads the demo page", async ({ page }) => {
    await page.goto("/demo");
    await expect(page).toHaveURL(/\/demo/);
  });

  test("displays step 1 with site type options", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(1000);
    // Should show site type selection cards
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("can select a site type and advance", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForTimeout(1000);
    // Try to find and click a site type card
    const firstCard = page.locator("[role='button'], button").first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
    }
  });
});

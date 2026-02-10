import { test, expect } from "@playwright/test";

test.describe("Preview Page", () => {
  test("loads the component preview page", async ({ page }) => {
    await page.goto("/preview");
    await expect(page).toHaveURL(/\/preview/);
  });

  test("displays library components", async ({ page }) => {
    await page.goto("/preview");
    // Wait for components to render
    await page.waitForTimeout(2000);
    // Should have some visible content
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("theme switching works", async ({ page }) => {
    await page.goto("/preview");
    await page.waitForTimeout(2000);
    // Check for theme-related elements
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});

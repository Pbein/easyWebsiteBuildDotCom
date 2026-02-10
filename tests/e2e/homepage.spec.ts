import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays the hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).toHaveTitle(/easywebsitebuild/i);
  });

  test("navigation links are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("demo CTA button navigates to /demo", async ({ page }) => {
    await page.goto("/");
    const demoLink = page.locator('a[href="/demo"]').first();
    if (await demoLink.isVisible()) {
      await demoLink.click();
      await expect(page).toHaveURL(/\/demo/);
    }
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
  });
});

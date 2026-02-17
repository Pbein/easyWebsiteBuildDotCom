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

  test("no console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });

  test("page has accessible heading structure", async ({ page }) => {
    await page.goto("/");

    // Should have exactly one h1
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("no broken images on homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll("img");
      return Array.from(imgs).filter((img) => img.naturalWidth === 0 && img.complete).length;
    });
    expect(brokenImages).toBe(0);
  });
});

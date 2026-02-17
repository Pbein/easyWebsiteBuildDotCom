import { test, expect } from "@playwright/test";

test.describe("Component Library Preview", () => {
  test("loads the preview page without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/preview");
    await expect(page).toHaveURL(/\/preview/);

    // Wait for components to render
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });

  test("displays component library content with sections", async ({ page }) => {
    await page.goto("/preview");
    await page.waitForTimeout(2000);

    // Should have rendered at least some sections
    const sections = page.locator("section");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
  });

  test("page is scrollable and has substantial content", async ({ page }) => {
    await page.goto("/preview");
    await page.waitForTimeout(2000);

    // The page should have enough content to scroll
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(bodyHeight).toBeGreaterThan(1000);
  });
});

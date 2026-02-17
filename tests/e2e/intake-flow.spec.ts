import { test, expect } from "@playwright/test";

test.describe("Intake Flow Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo");
    await page.evaluate(() => localStorage.removeItem("ewb-intake"));
    await page.evaluate(() => localStorage.removeItem("ewb-customization"));
  });

  test("page title contains EasyWebsiteBuild", async ({ page }) => {
    await page.goto("/demo");
    await expect(page).toHaveTitle(/easywebsitebuild/i);
  });

  test("Build Your Website heading is visible", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.locator("h1", { hasText: "Build Your Website" })).toBeVisible();
  });

  test("mode selector shows both mode options on initial load", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.locator("text=Express Build")).toBeVisible();
    await expect(page.locator("text=Deep Brand Capture")).toBeVisible();
  });

  test("all 13 site type options are displayed after selecting Express", async ({ page }) => {
    await page.goto("/demo");
    await page.locator("text=Express Build").click();
    await page.waitForTimeout(300);

    const siteTypes = [
      "Business Website",
      "Booking Website",
      "Online Store",
      "Blog",
      "Portfolio",
      "Personal Website",
      "Educational",
      "Community",
      "Nonprofit",
      "Event",
      "Landing Page",
      "Directory",
      "Something Else",
    ];
    for (const type of siteTypes) {
      await expect(page.locator(`text=${type}`).first()).toBeVisible();
    }
  });

  test("goal options change based on selected site type", async ({ page }) => {
    await page.goto("/demo");
    await page.locator("text=Express Build").click();
    await page.waitForTimeout(300);

    // Select "Business Website" -> should show business goals
    await page.locator("text=Business Website").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    await expect(page.locator("text=Get people to contact me")).toBeVisible();
    await expect(page.locator("text=Get people to book a consultation")).toBeVisible();
  });

  test("description step enforces minimum character requirement", async ({ page }) => {
    await page.goto("/demo");
    await page.locator("text=Express Build").click();
    await page.waitForTimeout(300);

    // Complete step 1 & 2
    await page.locator("text=Business Website").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);
    await page.locator("text=Get people to contact me").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    // Step 3: business name + description
    await page.locator("#business-name").fill("Test Co");
    await page.locator("#description").fill("short"); // Less than 10 chars

    // Build button should be disabled (description too short)
    const buildBtn = page.locator("button", { hasText: "Build My Site" });
    await expect(buildBtn).toBeDisabled();

    // Now fill with enough characters
    await page
      .locator("#description")
      .fill("A full-service digital marketing agency in downtown Chicago");
    await expect(buildBtn).toBeEnabled();
  });

  test("example description buttons fill the textarea", async ({ page }) => {
    await page.goto("/demo");
    await page.locator("text=Express Build").click();
    await page.waitForTimeout(300);

    await page.locator("text=Business Website").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);
    await page.locator("text=Get people to contact me").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    // Click an example description button
    const exampleBtn = page
      .locator("button")
      .filter({ hasText: /I'm opening/ })
      .first();
    if (await exampleBtn.isVisible()) {
      await exampleBtn.click();
      const textarea = page.locator("#description");
      const value = await textarea.inputValue();
      expect(value.length).toBeGreaterThan(10);
    }
  });

  test("no console errors during intake flow navigation", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/demo");
    await page.locator("text=Express Build").click();
    await page.waitForTimeout(300);

    await page.locator("text=Portfolio").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    await page.locator("text=Get hired / freelance work").click();
    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForTimeout(300);

    expect(errors).toHaveLength(0);
  });
});

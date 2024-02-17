import { test, expect } from "@playwright/test";

test("Visual Regression Test", async ({ page }) => {
  await page.goto(".");

  await expect(page).toHaveScreenshot("home-page.png");
});

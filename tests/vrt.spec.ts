import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addStyleTag({
    content: `
      body {
        font-family: 'Noto Sans CJK JP'
      }
    `,
  });
});

test("Visual Regression Test", async ({ page }) => {
  await page.goto(".");

  await expect(page).toHaveScreenshot("home-page.png");
});

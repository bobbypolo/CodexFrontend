import { expect, test } from "@playwright/test";

test("desktop landing surface matches baseline @visual", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("workflow-desktop.png", {
    fullPage: true,
  });
});

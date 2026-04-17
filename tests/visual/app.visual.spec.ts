import { expect, test } from "@playwright/test";

async function settleWorkflowState(page: import("@playwright/test").Page) {
  await page.waitForTimeout(1_600);
  await page.getByRole("tab", { name: "State lab" }).click();
}

const appScenarios = [
  {
    name: "workflow-overview",
    prepare: async () => {},
  },
  {
    name: "workflow-state-lab-ready",
    prepare: async ({ page }) => {
      await settleWorkflowState(page);
      await page.getByRole("button", { name: "Ready demo" }).click();
      await page.waitForTimeout(300);
    },
  },
  {
    name: "workflow-state-lab-error",
    prepare: async ({ page }) => {
      await settleWorkflowState(page);
      await page.getByRole("button", { name: "Error demo" }).click();
      await page.waitForTimeout(300);
    },
  },
];

test.describe("App visual regression @visual", () => {
  for (const scenario of appScenarios) {
    test(`matches ${scenario.name}`, async ({ page }) => {
      await page.goto("/");
      await scenario.prepare({ page });
      await expect(page).toHaveScreenshot(`${scenario.name}.png`, {
        animations: "disabled",
        caret: "hide",
        fullPage: true,
      });
    });
  }
});

import { expect, test } from "@playwright/test";

test("renders the Codex workflow shell @visual", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /A frontend workflow shell built to move from design context to runtime evidence without losing taste\./i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: /Overview/i })).toBeVisible();
  await expect(page.getByText("Control Room")).toBeVisible();
});

test("switches workflow lanes @visual", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: /State lab/i }).click();
  await expect(page.getByText(/State switches/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Error demo" })).toBeVisible();
});

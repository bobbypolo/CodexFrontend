import { expect, test } from "@playwright/test";

type WorkflowVitals = {
  cumulativeLayoutShift: number;
  largestContentfulPaint: number;
};

declare global {
  interface Window {
    __workflowVitals?: WorkflowVitals;
  }
}

test("landing surface stays within the workflow budgets @performance", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const vitals: WorkflowVitals = {
      cumulativeLayoutShift: 0,
      largestContentfulPaint: 0,
    };

    window.__workflowVitals = vitals;

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const latestEntry = entries.at(-1);

      if (latestEntry) {
        vitals.largestContentfulPaint = latestEntry.startTime;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as Array<
        PerformanceEntry & { hadRecentInput?: boolean; value?: number }
      >) {
        if (!entry.hadRecentInput) {
          vitals.cumulativeLayoutShift += entry.value ?? 0;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Control Room" })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    const vitals = window.__workflowVitals ?? {
      cumulativeLayoutShift: 0,
      largestContentfulPaint: 0,
    };

    return {
      domContentLoaded: navigationEntry?.domContentLoadedEventEnd ?? 0,
      loadEvent: navigationEntry?.loadEventEnd ?? 0,
      largestContentfulPaint: vitals.largestContentfulPaint,
      cumulativeLayoutShift: vitals.cumulativeLayoutShift,
    };
  });

  expect(metrics.domContentLoaded).toBeLessThan(1_800);
  expect(metrics.loadEvent).toBeLessThan(2_500);

  if (metrics.largestContentfulPaint > 0) {
    expect(metrics.largestContentfulPaint).toBeLessThan(2_200);
  }

  expect(metrics.cumulativeLayoutShift).toBeLessThan(0.05);
});

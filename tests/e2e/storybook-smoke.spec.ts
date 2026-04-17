import { expect, test } from '@playwright/test';

import { smokeStories, storyUrl } from '../utils/storybook';

test.describe('Storybook smoke', () => {
  for (const story of smokeStories) {
    test(`renders ${story.name}`, async ({ page }) => {
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];

      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(storyUrl(story.id));
      await expect(page.locator('#storybook-root')).toBeVisible();

      expect(pageErrors, `page errors for ${story.id}`).toEqual([]);
      expect(consoleErrors, `console errors for ${story.id}`).toEqual([]);
    });
  }
});

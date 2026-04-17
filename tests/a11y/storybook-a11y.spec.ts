import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { smokeStories, storyUrl } from '../utils/storybook';

test.describe('Storybook accessibility @a11y', () => {
  for (const story of smokeStories) {
    test(`has no critical violations in ${story.name}`, async ({ page }) => {
      await page.goto(storyUrl(story.id));
      await expect(page.locator('#storybook-root')).toBeVisible();

      const results = await new AxeBuilder({ page }).include('#storybook-root').analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

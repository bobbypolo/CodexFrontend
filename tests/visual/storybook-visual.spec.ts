import { expect, test } from '@playwright/test';

import { storyUrl, visualStories } from '../utils/storybook';

test.describe('Storybook visual regression @visual', () => {
  for (const story of visualStories) {
    test(`matches ${story.name}`, async ({ page }) => {
      if (story.viewport) {
        await page.setViewportSize(story.viewport);
      }

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(storyUrl(story.id));
      await expect(page.locator('#storybook-root')).toBeVisible();
      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story.name}.png`, {
        animations: 'disabled',
        caret: 'hide',
      });
    });
  }
});

import { expect, test } from '@playwright/test';

test('the game page opens with a 4×4 board', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle(/puzzle/i);
  // Legacy markup; the selector changes with the new UI in stage 3.
  await expect(page.locator('.puzzle .item-place')).toHaveCount(16);
});

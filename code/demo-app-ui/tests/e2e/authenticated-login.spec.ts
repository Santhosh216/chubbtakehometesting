import { test, expect } from './fixtures/test';

test.use({ trace: 'off' });

test.describe('Authenticated Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC_AUTH_004 - Claimant successfully logs in and accesses claims page', async ({ page, loginPage }) => {
    await loginPage.signInAsClaimant();

    await expect(page).toHaveURL(/\/claims(?:\/)?$/, {
      timeout: 15000,
    });

    await expect(page.getByRole('heading', { name: /My Claims/i }))
      .toBeVisible();
  });
});

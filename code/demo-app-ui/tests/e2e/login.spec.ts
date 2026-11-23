import { test, expect } from './fixtures/test';

test.describe('Login Page - Authentication Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC_AUTH_001 - Login page displays required elements', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Log In' })
    ).toBeVisible();

    await expect(page.getByLabel('Email')).toBeVisible();

    await expect(
      page.locator('input[type="password"]')
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Log In' })
    ).toBeEnabled();
  });

  test('TC_AUTH_002 - Empty login form displays validation errors', async ({ page }) => {
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#password-error')).toBeVisible();

    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_AUTH_003 - Expired session displays an error message', async ({ page }) => {
    await page.goto('/login?session_expired=true');

    await expect(
      page.getByRole('alert').filter({
        hasText: 'Your session has expired. Please log in again.'
      })
    ).toBeVisible();

    await expect(page).toHaveURL(/\/login$/);
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

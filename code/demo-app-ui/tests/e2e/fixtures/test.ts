import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ClaimsWizardPage } from '../pages/ClaimsWizardPage';
type Pages = { loginPage: LoginPage; claimsWizard: ClaimsWizardPage };
export const test = base.extend<Pages>({
  loginPage: async ({ page }, fixtureUse) => {
    await fixtureUse(new LoginPage(page));
  },
  claimsWizard: async ({ page }, fixtureUse) => {
    await fixtureUse(new ClaimsWizardPage(page));
  },
});

test.afterEach(async ({ page }, testInfo) => {
  const safeName = testInfo.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  const screenshotPath = `test-results/screenshots/${safeName}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('final-page', { path: screenshotPath, contentType: 'image/png' });
});
export {expect};

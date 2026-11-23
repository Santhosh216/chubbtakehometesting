import { expect, type Page } from '@playwright/test';
export class LoginPage {
  constructor(private readonly page: Page) {}
  async open() { await this.page.goto('/login'); }
  async signIn(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.locator('input[type="password"]').fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }
  async signInAsClaimant() {
    const email = process.env.CHUBB_CLAIMANT_EMAIL;
    const password = process.env.CHUBB_CLAIMANT_PASSWORD;
    if (!email || !password) {
      throw new Error('Set CHUBB_CLAIMANT_EMAIL and CHUBB_CLAIMANT_PASSWORD before authenticated UI tests');
    }

    await this.open(); await this.signIn(email, password);
    await expect(this.page).toHaveURL(/\/claims\/?$/, {timeout: 15000});
  }
}

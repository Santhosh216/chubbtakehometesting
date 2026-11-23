import { type Page } from '@playwright/test';
export class ClaimsWizardPage {
  constructor(private readonly page: Page) {}
  async open() { await this.page.goto('/claims/new'); }
  async fillIncidentDetails() {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const date = [yesterday.getFullYear(),String(yesterday.getMonth()+1).padStart(2,'0'),String(yesterday.getDate()).padStart(2,'0')].join('-');
    await this.page.locator('#incidentDate').fill(date);
    await this.page.locator('#incidentLocation').fill('123 Main Street, Springfield');
    await this.page.locator('#claimAmount').fill('1500.50');
  }
}

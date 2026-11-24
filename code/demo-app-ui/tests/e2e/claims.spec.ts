import { test, expect } from './fixtures/test';

// Authenticated traces can contain the seeded password in action snapshots.
test.use({ trace: 'off' });

test.describe('Insurance Claims - Claim Submission Wizard', () => {
  test.beforeEach(async ({ page, loginPage, claimsWizard }) => {
    await loginPage.signInAsClaimant();
    await claimsWizard.open();

    await expect(page.getByTestId('wizard-step-1')).toBeVisible();
  });

  test('TC_CLAIM_001 - Empty incident details prevent navigation', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Incident Details' })
    ).toBeVisible();

    await expect(page.locator('#incidentDate')).toBeVisible();
    await expect(page.locator('#incidentLocation')).toBeVisible();
    await expect(page.locator('#claimAmount')).toBeVisible();

    await expect(
     page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true })
    ).toBeDisabled();
  });

  test('TC_CLAIM_002 - Valid incident details navigate to Step 2', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();

    await expect(
      page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true })
    ).toBeEnabled();

    await page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true }).click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Supporting Details' })
    ).toBeVisible();
  });


  test('TC_CLAIM_003 - Location shorter than five characters blocks Step 1', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();
    await page.locator('#incidentLocation').fill('NY');
    await expect(page.locator('#incidentLocation')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#incidentLocation-error')).toContainText('at least 5 characters');
    await expect(page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  });

  test('TC_CLAIM_008 - Zero claim amount blocks Step 1', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();
    await page.locator('#claimAmount').fill('0');
    await expect(page.locator('#claimAmount-error')).toContainText('at least $0.01');
    await expect(page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  });

  test('TC_CLAIM_009 - Maximum allowed claim amount advances to Step 2', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();
    await page.locator('#claimAmount').fill('1000000');
    const next = page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true });
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page.getByTestId('wizard-step-2')).toBeVisible();
  });

  test('TC_CLAIM_010 - Ten-character description meets the minimum boundary', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();
    await page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByTestId('wizard-step-2')).toBeVisible();
    await page.locator('#description').fill('1234567890');
    await expect(page.locator('#description-counter')).toHaveText('10/1000');
    await expect(page.getByTestId('wizard-step-2').getByRole('button', { name: 'Next', exact: true })).toBeEnabled();
  });

  test('TC_CLAIM_004 - Description validation prevents invalid input', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    const description = page.locator('#description');
    const nextButton = page.getByTestId('wizard-step-2')
      .getByRole('button', { name: 'Next', exact: true });

    await expect(nextButton).toBeDisabled();

    await description.fill('Short');

    await expect(nextButton).toBeDisabled();
    await expect(page.locator('#description-counter')).toHaveText('5/1000');

    await description.fill('The vehicle was damaged in a parking lot.');

    await expect(nextButton).toBeEnabled();
  });

  test('TC_CLAIM_005 - Back navigation preserves incident details', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    await page.getByRole('button', { name: 'Back', exact: true }).click();

    await expect(page.getByTestId('wizard-step-1')).toBeVisible();

    await expect(page.locator('#incidentLocation'))
      .toHaveValue('123 Main Street, Springfield');

    await expect(page.locator('#claimAmount')).toHaveValue('1500.5');
  });
  test('TC_CLAIM_006 - Review screen displays entered claim details', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    const description = 'The vehicle was damaged in a parking lot.';
    await page.locator('#description').fill(description);

    await page.getByTestId('wizard-step-2')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    const review = page.getByTestId('wizard-step-3');
    await expect(review).toBeVisible();

    await expect(review.getByText('123 Main Street, Springfield')).toBeVisible();
    await expect(review.getByText('$1,500.50')).toBeVisible();
    await expect(review.getByText(description)).toBeVisible();

    await expect(
      review.getByRole('button', { name: 'Submit Claim' })
    ).toBeEnabled();
  });

  test('TC_CLAIM_007 - Claimant successfully submits a claim', async ({ page, claimsWizard }) => {
    await claimsWizard.fillIncidentDetails();

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    await page.locator('#description')
      .fill('The vehicle was damaged in a parking lot.');

    await page.getByTestId('wizard-step-2')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-3')).toBeVisible();

    const submitResponsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/claims') &&
      response.request().method() === 'POST'
    );
    await page.getByTestId('wizard-step-3')
      .getByRole('button', { name: 'Submit Claim', exact: true })
      .click();
    const submitResponse = await submitResponsePromise;
    expect(submitResponse.status()).toBe(201);

    await expect(page).toHaveURL(/\/claims\/?$/, {
      timeout: 15000,
    });

    await expect(
      page.getByText(/Claim submitted successfully! Claim ID:/)
    ).toBeVisible();
  });
});





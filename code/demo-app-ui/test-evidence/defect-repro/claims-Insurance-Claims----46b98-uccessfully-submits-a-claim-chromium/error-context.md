# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: claims.spec.ts >> Insurance Claims - Claim Submission Wizard >> TC_CLAIM_007 - Claimant successfully submits a claim
- Location: tests\e2e\claims.spec.ts:112:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - generic [ref=f2e2]:
    - banner [ref=f2e3]:
      - generic [ref=f2e4]:
        - generic [ref=f2e5]: Demo App
        - navigation [ref=f2e6]:
          - button "My Claims" [ref=f2e7]
          - button "Submit Claim" [ref=f2e8]
      - generic [ref=f2e9]:
        - 'status "Connection status: Reconnecting..." [ref=f2e10]':
          - generic [ref=f2e12]: Reconnecting...
        - group "Theme and appearance settings" [ref=f2e13]:
          - button "Switch to Blue theme" [pressed] [ref=f2e14]:
            - generic [ref=f2e16]: ✓
          - button "Switch to Teal theme" [ref=f2e17]
          - button "Switch to Amber theme" [ref=f2e19]
          - button "Switch to dark mode" [ref=f2e21]: 🌙
        - generic [ref=f2e22]: Welcome, Test Claimant
        - button "Logout" [ref=f2e23]
    - main [ref=f2e24]:
      - generic [ref=f2e26]:
        - generic [ref=f2e27]:
          - heading "Submit New Claim" [level=1] [ref=f2e28]
          - button "Cancel" [ref=f2e29]
        - navigation "Wizard progress" [ref=f2e30]:
          - generic [ref=f2e31]:
            - generic [ref=f2e32]: "Step 1: Incident Details"
            - generic [ref=f2e33]: "Step 2: Supporting Details"
            - generic [ref=f2e34]: "Step 3: Review"
          - progressbar "Step 3 of 3" [ref=f2e36]
        - generic [ref=f2e38]:
          - heading "Review Your Claim" [level=2] [ref=f2e39]
          - paragraph [ref=f2e40]: Please review your information before submitting. You can go back to edit if needed.
          - generic [ref=f2e41]:
            - generic [ref=f2e42]:
              - heading "Incident Date" [level=3] [ref=f2e43]
              - paragraph [ref=f2e44]: November 22, 2026
            - generic [ref=f2e45]:
              - heading "Location" [level=3] [ref=f2e46]
              - paragraph [ref=f2e47]: 123 Main Street, Springfield
            - generic [ref=f2e48]:
              - heading "Claim Amount" [level=3] [ref=f2e49]
              - paragraph [ref=f2e50]: $1,500.50
            - generic [ref=f2e51]:
              - heading "Description" [level=3] [ref=f2e52]
              - paragraph [ref=f2e53]: The vehicle was damaged in a parking lot.
          - alert [ref=f2e55]: Failed to submit claim. Please try again.
          - generic [ref=f2e56]:
            - button "Back" [ref=f2e57]
            - button "Submit Claim" [ref=f2e58]
  - generic [ref=f2e63] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=f2e64]
    - generic [ref=f2e68]:
      - button "Open issues overlay" [ref=f2e69]:
        - generic [ref=f2e70]:
          - generic [aria-hidden] [ref=f2e71]: "0"
          - generic [ref=f2e72]: "1"
        - generic [ref=f2e73]: Issue
      - button "Collapse issues badge" [ref=f2e74]
  - alert [ref=f2e77]
```

# Test source

```ts
  30  |     ).toBeEnabled();
  31  | 
  32  |     await page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true }).click();
  33  | 
  34  |     await expect(page.getByTestId('wizard-step-2')).toBeVisible();
  35  | 
  36  |     await expect(
  37  |       page.getByRole('heading', { name: 'Supporting Details' })
  38  |     ).toBeVisible();
  39  |   });
  40  | 
  41  |   test('TC_CLAIM_004 - Description validation prevents invalid input', async ({ page, claimsWizard }) => {
  42  |     await claimsWizard.fillIncidentDetails();
  43  | 
  44  |     await page.getByTestId('wizard-step-1')
  45  |       .getByRole('button', { name: 'Next', exact: true })
  46  |       .click();
  47  | 
  48  |     await expect(page.getByTestId('wizard-step-2')).toBeVisible();
  49  | 
  50  |     const description = page.locator('#description');
  51  |     const nextButton = page.getByTestId('wizard-step-2')
  52  |       .getByRole('button', { name: 'Next', exact: true });
  53  | 
  54  |     await expect(nextButton).toBeDisabled();
  55  | 
  56  |     await description.fill('Short');
  57  | 
  58  |     await expect(nextButton).toBeDisabled();
  59  |     await expect(page.locator('#description-counter')).toHaveText('5/1000');
  60  | 
  61  |     await description.fill('The vehicle was damaged in a parking lot.');
  62  | 
  63  |     await expect(nextButton).toBeEnabled();
  64  |   });
  65  | 
  66  |   test('TC_CLAIM_005 - Back navigation preserves incident details', async ({ page, claimsWizard }) => {
  67  |     await claimsWizard.fillIncidentDetails();
  68  | 
  69  |     await page.getByTestId('wizard-step-1')
  70  |       .getByRole('button', { name: 'Next', exact: true })
  71  |       .click();
  72  | 
  73  |     await expect(page.getByTestId('wizard-step-2')).toBeVisible();
  74  | 
  75  |     await page.getByRole('button', { name: 'Back', exact: true }).click();
  76  | 
  77  |     await expect(page.getByTestId('wizard-step-1')).toBeVisible();
  78  | 
  79  |     await expect(page.locator('#incidentLocation'))
  80  |       .toHaveValue('123 Main Street, Springfield');
  81  | 
  82  |     await expect(page.locator('#claimAmount')).toHaveValue('1500.5');
  83  |   });
  84  |   test('TC_CLAIM_006 - Review screen displays entered claim details', async ({ page, claimsWizard }) => {
  85  |     await claimsWizard.fillIncidentDetails();
  86  | 
  87  |     await page.getByTestId('wizard-step-1')
  88  |       .getByRole('button', { name: 'Next', exact: true })
  89  |       .click();
  90  | 
  91  |     await expect(page.getByTestId('wizard-step-2')).toBeVisible();
  92  | 
  93  |     const description = 'The vehicle was damaged in a parking lot.';
  94  |     await page.locator('#description').fill(description);
  95  | 
  96  |     await page.getByTestId('wizard-step-2')
  97  |       .getByRole('button', { name: 'Next', exact: true })
  98  |       .click();
  99  | 
  100 |     const review = page.getByTestId('wizard-step-3');
  101 |     await expect(review).toBeVisible();
  102 | 
  103 |     await expect(review.getByText('123 Main Street, Springfield')).toBeVisible();
  104 |     await expect(review.getByText('$1,500.50')).toBeVisible();
  105 |     await expect(review.getByText(description)).toBeVisible();
  106 | 
  107 |     await expect(
  108 |       review.getByRole('button', { name: 'Submit Claim' })
  109 |     ).toBeEnabled();
  110 |   });
  111 | 
  112 |   test('TC_CLAIM_007 - Claimant successfully submits a claim', async ({ page, claimsWizard }) => {
  113 |     await claimsWizard.fillIncidentDetails();
  114 | 
  115 |     await page.getByTestId('wizard-step-1')
  116 |       .getByRole('button', { name: 'Next', exact: true })
  117 |       .click();
  118 | 
  119 |     await expect(page.getByTestId('wizard-step-2')).toBeVisible();
  120 | 
  121 |     await page.locator('#description')
  122 |       .fill('The vehicle was damaged in a parking lot.');
  123 | 
  124 |     await page.getByTestId('wizard-step-2')
  125 |       .getByRole('button', { name: 'Next', exact: true })
  126 |       .click();
  127 | 
  128 |     await expect(page.getByTestId('wizard-step-3')).toBeVisible();
  129 | 
> 130 |     const submitResponsePromise = page.waitForResponse((response) =>
      |                                        ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  131 |       response.url().endsWith('/api/claims') &&
  132 |       response.request().method() === 'POST'
  133 |     );
  134 |     await page.getByTestId('wizard-step-3')
  135 |       .getByRole('button', { name: 'Submit Claim', exact: true })
  136 |       .click();
  137 |     const submitResponse = await submitResponsePromise;
  138 |     expect(submitResponse.status()).toBe(201);
  139 | 
  140 |     await expect(page).toHaveURL(/\/claims\/?$/, {
  141 |       timeout: 15000,
  142 |     });
  143 | 
  144 |     await expect(
  145 |       page.getByText(/Claim submitted successfully! Claim ID:/)
  146 |     ).toBeVisible();
  147 |   });
  148 | });
  149 | 
  150 | 
  151 | 
  152 | 
  153 | 
```
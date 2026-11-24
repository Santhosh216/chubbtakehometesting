# Playwright UI Execution Summary

## Run details

- **Execution start:** 2026-11-24 15:19:46 IST (UTC+05:30)
- **Duration:** 34.020 seconds
- **Environment:** Windows; Docker Engine 29.9.3; Node.js 26.13.1;
  Next.js 16.4.6
- **Browser:** Playwright 1.65.1, Chromium 159.0.8154.6 (headless)
- **Application services:** UI, BFF, Claims Service, Keycloak, PostgreSQL,
  Redis, Zookeeper, Kafka and Kafka UI were running. Service health checks
  passed; UI, BFF, Claims Service and Keycloak endpoints returned HTTP 200.
- **Authentication:** Used the enabled, seeded Keycloak claimant
  (`claimant@demo.com`). Its password was read from the local realm import
  file into process-local environment variables; the variables were removed
  after each test command. No claimant account or committed secret was added.
- **Totals:** 14 UI cases executed; 14 passed, 0 failed, 0 skipped. The JUnit
  report records 0 failures and 0 errors.
- **Evidence capture:** One Playwright completion screenshot and one video are
  included for every case. The four authentication cases also have the
  shared-fixture full-page screenshot.
- **HTML report:** [Playwright report](playwright-report/index.html), with
  JUnit results and screenshot/video attachments. Raw trace archives are
  excluded.
- **Historical setup attempt:** The previous incomplete run is retained in
  [historical setup-failure evidence](historical-setup-failure-2026-11-24/execution-summary.md).

## Case results

| Test case ID | Scenario | Expected result | Actual result | Status | Screenshot evidence | Video | Related defect |
|---|---|---|---|---|---|---|---|
| TC_AUTH_001 | Login page displays required elements | Login heading, email/password controls and enabled Log In button are visible. | All assertions passed. | PASS | [Completion](screenshots/TC_AUTH_001--Login-page-displays-required-elements--passed--completion.png); [full page](screenshots/TC_AUTH_001--Login-page-displays-required-elements--passed--full-page.png) | [Video](videos/TC_AUTH_001--Login-page-displays-required-elements--passed.webm) | — |
| TC_AUTH_002 | Empty login form displays validation errors | Email/password errors appear and URL remains on login. | All assertions passed. | PASS | [Completion](screenshots/TC_AUTH_002--Empty-login-form-displays-validation-errors--passed--completion.png); [full page](screenshots/TC_AUTH_002--Empty-login-form-displays-validation-errors--passed--full-page.png) | [Video](videos/TC_AUTH_002--Empty-login-form-displays-validation-errors--passed.webm) | — |
| TC_AUTH_003 | Expired session displays an error message | Session-expired alert appears and the user remains on login. | All assertions passed. | PASS | [Completion](screenshots/TC_AUTH_003--Expired-session-displays-an-error-message--passed--completion.png); [full page](screenshots/TC_AUTH_003--Expired-session-displays-an-error-message--passed--full-page.png) | [Video](videos/TC_AUTH_003--Expired-session-displays-an-error-message--passed.webm) | — |
| TC_AUTH_004 | Claimant logs in and accesses claims page | Claimant is authenticated, redirected to `/claims`, and sees My Claims. | Successful login and claims-page assertions passed. | PASS | [Completion](screenshots/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--passed--completion.png); [full page](screenshots/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--passed--full-page.png) | [Video](videos/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--passed.webm) | DEF-002 retest (backend) |
| TC_CLAIM_001 | Empty incident details prevent navigation | Required incident fields are visible and Next is disabled when empty. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_001--Empty-incident-details-prevent-navigation--passed--completion.png) | [Video](videos/TC_CLAIM_001--Empty-incident-details-prevent-navigation--passed.webm) | — |
| TC_CLAIM_002 | Valid incident details navigate to Step 2 | Valid data enables Next and displays Supporting Details. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_002--Valid-incident-details-navigate-to-Step-2--passed--completion.png) | [Video](videos/TC_CLAIM_002--Valid-incident-details-navigate-to-Step-2--passed.webm) | — |
| TC_CLAIM_003 | Location shorter than five characters blocks Step 1 | A two-character location shows validation and keeps Next disabled. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_003--Location-shorter-than-five-characters-blocks-Step-1--passed--completion.png) | [Video](videos/TC_CLAIM_003--Location-shorter-than-five-characters-blocks-Step-1--passed.webm) | — |
| TC_CLAIM_004 | Description validation prevents invalid input | Short description keeps Next disabled; valid text enables Next and updates the counter. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_004--Description-validation-prevents-invalid-input--passed--completion.png) | [Video](videos/TC_CLAIM_004--Description-validation-prevents-invalid-input--passed.webm) | — |
| TC_CLAIM_005 | Back navigation preserves incident details | Back returns to Step 1 with the entered location and amount preserved. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_005--Back-navigation-preserves-incident-details--passed--completion.png) | [Video](videos/TC_CLAIM_005--Back-navigation-preserves-incident-details--passed.webm) | — |
| TC_CLAIM_006 | Review screen displays entered claim details | Review shows the incident location, amount and description; Submit is enabled. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_006--Review-screen-displays-entered-claim-details--passed--completion.png) | [Video](videos/TC_CLAIM_006--Review-screen-displays-entered-claim-details--passed.webm) | — |
| TC_CLAIM_007 | Claimant successfully submits a claim | POST returns HTTP 201; app navigates to claims and confirms submission. | HTTP 201 received, claims page opened and submission confirmation appeared. | PASS | [Screenshot](screenshots/TC_CLAIM_007--Claimant-successfully-submits-a-claim--passed--completion.png) | [Video](videos/TC_CLAIM_007--Claimant-successfully-submits-a-claim--passed.webm) | DEF-001 retest |
| TC_CLAIM_008 | Zero claim amount blocks Step 1 | Zero amount shows minimum-value validation and keeps Next disabled. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_008--Zero-claim-amount-blocks-Step-1--passed--completion.png) | [Video](videos/TC_CLAIM_008--Zero-claim-amount-blocks-Step-1--passed.webm) | — |
| TC_CLAIM_009 | Maximum allowed claim amount advances to Step 2 | Amount 1,000,000 is accepted and advances to Step 2. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_009--Maximum-allowed-claim-amount-advances-to-Step-2--passed--completion.png) | [Video](videos/TC_CLAIM_009--Maximum-allowed-claim-amount-advances-to-Step-2--passed.webm) | — |
| TC_CLAIM_010 | Ten-character description meets the minimum boundary | A 10-character description shows `10/1000` and enables Next. | All assertions passed. | PASS | [Screenshot](screenshots/TC_CLAIM_010--Ten-character-description-meets-the-minimum-boundary--passed--completion.png) | [Video](videos/TC_CLAIM_010--Ten-character-description-meets-the-minimum-boundary--passed.webm) | — |

## Defects

No new genuine UI defects were identified in the successful 14-case run.
DEF-001 (UI API base URL) and DEF-002 (backend user-not-found response
contract) remain previously reported, fixed defects. `TC_CLAIM_007` passed,
retesting DEF-001. `TC_AUTH_004` passed against a fresh database and seeded
claimant, retesting the UI impact of DEF-002 without reclassifying that
backend defect as a UI defect. See [DEFECT_REPORT.md](../DEFECT_REPORT.md).

## Evidence counts

- Screenshots: 18 (14 test-completion captures and 4 additional full-page
  authentication captures).
- Videos: 14 (one per executed case).

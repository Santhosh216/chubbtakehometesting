# Playwright UI Execution Summary

## Run details

- **Execution start:** 2026-11-24 14:54:20 IST (UTC+05:30)
- **Duration:** 61.493 seconds
- **Environment:** Windows 11; Node.js 26.13.1; Next.js 16.4.6
- **Browser:** Playwright 1.65.1, Chromium 159.0.8154.6 (headless)
- **Application services:** Playwright started the local UI. At verification,
  the Docker engine was unavailable and the BFF, Claims Service, Keycloak,
  PostgreSQL, Redis, and Kafka ports were not listening.
- **Test credentials:** `CHUBB_CLAIMANT_EMAIL` and
  `CHUBB_CLAIMANT_PASSWORD` were not configured.
- **Totals:** 14 UI cases executed; 3 passed, 11 errored during setup, 0
  skipped. Playwright reported 0 assertion failures and 11 errors. All cases
  ran in the Chromium project.
- **Evidence capture:** The existing Playwright configuration records video
  and screenshots; the shared test fixture also captures and attaches a
  full-page screenshot after each test. Failed cases have an additional
  Playwright failure screenshot.
- **Report:** [Playwright HTML report](playwright-report/index.html) and its
  JUnit results are included. Raw trace archives are intentionally excluded.

The 11 setup errors are not product failures: authenticated tests stopped in
the existing login page object because the required environment variables were
unset, before their scenario assertions ran. The UI behavior under those
authenticated scenarios remains unverified in this run.

## Case results

| Test case ID | Scenario | Expected result | Actual result | Status | Screenshot evidence | Video | Defect |
|---|---|---|---|---|---|---|---|
| TC_AUTH_001 | Login page displays required elements | Login heading, email and password controls are visible; Log In is enabled. | All assertions passed. | PASS | [Final screenshot](screenshots/TC_AUTH_001--Login-page-displays-required-elements--passed--final.png) | [Video](videos/TC_AUTH_001--Login-page-displays-required-elements--passed.webm) | — |
| TC_AUTH_002 | Empty login form displays validation errors | Email/password errors appear and the URL remains on login. | All assertions passed. | PASS | [Final screenshot](screenshots/TC_AUTH_002--Empty-login-form-displays-validation-errors--passed--final.png) | [Video](videos/TC_AUTH_002--Empty-login-form-displays-validation-errors--passed.webm) | — |
| TC_AUTH_003 | Expired session displays an error message | Session-expired alert appears and the user remains on login. | All assertions passed. | PASS | [Final screenshot](screenshots/TC_AUTH_003--Expired-session-displays-an-error-message--passed--final.png) | [Video](videos/TC_AUTH_003--Expired-session-displays-an-error-message--passed.webm) | — |
| TC_AUTH_004 | Claimant logs in and accesses claims page | Claimant login succeeds; `/claims` and My Claims heading are visible. | Setup stopped before login: required claimant environment variables were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--error--failure.png); [final screenshot](screenshots/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--error--final.png) | [Video](videos/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--error.webm) | — |
| TC_CLAIM_001 | Empty incident details prevent navigation | Incident fields are visible and Next is disabled when empty. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_001--Empty-incident-details-prevent-navigation--error--failure.png); [final screenshot](screenshots/TC_CLAIM_001--Empty-incident-details-prevent-navigation--error--final.png) | [Video](videos/TC_CLAIM_001--Empty-incident-details-prevent-navigation--error.webm) | — |
| TC_CLAIM_002 | Valid incident details navigate to Step 2 | Valid incident details enable Next and display Supporting Details. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_002--Valid-incident-details-navigate-to-Step-2--error--failure.png); [final screenshot](screenshots/TC_CLAIM_002--Valid-incident-details-navigate-to-Step-2--error--final.png) | [Video](videos/TC_CLAIM_002--Valid-incident-details-navigate-to-Step-2--error.webm) | — |
| TC_CLAIM_003 | Location shorter than five characters blocks Step 1 | A two-character location shows validation and keeps Next disabled. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_003--Location-shorter-than-five-characters-blocks-Step-1--error--failure.png); [final screenshot](screenshots/TC_CLAIM_003--Location-shorter-than-five-characters-blocks-Step-1--error--final.png) | [Video](videos/TC_CLAIM_003--Location-shorter-than-five-characters-blocks-Step-1--error.webm) | — |
| TC_CLAIM_004 | Description validation prevents invalid input | Short description keeps Next disabled; valid description enables it. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_004--Description-validation-prevents-invalid-input--error--failure.png); [final screenshot](screenshots/TC_CLAIM_004--Description-validation-prevents-invalid-input--error--final.png) | [Video](videos/TC_CLAIM_004--Description-validation-prevents-invalid-input--error.webm) | — |
| TC_CLAIM_005 | Back navigation preserves incident details | Back returns to Step 1 with the entered location and amount preserved. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_005--Back-navigation-preserves-incident-details--error--failure.png); [final screenshot](screenshots/TC_CLAIM_005--Back-navigation-preserves-incident-details--error--final.png) | [Video](videos/TC_CLAIM_005--Back-navigation-preserves-incident-details--error.webm) | — |
| TC_CLAIM_006 | Review screen displays entered claim details | Review shows incident details and enables Submit Claim. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_006--Review-screen-displays-entered-claim-details--error--failure.png); [final screenshot](screenshots/TC_CLAIM_006--Review-screen-displays-entered-claim-details--error--final.png) | [Video](videos/TC_CLAIM_006--Review-screen-displays-entered-claim-details--error.webm) | — |
| TC_CLAIM_007 | Claimant successfully submits a claim | POST returns HTTP 201; app navigates to claims and confirms submission. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_007--Claimant-successfully-submits-a-claim--error--failure.png); [final screenshot](screenshots/TC_CLAIM_007--Claimant-successfully-submits-a-claim--error--final.png) | [Video](videos/TC_CLAIM_007--Claimant-successfully-submits-a-claim--error.webm) | — |
| TC_CLAIM_008 | Zero claim amount blocks Step 1 | Zero amount shows minimum-value validation and keeps Next disabled. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_008--Zero-claim-amount-blocks-Step-1--error--failure.png); [final screenshot](screenshots/TC_CLAIM_008--Zero-claim-amount-blocks-Step-1--error--final.png) | [Video](videos/TC_CLAIM_008--Zero-claim-amount-blocks-Step-1--error.webm) | — |
| TC_CLAIM_009 | Maximum allowed claim amount advances to Step 2 | Amount 1,000,000 is accepted and advances to Step 2. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_009--Maximum-allowed-claim-amount-advances-to-Step-2--error--failure.png); [final screenshot](screenshots/TC_CLAIM_009--Maximum-allowed-claim-amount-advances-to-Step-2--error--final.png) | [Video](videos/TC_CLAIM_009--Maximum-allowed-claim-amount-advances-to-Step-2--error.webm) | — |
| TC_CLAIM_010 | Ten-character description meets the minimum boundary | A 10-character description shows `10/1000` and enables Next. | Setup stopped before the claims scenario: claimant credentials were unset. | ERROR (setup) | [Failure screenshot](screenshots/TC_CLAIM_010--Ten-character-description-meets-the-minimum-boundary--error--failure.png); [final screenshot](screenshots/TC_CLAIM_010--Ten-character-description-meets-the-minimum-boundary--error--final.png) | [Video](videos/TC_CLAIM_010--Ten-character-description-meets-the-minimum-boundary--error.webm) | — |

## Defects

No new genuine UI defects were observed. The 11 errors are setup blockers,
not application behavior. Previously documented, fixed defects DEF-001 and
DEF-002 are retained in [DEFECT_REPORT.md](../../DEFECT_REPORT.md); they were
not reproduced or retested by this run.

## Evidence counts

- Screenshots: 25 (one final screenshot for each case and one additional
  Playwright failure screenshot for each of the 11 setup errors).
- Videos: 14 (one per executed case).

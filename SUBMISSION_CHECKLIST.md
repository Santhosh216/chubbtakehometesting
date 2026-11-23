# Submission Readiness — Review Required

| Deliverable | File/location | Status |
|---|---|---|
| AI journal | `AI_WORKING_JOURNAL.md` | Current-thread prompts recorded; prompts from older sessions are disclosed as unavailable |
| Architecture | `ARCHITECTURE.md`, `architecture-diagram.excalidraw` | Complete |
| Test strategy | `TEST_STRATEGY.md` | Complete |
| Test cases | `TEST_CASES.md` | Complete — 10 UI and 4 API cases executed |
| Playwright UI Tests | `code/demo-app-ui/tests/e2e/` | Complete — POM, fixtures, 10 UI scenarios, screenshots and video |
| API Tests | `code/demo-app-ui/tests/e2e/api/claims.api.spec.ts` | Complete — 4 live contract checks passed with AJV schema validation |
| Defect Report | `DEFECT_REPORT.md` | Complete — local BFF base-path defect reproduced with screenshot/video, fixed and retested |

## Final execution evidence

- [x] Unit tests: 25 files passed, 266 tests passed.
- [x] Latest Playwright UI suite: 10 tests passed, 0 failed (35.6s; `code/demo-app-ui/playwright-report/results.xml`).
- [x] API suite: 4 tests passed in the earlier combined 14-test run (`code/demo-app-ui/test-evidence/previous-playwright-results-14-tests.xml`).
- [x] Playwright screenshots and videos retained.
- [x] Current UI HTML/JUnit reports and the prior API-inclusive JUnit report are retained.
- [x] No confirmed authorization defect reproduced.
- [x] Removed claimant credential fallbacks from Playwright source; credentials are required via environment.
- [x] Updated dependency audit: zero reported vulnerabilities after compatible upgrades.
- [x] Vitest JSON report and npm audit JSON included in `code/demo-app-ui/test-evidence/`.
- [x] Local claim API base-path defect fixed and claim submission regression-tested.
- [x] Production build and TypeScript validation pass.
- [x] ESLint reports no errors; non-blocking warnings remain in the project.

## Running locally
1. Start the provided stack following the repository's Docker Compose instructions.
2. In `code/demo-app-ui`, run `npm ci` (requires network/dependencies) and `npx playwright install chromium`.
3. Set `CHUBB_CLAIMANT_EMAIL` and `CHUBB_CLAIMANT_PASSWORD` in the shell; the tests do not embed credentials.
4. Run `npx.cmd playwright test tests/e2e/login.spec.ts tests/e2e/claims.spec.ts` on Windows.
5. For live API tests, acquire a bearer token and set `CHUBB_API_BASE_URL` and `CHUBB_API_TOKEN`, then run `npx.cmd playwright test tests/e2e/api/claims.api.spec.ts`.
6. Review `playwright-report`, `test-results` and `test-evidence` for reports, screenshots and video.

**ZIP note:** GitHub ZIP downloads do not contain `.git` commit history; the GitHub branch preserves commit history separately.

# HCLTech Submission Checklist

## Seven required deliverables

| # | Checkbox | Deliverable | Location | Status |
|---|---|---|---|---|
| 1 | [x] | AI Journal | `AI_WORKING_JOURNAL.md` | Exact prompts are archived verbatim; unavailable historical text is not reconstructed |
| 2 | [x] | Architecture | `ARCHITECTURE.md`, `architecture-diagram.excalidraw` | Reviewer-approved; diagram and labeled components are included |
| 3 | [x] | Test Strategy | `TEST_STRATEGY.md` | Risks, scope, entry criteria and exit criteria are complete |
| 4 | [x] | Test Cases | `TEST_CASES.md` | Ten claims cases, four authentication cases and seven API cases include test data and actual results |
| 5 | [x] | Playwright UI Tests | `code/demo-app-ui/tests/e2e/` | Ten `TC_CLAIM_*` cases are automated; 14 UI tests passed; POM, fixtures, assertions, screenshots, videos and traces are present |
| 6 | [x] | API Tests | `code/demo-app-ui/tests/e2e/api/claims.api.spec.ts` | 7 passed; AJV schemas and positive, negative and authorization validations are present |
| 7 | [x] | Defect Report | `DEFECT_REPORT.md` | Every field is completed; reproduced defects include sanitized evidence and retest status |

## Final submission check

- [x] All 7 sections above are fully completed.
- [x] All 7 deliverables are included in the workspace.
- [x] Submission should only be made after all checkboxes are reviewed and ticked.

## Verification — 2026-11-23

- TypeScript (`npx tsc --noEmit`): PASS.
- Production build (`npm run build`): PASS.
- Vitest: 25 files, 266 passed, 0 failed.
- Claims Service: 150 tests passed, including the 404 contract regression.
- BFF Service: 176 tests passed.
- Playwright UI: 14 passed, 0 failed, 0 errors, 0 skipped.
- Playwright API: 7 passed, 0 failed, 0 errors, 0 skipped.
- Health checks: Claims Service `:8080`, BFF `:8090` and UI `:3001` returned HTTP 200.

## Evidence

- `code/demo-app-ui/test-evidence/playwright-ui-results-2026-11-23.xml`
- `code/demo-app-ui/test-evidence/playwright-api-results-2026-11-23.xml`
- `code/demo-app-ui/test-evidence/vitest-results-2026-11-23.json`
- UI media: 22 PNG files, 14 videos and 3 traces under `code/demo-app-ui/test-results/`.
- Seven API traces are retained under `code/demo-app-ui/test-evidence/api-playwright-artifacts/`.
- Authenticated UI traces are disabled. The final review found JWT-formatted
  bearer tokens in six API traces under
  `code/demo-app-ui/test-evidence/api-playwright-artifacts/`; keep these local
  and do not include them unredacted in a submission package.
- The active workspace `.gitignore` now excludes that API trace directory;
  synchronize and review this rule in the original Git checkout before staging.
- Local development credentials are present in Docker Compose/Keycloak seed
  configuration and the README. No `.env` or private-key files were found.
- Sanitized pre-fix BFF evidence: `code/demo-app-ui/test-evidence/defect-repro/def-002-user-not-found-http-400-redacted.txt`.

## Remaining submission checks

- The active workspace has no `.git` directory. The original assessment
  checkout was located at `D:\Chubb_QA_Assessment\chubbtakehometesting` on
  `santhosh216-assessment` (`c0b35ff`). Its worktree has six modified tracked
  files and an untracked submission ZIP. Current workspace changes have not
  been synchronized, committed, or pushed.
- The existing `chubb-qa-final-submission.zip` is stale: it predates the final
  reports and omits the current date-stamped JUnit/Vitest reports and UI media.
  Regenerate it only after reviewed workspace changes are synchronized.
- Docker Hub resolution prevented rebuilding the service images. The backend
  JARs were updated in the existing local containers; the UI suite ran against
  a production build of the current workspace source. The original UI
  container was restored afterward. Rebuild the images from the final source
  when Docker Hub is reachable.
- Repository cleanup candidates are listed for approval only; no files were
  deleted. The existing `.gitignore` already excludes build output and local
  Playwright output while leaving `test-evidence/` available for submission.
- Exact prompt text unavailable from the accessible history was not invented.

## Re-running verification

1. Start the Docker infrastructure and application services.
2. Set `CHUBB_CLAIMANT_EMAIL` and `CHUBB_CLAIMANT_PASSWORD` in the shell.
3. From `code/demo-app-ui`, run `npx.cmd tsc --noEmit`,
   `npm.cmd run build`, and `npm.cmd test`.
4. Run UI tests with
   `npx.cmd playwright test tests/e2e/login.spec.ts tests/e2e/claims.spec.ts tests/e2e/authenticated-login.spec.ts`.
5. Set `CHUBB_API_BASE_URL` and `CHUBB_API_TOKEN`, then run
   `npx.cmd playwright test tests/e2e/api/claims.api.spec.ts`.

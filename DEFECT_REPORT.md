# Defect Report

## DEF-001 — Local UI API client default points to Claims Service instead of BFF

| Field | Value |
|---|---|
| Defect ID | DEF-001 |
| Status | Fixed and retested |
| Severity / priority | Major / High |
| Environment | Windows; Next.js 16.4.6; UI :3001; BFF :8090; Claims Service :8080 |
| Module | Demo UI API client configuration |
| Reproducibility | Reproducible when `NEXT_PUBLIC_BFF_URL` is unset |
| Detection source | `TC_CLAIM_007` Playwright claim-submission test execution |

### Preconditions

- Claims Service is running on port 8080 and BFF on port 8090.
- Run the UI locally on port 3001 with `NEXT_PUBLIC_BFF_URL` unset.
- Authenticate as a claimant using environment-provided test credentials.

### Steps to reproduce

1. Open `/claims/new`.
2. Enter valid incident information and a valid description.
3. Submit the claim.

### Expected result

The UI sends the request to the BFF, receives HTTP 201 and navigates to
`/claims` with a claim-submission confirmation.

### Actual result before fix

The UI API client defaulted to port 8080 (Claims Service), so the claim
request did not complete through the BFF. A direct request with the same
payload to the BFF returned HTTP 201, isolating the failure to the UI API
base URL.

### Root cause and resolution

`resolveBffBasePath()` used port 8080 as its fallback. It now defaults to
`http://localhost:8090`; Docker Compose configuration is unchanged.

### Evidence and retest

- [Controlled reproduction screenshot](code/demo-app-ui/test-evidence/defect-repro/claims-Insurance-Claims----46b98-uccessfully-submits-a-claim-chromium/test-failed-1.png)
- [Controlled reproduction video](code/demo-app-ui/test-evidence/defect-repro/claims-Insurance-Claims----46b98-uccessfully-submits-a-claim-chromium/video.webm)
- The claim-submission case passed in the current 14-test UI run.

## DEF-002 — Missing user response violates the documented 404 contract

| Field | Value |
|---|---|
| Defect ID | DEF-002 |
| Status | Fixed and retested |
| Severity / priority | Major / High |
| Environment | Local Claims Service and BFF; seeded Keycloak test account |
| Module | Claims Service user lookup / BFF login auto-provisioning |
| Reproducibility | Reproduced before fix when the claimant had no Claims Service user record |
| Detection source | Authenticated-login and claim-submission Playwright execution, followed by API/backend reproduction |

### Preconditions

- Start Keycloak, Claims Service and BFF.
- Use a seeded claimant account that has not yet been provisioned in the
  Claims Service.
- Provide login credentials through the approved local environment; do not
  place them in this report.

### Steps to reproduce

1. Submit the claimant login request to `POST /api/auth/login`.
2. Observe the BFF lookup for the claimant at `GET /api/users/{userId}`.
3. Inspect the response and BFF login result.

### Expected result

The user lookup returns HTTP 404 with the documented `Not Found` problem
response. The BFF recognizes the missing user, provisions it, and completes
login successfully.

### Actual result before fix

The Claims Service returned HTTP 400 with `title: Validation Error` and
`detail: User not found`. The BFF treated the response as an external-service
failure instead of the expected missing-user condition, causing login to
return HTTP 500.

### Root cause and resolution

`ClaimExceptionHandler.handleUserNotFound()` mapped `UserNotFoundException`
to HTTP 400, contradicting `claims-api.yml` and the BFF's 404 handling. The
handler now returns HTTP 404 with the contract's `Not Found` type and title.

### Evidence and retest

- [Sanitized BFF log evidence captured before the fix](code/demo-app-ui/test-evidence/defect-repro/def-002-user-not-found-http-400-redacted.txt)
- `ClaimExceptionHandlerTest`: 4 passed, including the 404 mapping assertion.
- Claims Service suite: 150 passed.
- Authenticated UI suite: 14 passed; API suite: 7 passed.

## Authorization candidate

Claimant access to `/api/admin/claims` was checked and returned HTTP 403 as
expected. It is not reported as a defect.

## Current Playwright results — 2026-11-23

- UI: 14 passed, 0 failed, 0 errors, 0 skipped.
- API: 7 passed, 0 failed, 0 errors, 0 skipped.
- JUnit reports: `code/demo-app-ui/test-evidence/playwright-ui-results-2026-11-23.xml`
  and `code/demo-app-ui/test-evidence/playwright-api-results-2026-11-23.xml`.
- Current UI screenshots, videos and traces are retained under
  `code/demo-app-ui/test-results/`. No application defect is inferred from
  the earlier Next.js development-server out-of-memory test-run interruption.

# Defect Report

## DEF-001 — Local UI API client default points to Claims Service instead of BFF

| Field | Value |
|---|---|
| Defect ID | DEF-001 |
| Status | Fixed and retested |
| Severity / priority | Major / High |
| Environment | Windows; Next.js 16.4.6; UI :3001; BFF :8090; Claims Service :8080 |
| Module | Demo UI API client configuration |
| Related test case | TC_CLAIM_007 |
| Reproducibility | Reproducible when `NEXT_PUBLIC_BFF_URL` is unset |
| Detection source | `TC_CLAIM_007` Playwright claim-submission test execution |

### Preconditions

- Claims Service is running on port 8080 and BFF on port 8090.
- Run the UI locally on port 3001 with `NEXT_PUBLIC_BFF_URL` unset.
- Authenticate as a claimant using environment-provided test credentials.

### Test data

- Incident date: yesterday
- Location: `123 Main Street, Springfield`
- Claim amount: `1500.50`
- Description: `The vehicle was damaged in a parking lot.`

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
- **Retest — 2026-11-24:** `TC_CLAIM_007` passed against the BFF; the browser
  observed HTTP 201, the claims page, and the claim-submission confirmation.
  See the [retest screenshot](execution-evidence/screenshots/TC_CLAIM_007--Claimant-successfully-submits-a-claim--passed--completion.png)
  and [retest video](execution-evidence/videos/TC_CLAIM_007--Claimant-successfully-submits-a-claim--passed.webm).

## DEF-002 — Missing user response violates the documented 404 contract

| Field | Value |
|---|---|
| Defect ID | DEF-002 |
| Status | Fixed and retested |
| Severity / priority | Major / High |
| Environment | Local Claims Service and BFF; seeded Keycloak test account |
| Module | Claims Service user lookup / BFF login auto-provisioning |
| Related test case | TC_AUTH_004 (UI retest of backend behavior) |
| Reproducibility | Reproduced before fix when the claimant had no Claims Service user record |
| Detection source | Authenticated-login and claim-submission Playwright execution, followed by API/backend reproduction |

### Preconditions

- Start Keycloak, Claims Service and BFF.
- Use a seeded claimant account that has not yet been provisioned in the
  Claims Service.
- Provide login credentials through the approved local environment; do not
  place them in this report.

### Test data

- Enabled seeded Keycloak claimant from
  `docker/compose/keycloak/demo-app-realm.json`.
- No matching user record in the fresh Claims Service database before the
  first login. The password is not included in this report.

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
- **Retest — 2026-11-24:** `TC_AUTH_004` passed against a fresh database and
  seeded Keycloak claimant. The UI login succeeded and the user was provisioned.
  See the [retest screenshot](execution-evidence/screenshots/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--passed--completion.png)
  and [retest video](execution-evidence/videos/TC_AUTH_004--Claimant-successfully-logs-in-and-accesses-claims-page--passed.webm).
- **Classification:** This remains a backend/API contract defect, not a new
  UI defect. The earlier login impact was demonstrated through UI execution;
  the current UI retest passed.

## Authorization candidate

Claimant access to `/api/admin/claims` was checked and returned HTTP 403 as
expected. It is not reported as a defect.

## Previous Playwright results — 2026-11-23

- UI: 14 passed, 0 failed, 0 errors, 0 skipped.
- API: 7 passed, 0 failed, 0 errors, 0 skipped.
- JUnit reports: `code/demo-app-ui/test-evidence/playwright-ui-results-2026-11-23.xml`
  and `code/demo-app-ui/test-evidence/playwright-api-results-2026-11-23.xml`.
- These are historical results; the generated `test-results` directory was
  regenerated by the 2026-11-24 run and no longer contains the 2026-11-23 media.
  The dated JUnit reports remain unchanged. No application defect is inferred
  from the earlier Next.js development-server out-of-memory interruption.

## Latest UI execution — 2026-11-24

- 14 UI cases executed in Chromium: 14 passed, 0 failed, 0 skipped.
- Docker Engine 29.9.3 was running. UI, BFF, Claims Service, Keycloak,
  PostgreSQL, Redis, Zookeeper, Kafka and Kafka UI were healthy.
- The enabled Keycloak claimant was read from the local realm import and
  supplied through process-local environment variables; no credentials were
  added to the repository.
- No new genuine UI defects were identified. The earlier 3-pass/11-setup-error
  attempt is retained at
  `execution-evidence/historical-setup-failure-2026-11-24/`.
- The latest per-case screenshots, videos, HTML report, and expected/actual
  results are in `execution-evidence/`. Raw trace archives are excluded.
- The original DEF-001 failure screenshot/video and DEF-002 sanitized backend
  log were verified and remain available at their links above. Their current
  retest outcomes are recorded in each defect's evidence section.

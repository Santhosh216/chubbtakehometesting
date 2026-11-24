# Chubb Claims Application Test Cases

**Execution date:** 2026-11-23  
**Results:** 14 UI tests passed; 7 API tests passed. See the date-stamped JUnit
reports under `code/demo-app-ui/test-evidence/`.

| Test case ID | Priority / type | Preconditions | Test data | Steps | Expected result | Actual result |
|---|---|---|---|---|---|---|
| TC_AUTH_001 | High / positive | UI is available at `/login` | None | Open login page; inspect heading, email, password and Log In button | Required controls are visible and the button becomes enabled after hydration | PASS; UI JUnit report |
| TC_AUTH_002 | High / negative | UI is available at `/login` | Empty email and password | Submit the empty login form | Email/password validation errors appear; URL remains `/login` | PASS; UI JUnit report |
| TC_AUTH_003 | Medium / negative | UI is available | `/login?session_expired=true` | Open URL and inspect alert and resulting URL | Session-expired message appears; user remains on login | PASS; UI JUnit report |
| TC_AUTH_004 | High / positive | Live BFF and seeded claimant account; credentials supplied via environment variables | `CHUBB_CLAIMANT_EMAIL`, `CHUBB_CLAIMANT_PASSWORD` | Sign in through the Login Page Object Model | Redirect to `/claims`; My Claims heading appears | PASS; UI JUnit report |
| TC_CLAIM_001 | High / negative | Authenticated claimant; open `/claims/new` | No incident values | Inspect Step 1 fields and Next button | Fields are visible and Next is disabled | PASS; UI JUnit report |
| TC_CLAIM_002 | High / positive | Authenticated claimant; valid incident date | Location `123 Main Street, Springfield`; amount `1500.50` | Enter incident data and select Next | Next is enabled and Step 2 appears | PASS; UI JUnit report |
| TC_CLAIM_003 | High / negative boundary | Authenticated claimant; otherwise valid Step 1 data | Location `NY` (2 characters) | Enter valid data, replace location with `NY` | Location validation is shown and Next is disabled | PASS; UI JUnit report |
| TC_CLAIM_004 | High / negative and positive | Authenticated claimant; valid Step 1 data | Description `Short`, then `The vehicle was damaged in a parking lot.` | Advance to Step 2; enter short text, then valid text | Next remains disabled for short text and enables for valid text; counter updates | PASS; UI JUnit report |
| TC_CLAIM_005 | Medium / positive | Authenticated claimant; valid Step 1 data | Location `123 Main Street, Springfield`; amount `1500.50` | Advance to Step 2, then select Back | Step 1 reappears with location and amount preserved | PASS; UI JUnit report |
| TC_CLAIM_006 | High / positive | Authenticated claimant; valid Step 1 data | Description `The vehicle was damaged in a parking lot.` | Complete Steps 1–2 and inspect review | Review shows location, amount and description; Submit is enabled | PASS; UI JUnit report |
| TC_CLAIM_007 | High / positive | Authenticated claimant; valid complete claim | Yesterday's incident date; location and description above; amount `1500.50` | Submit and await POST `/api/claims` | HTTP 201; navigate to `/claims`; confirmation includes claim ID | PASS; UI JUnit report |
| TC_CLAIM_008 | High / negative boundary | Authenticated claimant; otherwise valid Step 1 data | Claim amount `0` | Enter valid data and set amount to zero | Minimum-amount validation appears and Next is disabled | PASS; UI JUnit report |
| TC_CLAIM_009 | High / positive boundary | Authenticated claimant; valid date and location | Maximum claim amount `1000000` | Enter Step 1 data and select Next | Next is enabled and Step 2 appears | PASS; UI JUnit report |
| TC_CLAIM_010 | Medium / positive boundary | Authenticated claimant; valid Step 1 data | Description `1234567890` (10 characters) | Advance to Step 2 and enter description | Counter reads `10/1000`; Next is enabled | PASS; UI JUnit report |
| API_001 | High / positive | BFF available; valid bearer token | GET `/api/claims` | Send authenticated list request | HTTP 200, JSON content type and AJV-valid claims-list response | PASS; API JUnit report |
| API_002 | High / negative | BFF available | GET `/api/claims` without authorization | Send request without token | HTTP 401 or 403; response is not successful | PASS; API JUnit report |
| API_003 | High / negative | BFF available; valid bearer token | Claim ID `not-a-valid-claim-id` | Request claim by invalid ID | HTTP 400 or 404; response is not successful | PASS; API JUnit report |
| API_004 | High / negative | BFF available; valid bearer token | POST `/api/claims` with `{}` | Submit request with required fields missing | HTTP 400 or 422; response conforms to ProblemDetail schema | PASS; API JUnit report |
| API_005 | High / negative | BFF available; valid bearer token | Valid incident date/location/description; amount `0` | Submit claim with invalid amount | HTTP 400 or 422; response is not successful | PASS; API JUnit report |
| API_006 | High / negative | BFF available; valid bearer token | Malformed JSON `{"incidentLocation":` | Submit malformed JSON | HTTP 400, 415 or 422; response is not successful | PASS; API JUnit report |
| API_007 | High / positive | BFF available; valid bearer token | Yesterday's date; location `123 Main Street, Springfield`; description `Playwright API contract validation claim.`; amount `1500.5` | Validate request schema; submit claim | HTTP 201 and AJV-valid claim response with required fields | PASS; API JUnit report |

## Automation traceability

- `TC_AUTH_001`–`TC_AUTH_003` map to `tests/e2e/login.spec.ts`;
  `TC_AUTH_004` maps to `tests/e2e/authenticated-login.spec.ts`.
- `TC_CLAIM_001`–`TC_CLAIM_010` map to `tests/e2e/claims.spec.ts`.
- `API_001`–`API_007` map to `tests/e2e/api/claims.api.spec.ts`.
- Authenticated UI tests read credentials from environment variables; the
  automation does not embed credentials.

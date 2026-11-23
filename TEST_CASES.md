# Test Cases — Chubb Claims Application

**Source:** `claims.spec.ts`, `login.spec.ts` and `api/claims.api.spec.ts`. **Execution:** Latest UI run passed 10/10 cases after the terminal fixes. The four API cases passed in the earlier combined run; its JUnit report is retained at `code/demo-app-ui/test-evidence/previous-playwright-results-14-tests.xml`.

| ID | Type | Preconditions | Steps / test data | Expected result | Execution |
|---|---|---|---|---|---|
| TC_AUTH_001 | Positive | App running | Open `/login` | Heading, email, password, login button displayed | PASS |
| TC_AUTH_002 | Negative | App running | Submit empty login form | Email and password errors; remains on login | PASS |
| TC_AUTH_003 | Negative | App running | Open `/login?session_expired=true` | Session-expired alert | PASS |
| TC_AUTH_004 | Positive | `claimant@demo.com` / `Claimant123!` | Log in as claimant | Redirect to claims and My Claims heading | PASS |
| TC_CLAIM_001 | Negative | Authenticated claimant | Open new claim; leave incident fields empty | Next disabled | PASS |
| TC_CLAIM_002 | Positive | Authenticated claimant | Incident date yesterday; `123 Main Street, Springfield`; `1500.50` | Next enabled; Step 2 visible | PASS |
| TC_CLAIM_004 | Negative/positive | Authenticated claimant | Description `Short`, then `The vehicle was damaged in a parking lot.` | Next disabled then enabled; counter updates | PASS |
| TC_CLAIM_005 | Positive | Authenticated claimant | Enter incident data; advance; Back | Incident location and amount preserved | PASS |
| TC_CLAIM_006 | Positive | Authenticated claimant | Complete incident and supporting details | Review shows location, amount and description | PASS |
| TC_CLAIM_007 | Positive | Authenticated claimant | Submit complete claim | Redirect and success message with claim ID | PASS |

## API coverage

| ID | Type | Input | Expected | Execution |
|---|---|---|---|---|
| API_001 | Positive | Authenticated GET `/api/claims` | HTTP 200, JSON and AJV claim-summary schema | PASS |
| API_002 | Negative | GET `/api/claims` without token | HTTP 401 or 403 | PASS |
| API_003 | Negative | GET `/api/claims/not-a-valid-claim-id` | HTTP 400 or 404 | PASS |
| API_004 | Negative | POST `/api/claims` with `{}` | HTTP 400 or 422 | PASS |

# Chubb QA Assessment - Test Strategy

## Scope

### In scope
- Login and session-expired UI behavior.
- Claim wizard positive, negative and navigation behavior.
- Claim submission and review data.
- Claim API authentication, response schema and invalid input behavior.
- Frontend unit/component behavior.
- Role authorization on an admin endpoint.

### Out of scope
- Production load/stress testing.
- Visual regression across all themes and browsers.
- Exhaustive browser and mobile combinations.
- Full penetration testing.
- Recoverability and disaster-recovery testing.

## Entry criteria
- Docker Compose infrastructure is running.
- UI is reachable on `http://localhost:3001`.
- BFF and Claims services report healthy.
- Test claimant credentials exist in Keycloak.
- Playwright Chromium is installed.

## Exit criteria
- Final UI suite passes.
- Final live API suite passes.
- Frontend unit suite passes.
- JUnit, HTML, screenshot and video evidence is available.
- Any defect is reproducible and evidence-backed.

## Highest-risk areas

1. Authentication and authorization:
   Keycloak JWT validation, role-based access and claimant ownership.

2. Claims lifecycle:
   Claim creation, retrieval, updates, status transitions and validation.

3. Inter-service communication:
   BFF to Claims Service API integration.

4. Event-driven processing:
   Kafka event publication, consumption and WebSocket updates.

5. Persistence:
   PostgreSQL repositories, data integrity and transaction behaviour.

6. Frontend:
   Claim submission, validation, admin workflows and error handling.

## Test prioritisation

- Unit tests for business logic and domain rules.
- Component tests for user-visible frontend behaviour.
- Controller tests for API contracts and HTTP responses.
- Integration tests for persistence, messaging and security.
- End-to-end tests for critical user journeys.
- Contract/schema checks for live API responses.
- Serial Playwright execution to avoid shared-session interference.

## Deliberately deferred

- Large-scale performance and load testing.
- Visual regression across all browsers.
- Exhaustive cross-browser combinations.
- Full production-scale resilience testing.

## Security observation requiring verification

A claimant-role JWT was tested against `GET /api/admin/claims`.
The live result was HTTP 403, as required. This candidate finding is closed
as not reproducible and is not a confirmed defect.

An actual local-development defect was reproduced: when
`NEXT_PUBLIC_BFF_URL` was unset, the UI API client targeted port 8080
(Claims Service) rather than port 8090 (BFF), and claim submission failed.
The default now targets the BFF; the claim-submission E2E test passed after
the fix. See `DEFECT_REPORT.md`.

## Environment concern

The project specifies Java 21. Java 25 caused Mockito/Byte Buddy
agent initialization errors during test execution.

## Dependency security review — 2026-11-23

The initial `npm audit` reported 22 advisories (2 critical, 15 high,
3 moderate and 2 low), including a critical Next.js advisory. Updated
Next.js and `eslint-config-next` to 16.4.6 and applied compatible
`npm audit fix` updates. The post-update audit reports zero vulnerabilities.
The final unit and E2E suites were rerun after these dependency changes.

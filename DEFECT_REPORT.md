# Defect Report

**ID:** DEF-001  
**Title:** Local UI API client default points to Claims Service instead of BFF  
**Status:** Fixed and retested  
**Severity:** Major — claim submission fails when running the UI locally  
**Priority:** High  
**Environment:** Windows local development, Next.js 16.4.6, BFF :8090, Claims Service :8080  
**Module:** Demo UI API client configuration  
**Reported by:** QA  
**Date:** 2026-11-23

## Description

When `NEXT_PUBLIC_BFF_URL` was unset, the generated API client defaulted to
`http://localhost:8080`, the Claims Service. The UI login flow uses the BFF
on port 8090, and the Next.js `/api` rewrite also targets the BFF. As a result,
the client bypassed the BFF for claim operations in local development.

## Preconditions

- Start Claims Service on port 8080 and BFF on port 8090.
- Run the UI locally with `npm run dev -- --port 3001`.
- Leave `NEXT_PUBLIC_BFF_URL` unset.
- Authenticate with a claimant account.

## Steps to reproduce

1. Open `/claims/new`.
2. Enter valid incident information and a valid description.
3. Submit the claim.

## Expected result

The UI posts the claim through the BFF, receives HTTP 201 and navigates to
`/claims` with a claim-submitted confirmation.

## Actual result before fix

The browser could not complete its claim API request and remained on
`/claims/new`. With the incorrect base configured, the response wait timed out.
A direct request with the same payload to the BFF returned HTTP 201, isolating
the issue to the UI's API base URL.

## Evidence

- [Controlled reproduction screenshot](code/demo-app-ui/test-evidence/defect-repro/claims-Insurance-Claims----46b98-uccessfully-submits-a-claim-chromium/test-failed-1.png)
- [Controlled reproduction video](code/demo-app-ui/test-evidence/defect-repro/claims-Insurance-Claims----46b98-uccessfully-submits-a-claim-chromium/video.webm)
- [Playwright HTML report](code/demo-app-ui/playwright-report/index.html)

## Root cause and fix

The fallback base URL used port 8080 instead of the BFF port 8090. Changed
`resolveBffBasePath()` to default to `http://localhost:8090`. Docker Compose's
explicit configuration remains unchanged.

## Retest

The claim submission test passed on the updated local Next.js runtime. Full
suite results are recorded in the Playwright JUnit report. No credentials or
access tokens are included in this report.

## Related investigation

The earlier candidate claim that claimant access to `/api/admin/claims` was
allowed was not reproducible. A claimant token received HTTP 403 as expected;
it is not reported as a defect.

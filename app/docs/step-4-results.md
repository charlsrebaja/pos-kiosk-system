# Step 4 actual checks

Date: October 7, 2026 (Australia/Perth). Branch: `feature/payment-processing`.
Prerequisite: local HEAD `6dc40c0`, the merged Step 3 PR. No fetch, commit, push, PR, teammate review, or deployment was performed.

## Implementation

- `payment-processing.tsx`: RHF/Zod cash form, inline errors, demo QR instructions/confirmation, card instructions/processing, disabled controls, and minimal completion handoff.
- `payment-schema.ts`: strict decimal string parsing into safe integer centavos, compared with actual total.
- Store/types: guarded submission, synchronous duplicate lock, protected order, copied/frozen completed transaction with UUID reference and ISO completion timestamp.
- Payment method/kiosk: Step 3 Continue now enters Step 4. Existing tests were updated to return to methods before editing an unpaid order.
- No final Step 5 screen, receipt, reset control, real payment gateway, or real card input.

## Automated results

`npm run lint`: passed. `npm run typecheck`: passed. `npm run build`: passed with local worker permission. `npm run test`: 47 tests passed, zero failed (22 existing/adapted, 25 payment tests).

| Check | Observed result |
|---|---|
| PHP175 / PHP200 cash | paid 20000, change 2500 centavos |
| PHP175 / PHP175 cash | paid 17500, change 0 |
| PHP175 / PHP175.01 cash | change 1 centavo |
| Blank and whitespace | rejected; inline/store error; no snapshot |
| abc, 200abc, 1e3, 1,000, 200., .50 | rejected |
| -200, -0, NaN, Infinity, -Infinity | rejected |
| 175.001 | rejected excessive precision |
| 100, 0, 174.99 | rejected insufficient cash |
| 90071992547409.92 | rejected unsafe centavo range |
| Retry after rejection | completes once; clears error |
| PHP140 edited order / PHP200 | change 6000; total taken from actual cart |
| QR/card PHP175 | paid equals total 17500; change 0 |
| QR PHP140 | paid equals updated total 14000 |
| Processing | state set before await; edits, method changes, Back blocked |
| Cash: 21 same-tick submissions | one succeeds; subscriber sees exactly one completed snapshot |
| QR/card duplicate submissions | one succeeds; one completion publication per store |
| Repeated submission after success | rejected; same snapshot identity/reference retained |
| Immutability | object, array, each line frozen; names/quantities/prices/subtotals verified |
| References/timestamp | UUID-shaped references differ across kiosk instances; timestamp parses |
| Empty/out-of-order request | rejected without completing |

## Browser results

Verified the local preview on port 3002 through the in-app browser. Cash total PHP175, explicit label and Pay Now were visible. Blank plus all 17 other invalid strings above showed inline errors and stayed on Cash. Valid PHP200 with double click visibly disabled the field, Pay Now and Back during processing, then showed the minimal completion handoff. Exact PHP175 also completed. QR had a labeled non-scannable demo placeholder, scan instructions, confirmation, PHP175 total, and double-click completion. Card had PHP175 total, tap/insert/swipe instructions, no card fields, and visibly disabled Process/Back with processing text before the handoff. Captured browser warning/error logs were empty at the card completion check. A completion screenshot was viewed in the tool output; no screenshot file is claimed.

Snapshot arithmetic/count/immutability were checked through automated store tests, not by exposing store internals in the browser. Physical touchscreen/device testing was not performed. Refresh was used between browser transactions because the New Transaction feature belongs to Step 7.

## Observations and corrections

1. First typecheck found TS2737: the generated schema used a BigInt literal (`100n`) but this project's TS target is below ES2020. Corrected to `BigInt(100)` without changing the target. Final typecheck/build passed. This is a real uncommitted implementation correction, not a previously committed payment bug. Its eventual authored commit SHA is pending; do not manufacture a broken commit or claim a separate fix commit exists.
2. Five Step 3 tests initially expected the old inline handoff and direct edits while on methods. Updated for the intentional Step 4 screen transition and Back to Methods; all now pass.
3. Test/build subprocesses initially failed with sandbox `spawn EPERM`; approved retries passed. Preview startup initially lost its port option through PowerShell `npm`; `npm.cmd run dev -- --port=3002` worked. These are environment/command issues, not payment defects.
4. One automation sequence clicked immediately after browser reload and reached QR with PHP85 rather than the intended PHP175 sample. Cause not established; no fix or app defect claim is made. The QR confirmed the actual visible PHP85 order. Repeating after observing the refreshed item screen produced PHP175 and completed QR successfully. Retain this observation for review if early-load clicks are reproducibly lost; attach actual reproduction and a real correction SHA if confirmed. Do not label it a fixed bug without that evidence.

No payment arithmetic, rejection, duplicate-snapshot, or edit-lock defect remained observed in the performed checks. Human evaluation/review remain pending.

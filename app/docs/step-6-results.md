# Step 6 Receipt: actual results

Date: October 7, 2026, Asia/Manila. Existing branch: `feature/receipt`. Starting HEAD: `0f6a1fe`, the merge of Step 5 Payment Successful (PR #4). The working tree was clean before these changes. No commit, push, PR, merge, or deployment was performed in this phase.

## Implementation and data boundary

`src/components/kiosk/receipt.tsx` renders all receipt details from `completedTransaction`, including copied purchased items, quantities, unit prices, subtotals, total, method, paid amount, change, reference, and completion timestamp. It never reads the active cart or creates receipt data. Monetary values remain integer centavos and use the existing `formatMoney` only for display.

The existing successful-payment event remains the only place that creates a UUID reference and ISO completion time. Its transaction object, item array, and individual lines are frozen. `requestReceipt` now advances from completed success to receipt; `backToSuccess` returns from receipt to confirmation. Both require a completed snapshot and no pending payment. Repeated requests and reopening reuse the original object. The screen component independently requires receipt screen, completed transaction, and no pending processing.

`src/lib/transaction-time.ts` formats the original ISO instant with `Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" })`. Confirmation and receipt share this function, explicitly label Manila, and retain the original ISO in their time elements. This prevents the customer's device timezone from changing the displayed completion date. Tests include conversion across UTC midnight.

New Transaction is visible and responds with a clearly labeled Step 7 handoff. It does not reset this completed transaction. No printing, history, database, authentication, inventory, or real payment gateway was added. The mounted in-memory session is lost on browser refresh, as in previous phases.

## Executed checks

Commands ran from `app` against the implemented code:

| Command | Actual outcome |
|---|---|
| `npm.cmd run lint` | Passed, exit 0; no ESLint diagnostics |
| `npm.cmd run typecheck` | Passed, exit 0; Next route generation and TypeScript successful |
| `npm.cmd run test` | 56 passed, 0 failed |
| `npm.cmd run build` | Passed, exit 0; Webpack production build with static `/` and `/_not-found` |

The first sandboxed test invocation stopped before running tests because tsx could not read the Windows user profile (`uv_os_get_passwd` / ENOMEM). An approved execution outside the sandbox ran the same command successfully. This was an environment failure, not an application regression.

Five new receipt tests cover all three methods' item and money fields, guards for empty/rejected/pending/missing-snapshot sessions, snapshot identity/content after unrelated live-cart changes, repeated confirmation/receipt transitions, and explicit Manila formatting for hosts set to UTC, Los Angeles, and Tokyo. Existing success tests were updated for actual receipt navigation. Prior 51 tests also passed.

## Production browser demo

Production preview: `npm.cmd run start -- --port 3003`, [localhost:3003](http://localhost:3003/). Each payment was created using the product, summary, method, and processing UI. Browser refresh separated the three independent demos because Step 7 reset is not implemented. All payments were simulated.

Every receipt showed the following purchased fields:

| Item | Quantity | Unit price | Subtotal |
|---|---:|---:|---:|
| Coffee | 2 | PHP45.00 | PHP90.00 |
| Sandwich | 1 | PHP50.00 | PHP50.00 |
| Soft Drink | 1 | PHP35.00 | PHP35.00 |

| Receipt method label | Total | Paid | Change | Original confirmation reference and ISO timestamp reused |
|---|---:|---:|---:|---|
| Cash | PHP175.00 | PHP200.00 | PHP25.00 | Yes |
| QR Payment | PHP175.00 | PHP175.00 | PHP0.00 | Yes |
| Credit/Debit Card | PHP175.00 | PHP175.00 | PHP0.00 | Yes |

Actual generated demo identities:

| Method | Reference | Original completion ISO | Confirmation and receipt display (Asia/Manila) |
|---|---|---|---|
| Cash | `TXN-a80b5f2b-74fe-4196-b3ee-ff40ba9a102c` | `2026-10-07T10:01:11.855Z` | Oct 7, 2026, 6:01 PM |
| QR | `TXN-60ead90a-5152-42e5-b05a-313370e79c50` | `2026-10-07T10:03:13.731Z` | Oct 7, 2026, 6:03 PM |
| Card | `TXN-f8f3d208-e1fd-4e28-9aaa-b96a0c0b622e` | `2026-10-07T10:05:56.281Z` | Oct 7, 2026, 6:05 PM |

Cash paid PHP100 was rejected on processing with no View Receipt control. While Card was pending, processing feedback was visible, controls were disabled, and there was no View Receipt control. Completed Card showed correct items and amounts after processing. Returning to confirmation and reopening Cash and Card kept the same reference and ISO timestamp; the automated tests also repeated this three times for every method.

Clicking New Transaction on the Cash receipt displayed: “New Transaction will start a fresh order in Step 7. Your completed receipt stays available here for now.” The receipt remained available. This demonstrates the requested handoff, not a completed reset.

Saved and visually inspected actual screenshots:

- [Cash desktop receipt, 1280px viewport](evidence/step-6-cash-desktop.png)
- [Cash mobile receipt, 390px viewport](evidence/step-6-cash-mobile.png)
- [QR receipt, default narrow browser panel](evidence/step-6-qr.png)
- [Card receipt, 320px viewport](evidence/step-6-card.png)

No horizontal document overflow was observed at 390px and 320px. Receipt action buttons measured 56px high; desktop and mobile layouts were readable, and the long reference wrapped. Temporary viewport overrides were reset afterward. Final captured browser warning/error log was empty. Browser clicks and viewport simulations were tested; physical touch hardware was not tested.

## Review boundary

Step 6 implementation is ready for human review. Actual student evaluation, Git commit SHA, pushed branch, PR URL, teammate review, and merge evidence remain pending. See [review instructions](step-6-review.md), [PR draft](step-6-pr.md), and [AI development record](ai/phase-06.md). Stop here; implement working reset separately in Step 7 after this phase is reviewed and merged.

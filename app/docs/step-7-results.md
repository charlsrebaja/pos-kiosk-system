# Step 7 New Transaction: actual results

Date: October 7, 2026, Asia/Manila. Branch: `feature/new-transaction`, provided by the user and verified clean at `67bce1d` (merged Step 6, PR #5). No commit, push, PR, merge, or deployment was performed for Step 7.

## Reset behavior

The existing receipt button now invokes Zustand's `resetTransaction`. One synchronous state update returns to Items and clears items, selected method, product feedback, payment error, processing status, payment/receipt handoff flags, and the entire completed snapshot. Total is derived from the empty cart and becomes zero. Confirmed order lines, paid amount, change, reference, and timestamp are contained in the snapshot and disappear when it is cleared. The old frozen object is not mutated and no history reference is retained by the store. The six-product local catalog is unchanged.

The provider stays mounted; the page is not reloaded. Screen composition unmounts the old payment form on leaving processing, discarding its React Hook Form values, validation errors, submission state, and local submission ref. The next payment component creates a new form with `amountPaid: ""`. A mounted-instance guard ignores a form resolver callback after its payment screen unmounts. Receipt's local Step 7 placeholder state and message have been removed.

Each reset advances a private transaction generation inside the store. A simulated payment captures its generation before waiting. Both its delayed success path and its catch path return without modifying state if reset has made it obsolete. Existing order/screen/method/processing checks remain. The internal action can therefore invalidate pending work safely; the customer-facing New Transaction button appears only on Receipt.

## Executed checks

| Command (from `app`) | Observed outcome |
|---|---|
| `npm.cmd run lint` | Passed, exit 0, no diagnostics |
| `npm.cmd run typecheck` | Passed, exit 0, Next type generation and TypeScript successful |
| `npm.cmd run test` | 63 passed, 0 failed; prior 56 and seven new checks |
| `npm.cmd run build` | Passed, exit 0, Webpack production build; static `/` and `/_not-found` |

The first sandboxed test command stopped before executing tests because tsx could not access the Windows user profile (`uv_os_get_passwd`, ENOMEM). The identical test command passed with approved execution outside the sandbox. This was not an observed application defect.

New automated checks cover reset after Cash, QR, and Card, complete clearing of active fields, catalog preservation, blocked empty checkout/receipt navigation, a different second order and method with a new reference/time, blank cash rejection, clearing rejected-payment errors, repeated reset, and preserved store actions. An abandoned Card delay was followed by a new Card payment: the old callback returned false without restoring a receipt or clearing the current lock. A simulated timer failure was followed by a new QR payment: the obsolete catch path could not inject an error or unlock it. Injected failure is a regression-test scenario, not invented real bug evidence.

## Browser demonstration without reload

Production preview ran at [localhost:3004](http://localhost:3004/) using `npm.cmd run start -- --port 3004`. The following were consecutive transactions in the same mounted kiosk, using product/summary/method/payment/receipt UI and New Transaction. No refresh or full-page navigation separated them.

| Field | First order | Second order |
|---|---|---|
| Items | Coffee x2, Sandwich x1, Soft Drink x1 | Bottled Water x1, Cookies x1 |
| Total | PHP175.00 | PHP45.00 |
| Method | Cash | QR Payment |
| Paid | PHP200.00 | PHP45.00 |
| Change | PHP25.00 | PHP0.00 |
| Reference | `TXN-ad24913e-1ecf-4014-9997-0bb3747126fa` | `TXN-aa26e040-dfd5-441b-a3e3-0d4f66c9c542` |
| Completion ISO | `2026-10-07T10:32:31.296Z` | `2026-10-07T10:33:18.898Z` |
| Manila display | Oct 7, 2026, 6:32 PM | Oct 7, 2026, 6:33 PM |

Actual observations:

1. First cash attempt paid PHP100 and showed “Amount paid must cover the total due.” Correcting to PHP200 completed the PHP175 order and showed PHP25 change on confirmation/receipt.
2. Clicking New Transaction immediately returned to Item Selection, 0 items, an empty-cart message, PHP0.00 total, and disabled Continue. Feedback was blank. Previous reference, receipt fields, completion time, paid/change details, and cash input were absent. All six product names/prices remained visible and usable.
3. The new Bottled Water/Cookies order totaled PHP45. Payment methods were all unselected and Continue was disabled until a fresh choice.
4. Selecting Cash for inspection opened an empty amount field, `aria-invalid=false`, and no old cash error. Submitting it blank showed “Enter the amount paid.” No previous PHP200 value was used.
5. Back to Payment Methods, select QR, Continue, Confirm Payment completed the second order. Its receipt had only Bottled Water and Cookies, paid PHP45, zero change, QR Payment label, a different reference and completion time, and no first reference or cash input.
6. New Transaction from the QR receipt also returned to empty Items. The preview was left ready for a fresh customer. Final browser warning/error log was empty.

Saved actual browser screenshots:

- [First cash receipt](evidence/step-7-first-cash.png)
- [Empty cart immediately after reset](evidence/step-7-empty-after-reset.png)
- [Fresh blank cash form for the next order](evidence/step-7-fresh-cash-form.png)
- [Second QR receipt with a different reference](evidence/step-7-second-qr.png)

These screenshots were inspected visually. No physical touchscreen hardware was tested. Card reset/consecutive order and obsolete callbacks were checked in automated store tests; the consecutive browser demo used Cash then QR. Payments remain simulated and data remains in memory.

## Phase boundary

Step 7 is reviewable and the seven-step customer flow is implemented. Human evaluation, authored commit, pushed branch, PR, review, merge, deployment, and any separate final exam audit remain pending. Earlier phase evidence is historical. See [AI record](ai/phase-07.md) and [commit/PR instructions](step-7-review.md). Stop after this phase.

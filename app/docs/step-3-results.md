# Step 3 verification and changed files

Verified October 7, 2026, Asia/Manila, on `feature/payment-method`, against the production preview at `http://127.0.0.1:3001`.

The selected branch initially pointed to Step 1 (`bab0dfa`). With permission, it was fast-forwarded to the already recorded Step 2 merge (`f108c64`) before implementing Step 3. No new commit, push, remote PR, or merge was created by the assistant. No unrelated local edits were present. The Step 3 diff is against that merged Step 2 base.

## Changed files

| File | Change and purpose |
|---|---|
| `src/types/kiosk.ts` | Adds `PaymentMethod = "cash" \| "qr" \| "card"`. |
| `src/data/payment-methods.ts` | Typed method catalog and shared display labels. |
| `src/stores/kiosk-store.ts` | Adds nullable `selectedMethod`, guarded selection, and `paymentHandoffRequested`/`preparePayment`. Back preserves method and cart but clears the handoff. Choice/order edits clear stale handoffs; emptying the order also clears its method. |
| `src/components/kiosk/payment-method.tsx` | New three-button selection screen, shared current total, selected highlight/checkmark/pressed state, Back to Order Summary, guarded Continue, and inline Step 4 message. |
| `src/components/kiosk/payment-handoff.tsx` | Removes the superseded Step 3 placeholder. |
| `src/components/kiosk/kiosk.tsx` | Renders the selection screen for `method` and updates its step label. The provider stays mounted. |
| `tests/payment-method.test.ts` | Eight behavior tests: three methods, guards, Back with changed totals, stale handoff clearing, empty-order cleanup, and per-instance isolation. |
| `README.md` | Documents current behavior, method state, checks, and phase review links; reminds users to install dependencies after pulling/switching branches. |
| `docs/ai/phase-03.md`, phase results/review/PR files, `docs/evidence/step-3-*.jpg` | Actual prompt/evaluation, verification, review instructions, and browser evidence. |

No Step 3 dependency or build-configuration changes were needed. Uses the agreed Next.js App Router, strict TypeScript, Tailwind, generated shadcn/ui components, Zustand, and shared integer-centavo helpers. React Hook Form/Zod remain installed for Step 4 cash entry.

## Method and handoff state

`selectedMethod` starts as `null`. Selection is accepted only on the nonempty method screen and only for one of the three typed catalog IDs. It changes a preference, not payment status. `preparePayment` requires the method screen, a nonempty cart, and a selected method. It only sets `paymentHandoffRequested = true` and leaves the screen as `method`. The UI shows the chosen label and a clear Step 4 message.

There is no payment amount entry, QR confirmation/code, card data input, gateway, timer, processing/success screen, completed transaction, reference generation, or receipt. Step 4 can consume the selected method and current cart from this same store; no copied order or stored total is introduced. Back preserves the choice and cart. Emptying the cart clears the choice; browser refresh restarts the in-memory session.

## Actual command checks

Run inside `app`, with permission for local compiler/test subprocesses:

| Command | Observed outcome |
|---|---|
| `npm run lint` | Passed; no diagnostics |
| `npm run typecheck` | Passed; route definitions generated and TypeScript completed |
| `npm run test` | 22 passed, 0 failed (9 cart + 5 navigation + 8 payment method) |
| `npm run build` | Passed; inherited Webpack/PostCSS setup; `/` and `/_not-found` prerendered successfully |
| `npm run start -- --hostname 127.0.0.1 --port 3001` | Production preview ready; browser checks used this build |
| `git diff --check` | Passed |

No failed app checks occurred during this implementation. Initial source reads exposed the outdated branch base and missing Step 2 files; the permitted fast-forward resolved that prerequisite before editing. Remote fetching was not performed in this phase, so no new remote freshness, review, or deployment claim is made.

## Actual browser checks

| Action | Observed result |
|---|---|
| Coffee x2 + Sandwich + Soft Drink; summary | PHP175.00, quantities 2/1/1 |
| Continue to Payment | Three choices, same PHP175.00; initial Continue disabled |
| Select Cash | Cash pressed/highlighted with Selected; other two unselected; Continue enabled |
| Select QR Payment | QR pressed/highlighted with Selected; other two unselected; Continue enabled |
| Select Credit/Debit Card | Card pressed/highlighted with Selected; other two unselected; Continue enabled |
| Continue with card | Remained on Payment Method; inline Step 4 handoff names Card and says no payment taken; no successful payment or receipt screen |
| Back to Order Summary | PHP175.00 and original quantities 2/1/1 preserved |
| Back to items, remove Soft Drink, reopen summary/method | PHP140.00 on both; Card preference retained; previous handoff message cleared |
| Touch sizes at desktop | Method buttons 248px wide and 192px high; Back/Continue 56px high |
| Responsive widths | Document width 305 at viewport 320; 375 at 390; 753 at 768: no horizontal document overflow |
| Payment inputs | No input, textarea, or select fields on the method screen |
| Console | No captured warning/error messages |

Ordinary viewport screenshots were inspected for the selected desktop layout. Mobile screenshots show the top of the vertically scrollable page. Temporary viewport overrides were reset. Browser testing used clicks; no physical touchscreen, payment device, or gateway was tested. The preview remains at PHP140 with Card selected for review.

## Real screenshots

- [No choice: Continue disabled](evidence/step-3-unselected.jpg)
- [Cash selected](evidence/step-3-cash.jpg)
- [QR Payment selected](evidence/step-3-qr.jpg)
- [Card selected](evidence/step-3-card.jpg)
- [Inline Step 4 handoff](evidence/step-3-handoff.jpg)
- [Back preserves the summary](evidence/step-3-back-summary.jpg)
- [Edited PHP140 method total](evidence/step-3-total-140.jpg)
- [390px mobile layout](evidence/step-3-mobile.jpg)

Student evaluation, teammate review, Step 3 commit, PR, merge, and deployment remain pending. See `docs/step-3-review.md` for the next human review/Git actions. Stop after this phase.

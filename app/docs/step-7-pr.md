# Step 7: reset kiosk for a new transaction

New Transaction previously displayed a Step 7 placeholder and left the completed receipt visible. It now clears all active order/payment state and returns to empty Items with PHP0 total and disabled Continue. The fixed product catalog remains available. Subsequent payment forms mount with blank cash values and fresh validation/submission state.

Reset invalidates old simulation work with a private store generation. Delayed success and error callbacks cannot restore a previous receipt, inject an error, or unlock a newer payment. An unmounted form's resolver also cannot submit into the next order. No reload, history, database, or optional feature was added.

## Validation

- Lint, typecheck, and production build passed.
- 63 automated tests passed: reset after every method, cleared fields, preserved catalog/actions, fresh second orders/references, rejected cash cleanup, and obsolete success/error callbacks.
- Browser production demo without refresh: Cash PHP175/PHP200/PHP25 -> New Transaction -> empty cart/PHP0/disabled Continue -> fresh blank cash form -> QR Bottled Water + Cookies PHP45/PHP45/PHP0 -> new reference -> New Transaction -> empty Items again.
- Actual screenshots and full generated references/times: `app/docs/step-7-results.md` and `app/docs/evidence/step-7-*.png`.
- AI prompt/response/evaluation: `app/docs/ai/phase-07.md`.

Branch `feature/new-transaction`, base `main`. Actual student identity, authored SHA, human evaluation, and teammate review must be recorded after they exist. Payments remain simulated/in memory; physical touch testing and deployment are not claimed.

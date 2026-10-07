Adds Step 3 Payment Method Selection after Order Summary. Cash, QR Payment, and Credit/Debit Card buttons show an exclusive selected state and the current shared order total. Back preserves the cart and selected preference.

The chosen method is typed Zustand state. Continue is disabled until a method is chosen; its guarded action only shows an inline Step 4 handoff. Changing the choice, going Back, or editing the order clears the previous handoff; emptying the cart also clears the method. Selection never marks payment successful or generates a transaction/reference/receipt. Processing and payment inputs are outside this phase.

Assistant validation
- Lint, type checking, and production build passed.
- All 22 tests passed, including eight payment-method behavior checks.
- Browser: each of the three choices becomes visibly selected with only one pressed button; Continue is disabled before selection.
- PHP175 matches summary and method; Back retains quantities 2/1/1; removing Soft Drink updates both totals to PHP140.
- Inline handoff remains on the method screen with no payment taken; Card preference is retained after Back/editing.
- Method buttons measured 192px high; navigation 56px high. No horizontal document overflow at 320/390/768px. No captured console warnings/errors or payment-input fields.
- git diff --check passed.

Evidence
- AI record: app/docs/ai/phase-03.md.
- Changed files/check results: app/docs/step-3-results.md.
- Real screenshots: app/docs/evidence/step-3-*.jpg.
- Branch: feature/payment-method; base: main.

Add the actual author/member identity and authored SHA(s) before submitting. Human evaluation and teammate review are pending. Physical touchscreen/payment-device testing and Step 4 processing are not claimed. No deployment is claimed.

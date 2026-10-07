Implements Step 4 Cash, QR, and Card simulated payments using the confirmed order total. Invalid cash stays on payment with helpful inline feedback. Cash uses React Hook Form, Zod, and zodResolver with exact centavo parsing. QR/card pay the total with zero change; card shows a visible processing state.

The store locks submissions before the simulation delay and blocks order edits. A successful event creates one frozen transaction snapshot with copied lines, total, method, paid amount, change, UUID reference, and completion timestamp. Repeated taps and rendering cannot create another snapshot. Completion only hands off to Step 5; its final screen, receipt, and reset remain outside this PR.

Validation performed:
- Lint, strict typecheck, production build passed; 47 tests passed.
- PHP175 paid with PHP200: PHP25 change; exact PHP175: zero; PHP100 rejected.
- All invalid string categories, one-cent change, updated PHP140 order, retries, duplicate submissions, processing/edit locks, frozen snapshot and unique references tested.
- Browser checked inline rejection, cash completion, QR placeholder/confirmation, card instructions/visible processing, and double clicks.
- See docs/step-4-results.md for actual observations and limits, including an unconfirmed immediate-after-reload click observation.

Evidence: docs/ai/phase-04.md. Student evaluation, authored commit SHA, teammate review, and PR/merge details remain pending; fill them with actual records.

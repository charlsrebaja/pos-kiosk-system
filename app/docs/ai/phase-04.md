# Step 4 AI development record

- Date: October 7, 2026, Australia/Perth
- Task: Payment Processing; assistant: Codex in this conversation
- Branch: `feature/payment-processing`, verified after user selected it
- Starting HEAD: `6dc40c0` (merged Step 3)
- Purpose: implementation, validation, and documentation
- Human/student identity, evaluation, manual modifications, authored commit, PR, reviewer, and merge: pending

## Actual prompt and response

The user requested Step 4 using IT415-PHASE-GUIDE.md and the existing stack: validate simulated Cash with React Hook Form/Zod/zodResolver; reject blank, malformed, negative, nonfinite, excessive-precision and insufficient amounts with inline errors; calculate exact/overpayment in centavos; add QR demo confirmation and card instructions/visible processing; lock repeated submissions and edits; create one immutable snapshot with unique reference/timestamp; provide only a minimal Step 5 handoff. The requested examples were PHP175/PHP200 -> PHP25, PHP175/PHP175 -> zero, and PHP100 rejected. The user requested actual checks, bug evidence and commit/PR instructions, reviewable changes first, and stop after this phase. After interrupting the first attempt, the user added: “I already am in branch `feature/payment-processing` and continue.” The full verbatim prompts/tool exchange remain in this conversation; preserve/export it if required.

The assistant resumed: “I’ll check the branch and any partial edits from the interruption, then finish Step 4 and run the payment checks. I’ll leave the changes uncommitted for review.” The earlier requested guide branch creation had been declined; no partial source edit was present when work resumed on the user's branch.

## Generated output and assistant evaluation

Added the cash schema, payment UI and minimal completion handoff, transaction type, and guarded asynchronous store submission. Extended kiosk screens and replaced the Step 3 placeholder with Step 4 navigation. Added 25 focused payment tests and adapted the existing handoff tests. Updated README and phase results/review/PR documents.

The schema avoids float multiplication and permissive number coercion by validating decimal text and using BigInt to parse safe centavos. The form uses zodResolver; the store independently revalidates raw cash against the actual current total. Completion alone creates the UUID/time and frozen copied transaction. A synchronous store lock protects QR/card and cash; the form also uses a ref lock during asynchronous validation. UI render does not generate transactions. QR/card use total as paid, zero change. Snapshot reads are ready for later phases; no receipt or full success screen was added.

Actual checks: 47 tests passed; lint, strict typecheck and production build passed. Browser verified inline errors for every listed invalid input, cash exact/overpayment completion, demo QR, card visible processing and disabled controls, and double clicks. Store tests verified arithmetic and exactly one immutable snapshot. See docs/step-4-results.md for concrete inputs/results and limitations.

## Corrections, bugs, and limits

First typecheck rejected `100n` under the existing target; changed to `BigInt(100)`, then typecheck/build passed. Existing Step 3 expectations were adapted for the new payment screen and navigation. Sandbox test/build workers needed approved retries; preview used npm.cmd for correct Windows port arguments. One immediate-post-reload browser click sequence yielded PHP85 instead of the intended sample; cause remains unconfirmed, with a successful PHP175 repeat after observing the refreshed screen. This is recorded for review, not claimed as fixed. No invented app bug, fix commit, SHA, author, reviewer, deployment or evidence screenshot path is recorded.

No commit/push/PR was performed. Human review should evaluate the schema, locked flow and snapshot, rerun the demo, and fill actual modifications/evidence. Any confirmed real defect must retain reproduction, actual correction, regression outcome and actual fix SHA. Stop after Step 4.

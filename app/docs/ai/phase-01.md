# Step 1 AI development record

- Task: IT415 Item Selection setup and first feature milestone
- Date: October 7, 2026, Asia/Manila
- AI assistant: Codex in the current conversation
- Intended branch: `feature/step-1-item-selection`; not created by the assistant
- Student identity: not supplied
- Commit/PR/reviewer/merge: pending; no Git actions were performed
- Purpose: code generation and assistant evaluation

## Actual user prompt

```text
Proceed for the

Step 1 Item Selection

1. Context
We are building an IT415 Touchscreen POS Kiosk for a campus outlet.
This is the first implementation phase and first feature commit.
Use Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, React Hook
Form/Zod, Zustand, GitHub, and Vercel. Follow the common rules in
IT415-PHASE-GUIDE.md. The repository may already be scaffolded; inspect it
and preserve its current work.

2. Objective
Implement only Step 1: Item Selection, including required setup and a
working product grid and current-order/cart area.

3. Requirements
Show six tappable products: Coffee PHP45, Sandwich PHP50, Soft Drink
PHP35, Cookies PHP25, Bottled Water PHP20, Chocolate PHP25.
Show each name and price. Tapping adds the product; repeated taps
increase its quantity. Provide large plus, minus, and Remove buttons.
Show name, unit price, quantity, subtotal, and automatically updated total.
Use typed local product data and Zustand cart actions. Calculate in
integer centavos. Include an empty-cart state, product-added feedback,
and a visible Continue button disabled for an empty cart. Keep the
Continue action as a clearly identified phase placeholder until Step 2.
Finish reusable types, currency helpers, and lint/typecheck scripts.

4. Constraints
Use large touch controls, readable text, clear spacing, and responsive
layout. Users must not type product names. Quantities cannot become
negative or fractional. No payment, receipt, reset feature, database,
inventory, authentication, or optional features in this phase.
Do not commit or push automatically; provide reviewable changes first.

5. Expected Output
A locally runnable Item Selection screen, organized changed files,
an explanation of the store and calculations, actual check results,
and a manual demo: Coffee x2 + Sandwich x1 + Soft Drink x1 = PHP175.
Provide the commands for the first feature commit and PR, then stop.

Check: Coffee x2 gives PHP90; the sample order gives PHP175. Increasing
Coffee to three gives PHP220; decreasing back restores PHP175. Removing
Soft Drink gives PHP140. Minus at one removes the row. Empty cart disables
Continue. Product cards and quantity controls work by touch/click without
hover.
```

## Actual assistant response and code evidence

The assistant stated: "I’ll inspect the workspace, set up the app if needed, and build Step 1 with the six products and working cart. I’ll check the calculations and touch controls, then leave the changes ready for review without committing or pushing."

The substantive generated response is the code in `src/components/kiosk`, `src/data/products.ts`, `src/types/kiosk.ts`, `src/stores/kiosk-store.ts`, `src/lib/money.ts`, app entry/theme files, generated shadcn/ui components, and `tests/cart.test.ts`. The complete tool/code exchange remains in this conversation; preserve/export it if the instructor requires the complete response record. This file is a traceable summary, not a verbatim export of every tool call.

## Assistant evaluation

The assistant checked the typed catalog against the six requested prices; used integer-centavo calculations and derived totals; confirmed per-instance store isolation; checked invalid quantities and removal at one; and left Continue as an explicit phase placeholder. Actual command and browser observations are in `docs/step-1-results.md`.

The browser demonstrated the requested PHP175 example and quantity/removal results. Product and quantity controls were measured. Responsive widths were inspected, and real screenshots were saved. The checks do not claim physical touchscreen testing or a complete payment flow.

## Assistant corrections during generation

The shadcn initializer reintroduced a Google-font import; the assistant replaced it with a local system-font stack so builds do not require an external font download. Default template metadata and branding were replaced with the Campus Corner kiosk. Generated default button sizes were enlarged for touch use. An attempted combined delete/add patch for the entry page was rejected by the editing tool; the assistant then wrote the entry page successfully. The sandbox prevented the test runner from looking up the Windows profile; retrying outside the sandbox passed.

The type-check script was also updated to run `next typegen` before `tsc --noEmit`, following the installed Next.js CLI guide, because route definitions are generated and not committed. This supports a fresh clone rather than assuming a previous build exists.

These were assistant adaptations, not claimed student modifications. Dependency audit findings remain documented rather than hidden or resolved through a forced downgrade.

## Student evaluation and modifications

Pending. The actual student must review/explain the files, perform the demo, and describe any manual changes they make. No student evaluation, authorship identity, review, commit, or PR evidence is fabricated here.

## Verification and Git evidence

See `docs/step-1-results.md` for actual outcomes, README for run/Git/PR commands, and `docs/step-1-pr.md` for the draft PR description. Add actual authored SHA(s), PR URL, reviewer, and merge status to the contribution register only after those actions occur.

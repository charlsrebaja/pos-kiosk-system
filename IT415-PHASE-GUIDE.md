# IT415 POS kiosk practical exam guide

Build the application one phase at a time using Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Zustand, GitHub, and Vercel. Each phase below has a prompt in the requested five-part structure, checks to perform, and branch/commit instructions. This is a development guide; its examples are not completed contribution evidence.

The supplied exam defines the application's seven transaction steps. The supplied acceptance checklist additionally requires a shared cloned repository, at least seven real development stages, meaningful authored commits, feature branches, reviewed and merged pull requests, a README, and evidence of AI prompts, responses, evaluation, and modifications. A separate grading rubric is mentioned but was not supplied.

## How to use this guide

1. Complete the repository preparation below.
2. Create the phase branch before changing code.
3. Send only that phase's five-part prompt to your coding assistant. Include the common implementation rules below with every prompt, or keep this guide available in the same chat.
4. Read the generated code, run it, and perform the phase's checks. Each member must understand and explain their own work.
5. Save the actual prompt, response, evaluation, modifications, and test results in `docs/ai/phase-NN.md` using `AI-LOG-TEMPLATE.md`.
6. Commit the actual phase changes, push, open a PR, obtain a teammate's review, address requested changes, and merge into `main`.
7. Pull the merged `main` before creating the next dependent phase branch. Repeat until all phases and the final demonstration pass.

Item Selection is the first **feature/development commit**, and Order/Payment Summary is the second. A GitHub repository seed commit and PR merge commits can also appear in history; do not remove or disguise them to manufacture exact overall commit positions. More commits are appropriate when real review fixes are needed.

## Repository preparation

Use one shared group repository. The owner creates `pos-kiosk-system` on GitHub with an initial README so `main` exists. Invite each real group member as a collaborator and verify instructor access. Every member uses their own GitHub login and their own verified Git author email.

The current guide folder is not a Git repository. To keep these guide files separate from scaffolding, clone the shared application into an `app` subfolder. Replace `YOUR-OWNER` and all identity placeholders before running commands.

```powershell
Set-Location 'C:\Users\Charls\Desktop\pos-kiosk-system'
git clone https://github.com/YOUR-OWNER/pos-kiosk-system.git app
Set-Location app
git config user.name "YOUR REAL NAME"
git config user.email "YOUR VERIFIED GITHUB EMAIL OR GITHUB NOREPLY EMAIL"
git remote -v
git status
git switch -c feature/step-1-item-selection
```

If the group already has a repository, clone that repository and use its actual integration branch. Do not initialize an unrelated repository or replace existing work. Other members clone the same repository into a suitable local folder on their computers.

On the Step 1 branch, scaffold the application and install the requested libraries:

```powershell
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*" --disable-git
npx shadcn@latest init
npx shadcn@latest add button card input label alert separator badge
npm install zustand react-hook-form zod @hookform/resolvers lucide-react
npm run dev
```

Use a current supported Node.js LTS that meets Next.js's documented minimum. Use npm consistently and commit `package-lock.json`; other members use `npm ci` after pulling changes. `--disable-git` prevents the scaffolder from initializing another repository. Read any generated `AGENTS.md` before subsequent implementation. These setup commands follow the official [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation), [CLI reference](https://nextjs.org/docs/app/api-reference/cli/create-next-app), and [shadcn/ui Next.js instructions](https://ui.shadcn.com/docs/installation/next). The Zod integration uses the official [React Hook Form resolvers](https://github.com/react-hook-form/resolvers).

Do not commit yet: finish Step 1 so its first development commit contains both the setup and a working Item Selection feature. This preserves your requested feature sequence while making the setup stage visible in the same actual change.

## Common implementation rules

Apply these rules to all phase prompts:

- Use Next.js App Router and strict TypeScript. Use Tailwind and actual generated shadcn/ui components; enlarge their default sizes for touch use.
- Recommended UI: readable campus kiosk, large product cards, clear cart, high-contrast controls, visible Back/Continue buttons, minimal typing. Use at least 48px touch controls as a project design choice; the exam specifies large controls without a numeric minimum.
- Use a client-side kiosk component and a Zustand store created once per mounted kiosk instance through a provider. Keep server components out of cart and payment mutation. Use one controlled screen value initially, avoiding unnecessary URL/navigation complexity.
- Suggested flow: `items -> summary -> method -> processing -> success -> receipt -> items`. Back actions preserve the cart before payment; completed payment cannot be bypassed by advancing screen state directly.
- Store product data in a typed local data file. Use in-memory Zustand state for this exam; explain in the README that a browser refresh restarts the active session. No database is necessary under the supplied requirements. Persistence and inventory are optional extensions.
- Store money as integer centavos. Derive item subtotal as `unitPriceCentavos * quantity` and total as the sum of item subtotals. Format using Philippine pesos with two decimal places. Do not add tax, fees, or discounts to the exam example.
- Cart quantities are positive integers. Decreasing from one removes the item; explicit Remove is also provided. Reject negative, fractional, or otherwise invalid quantities.
- Use React Hook Form plus Zod for cash entry. Parse a nonblank decimal string into centavos, validate its format and range, then compare with the current confirmed total. Avoid converting an empty string into a valid zero amount.
- On successful payment, create one immutable completed-transaction snapshot including reference, timestamp, item names, quantities, unit prices, subtotals, total, method, paid amount, and change. Success and Receipt read that snapshot.
- Generate a reference once per completed payment using a collision-resistant identifier, such as `TXN-` plus `crypto.randomUUID()` from a client event. Rendering, opening the receipt, and double taps must not create another reference.
- Cash, QR, and card processing are simulated. QR needs a clearly labeled placeholder/code and confirmation control. Card needs tap/insert/swipe instructions and a visible processing state. Do not request real card details.
- Reset all active transaction state, form state, receipt, errors, and processing state for New Transaction. Delayed simulation results must not restore a previous transaction after reset.
- Keep the phase scope focused. Complete only the requested phase and the shared helpers it needs; leave later screens for their own phases.
- Do not invent completed tests, bug reports, authors, reviews, SHAs, PRs, screenshots, deployments, or AI-use records. Commit only real implemented changes under the actual member's identity.
- Add a `lint` script running `eslint .` if missing, and a `typecheck` script running `tsc --noEmit`. Before each app commit, run `npm run lint`, `npm run typecheck`, and `npm run build`, plus the listed manual checks. Record outcomes honestly.

Suggested source organization, expanding only as phases require it:

```text
src/app/page.tsx
src/components/kiosk/kiosk.tsx
src/components/kiosk/kiosk-provider.tsx
src/components/kiosk/product-card.tsx
src/components/kiosk/cart-panel.tsx
src/components/kiosk/order-summary.tsx
src/components/kiosk/payment-method.tsx
src/components/kiosk/payment-processing.tsx
src/components/kiosk/payment-success.tsx
src/components/kiosk/receipt.tsx
src/components/ui/...
src/data/products.ts
src/stores/kiosk-store.ts
src/types/kiosk.ts
src/lib/money.ts
src/lib/payment-schema.ts
docs/ai/phase-01.md ...
docs/contributions.md
docs/acceptance-results.md
```

## Phase and commit map

The numbers refer to feature/development milestones, excluding repository seed and merge commits. Review corrections can add real commits between milestones.

| Phase | Branch | Suggested commit message | Development evidence |
|---|---|---|---|
| 1 Item Selection | `feature/step-1-item-selection` | `feat: set up kiosk and implement item selection` | Setup, interface, cart functionality |
| 2 Order/Payment Summary | `feature/step-2-order-summary` | `feat: add order summary with back navigation` | Summary and preserved state |
| 3 Payment Method | `feature/step-3-payment-method` | `feat: add cash QR and card payment selection` | Payment interface |
| 4 Payment Processing | `feature/step-4-payment-processing` | `feat: process and validate simulated payments` | Core payment and validation |
| 5 Payment Successful | `feature/step-5-payment-success` | `feat: show payment confirmation and unique reference` | Confirmation |
| 6 Receipt | `feature/step-6-receipt` | `feat: display completed transaction receipt` | Transaction details |
| 7 New Transaction | `feature/step-7-new-transaction` | `feat: reset kiosk for a new transaction` | Reset and customer isolation |
| 8 Validation review | `feature/validation-hardening` | `feat: strengthen transaction validation and feedback` | Additional real validation changes |
| 9 Actual bug fix | `fix/ACTUAL-ISSUE-SLUG` | `fix: describe the actual corrected defect` | Reproduced defect and regression check |
| 10 Refactoring | `refactor/kiosk-shared-components` | `refactor: share order rendering across kiosk screens` | Behavior-preserving restructuring |
| 11 Documentation | `docs/exam-evidence` | `docs: document setup contributions and exam evidence` | README, AI and process evidence |

The checklist requires setup, interface, core functionality, validation, bug fix, refactoring, and documentation. Seven screen commits alone do not demonstrate every required category. Keep actual bug fixes wherever they happen; Phase 9 is a planned investigation checkpoint, not permission to create a fake defect. If no defect is found, record that accurately and leave the bug-fix evidence requirement unresolved until genuine evidence exists.

## Step 1 Item Selection

Create the Step 1 branch during repository preparation, then send this prompt:

```text
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
```

Check: Coffee x2 gives PHP90; the sample order gives PHP175. Increasing Coffee to three gives PHP220; decreasing back restores PHP175. Removing Soft Drink gives PHP140. Minus at one removes the row. Empty cart disables Continue. Product cards and quantity controls work by touch/click without hover.

Commit after the checks and AI record are complete:

```powershell
git status --short
git add src public package.json package-lock.json components.json tsconfig.json next-env.d.ts next.config.* postcss.config.* eslint.config.* .gitignore README.md
git add docs
git diff --cached --stat
git diff --cached
git commit -m "feat: set up kiosk and implement item selection"
git push -u origin feature/step-1-item-selection
```

Stage only paths that actually exist. Also stage any generated configuration needed by the project, such as a generated `AGENTS.md`, after reviewing it. Do not include `.next`, `node_modules`, secrets, or temporary render images. Open and review the PR using the shared PR cycle below.

## Step 2 Order and Payment Summary

After Step 1 is reviewed and merged:

```powershell
git switch main
git pull --ff-only origin main
git switch -c feature/step-2-order-summary
```

```text
1. Context
Step 1 is merged and the product grid and Zustand cart work. Keep the
same required stack and common rules in IT415-PHASE-GUIDE.md.

2. Objective
Implement Step 2: Order/Payment Summary as the second feature milestone.

3. Requirements
Connect Item Selection's Continue button to the summary screen.
Show every selected product, quantity, unit price, subtotal, and total.
Use the same cart data and calculation helpers as Item Selection.
Provide Back to modify the order and Continue to Payment.
Back must preserve all selected items and quantities; subsequent edits
must appear in the summary. Prepare a controlled handoff to Step 3
without implementing payment method controls yet.

4. Constraints
Do not duplicate cart state, clear it on Back, hard-code a summary,
or implement later steps. Empty orders cannot enter checkout.
Keep large touch controls and the existing product-selection behavior.
Provide changes for review before any commit or push.

5. Expected Output
A working summary and Back navigation, changed-file explanation,
actual check results, and the Step 2 commit and PR instructions.
Verify that the PHP175 sample matches both screens and that removing
Soft Drink changes both to PHP140. Stop after this phase.
```

Check: compare both screens; use Back and edit quantities; confirm the summary refreshes and an empty cart cannot proceed.

Commit: `git commit -m "feat: add order summary with back navigation"`

Push: `git push -u origin feature/step-2-order-summary`

## Step 3 Payment Method

Create `feature/step-3-payment-method` from the newly merged `main` using the shared cycle.

```text
1. Context
Item Selection and Order Summary are merged. Follow the agreed stack
and common rules in IT415-PHASE-GUIDE.md.

2. Objective
Implement Step 3: choose a payment method.

3. Requirements
Connect Continue to Payment to a method-selection screen.
Show the order total and three large buttons: Cash, QR Payment,
and Credit/Debit Card. Store the selected method in typed Zustand state.
Show a clear selected state and Back to Order Summary.
Prepare the selected-method handoff for Step 4; processing is not yet
implemented. Disable the handoff until a method is selected.

4. Constraints
Choosing a method must not mark payment successful or generate a
transaction/receipt. Preserve the order on Back. Do not implement a
gateway, collect card information, or add later screens.
Provide reviewable changes before committing or pushing.

5. Expected Output
A working three-option selection screen, explanation of method state,
actual checks for all three choices and Back, and phase commit/PR
instructions. Stop after this phase.
```

Check: all three methods can be selected; selection is visible; total matches summary; Back preserves the cart; selection alone never completes payment.

Commit: `git commit -m "feat: add cash QR and card payment selection"`

Push: `git push -u origin feature/step-3-payment-method`

## Step 4 Payment Processing

Create `feature/step-4-payment-processing` from the newly merged `main`.

```text
1. Context
The first three steps are merged. Use the agreed stack and common
rules in IT415-PHASE-GUIDE.md; payments are simulations.

2. Objective
Implement Step 4: validate and complete Cash, QR, and Card payments.

3. Requirements
Cash shows total due, a labeled amount-paid input, and Pay Now.
Use React Hook Form and Zod with zodResolver. Reject blank, malformed,
negative, nonfinite, excessive-precision, and insufficient amounts.
Keep the customer on payment with a helpful inline error after rejection.
Accept exact payment with zero change; calculate overpayment change
in centavos. QR shows total, a labeled demo QR placeholder, scan
instructions, and Confirm Payment. Card shows total, tap/insert/swipe
instructions, Process Payment, and a visible processing state.
QR and Card use paid amount equal to total and zero change.
Lock duplicate submissions and block order edits during processing.
After a valid completion create one immutable transaction snapshot
with a unique reference and completion timestamp. Provide a minimal
completion handoff for Step 5 without building its final screen yet.

4. Constraints
No real payment integration or real card inputs. Invalid payments must
not create completed transactions or receipts. Never generate a new
transaction from rendering or repeated taps. Use the actual confirmed
order total, not a hard-coded amount. Provide reviewable changes first.

5. Expected Output
Three working simulated payment paths, form schema and snapshot
explanation, actual checks, and phase commit/PR instructions.
Verify PHP175 paid with PHP200 gives PHP25 change; PHP175 paid with
PHP175 gives zero; PHP100 is rejected. Stop after this phase.
```

Check all invalid inputs, exact cash, overpayment, QR confirmation, card processing, and rapid double taps. One successful payment must create exactly one completed transaction snapshot. Record any observed bug for its actual fix commit.

Commit: `git commit -m "feat: process and validate simulated payments"`

Push: `git push -u origin feature/step-4-payment-processing`

## Step 5 Payment Successful

Create `feature/step-5-payment-success` from the newly merged `main`.

```text
1. Context
Payment processing is merged and provides a completed-transaction
snapshot. Follow the agreed stack and common implementation rules.

2. Objective
Implement Step 5: Payment Successful confirmation.

3. Requirements
Show a clear successful-payment message, transaction amount, amount
paid, payment method, unique reference, and a large View Receipt button.
Read the immutable completed snapshot. Reuse its existing reference
and timestamp; do not generate replacements. Only completed payments
can enter this screen. Prepare View Receipt's Step 6 handoff.

4. Constraints
Do not show success for rejected or pending payment. Do not mutate
the completed order or implement the receipt screen in this phase.
Keep the three payment methods correctly identified. Provide reviewable
changes before any commit or push.

5. Expected Output
A working confirmation screen for all three methods, actual checks,
an explanation of transaction guards, and phase commit/PR instructions.
Verify the PHP175 cash example shows paid PHP200 and a stable
reference. Stop after this phase.
```

Check: all valid methods show the correct snapshot details; invalid cash never reaches success; re-rendering does not change the reference.

Commit: `git commit -m "feat: show payment confirmation and unique reference"`

Push: `git push -u origin feature/step-5-payment-success`

## Step 6 Receipt

Create `feature/step-6-receipt` from the newly merged `main`.

```text
1. Context
Payment Successful is merged with a stable completed transaction.
Follow the agreed stack and common rules in IT415-PHASE-GUIDE.md.

2. Objective
Implement Step 6: View Receipt.

3. Requirements
Connect View Receipt to a readable digital receipt showing reference,
completion date/time, purchased items, quantities, unit prices,
subtotals, total, selected payment method, paid amount, and change.
Display the completion timestamp in Asia/Manila consistently.
Read the completed transaction snapshot rather than the live cart.
Provide a visible New Transaction control with its clearly identified
Step 7 handoff. A completed transaction is required to view a receipt.

4. Constraints
No hard-coded receipt details, new reference on opening, physical
printing requirement, or history/database feature. QR and Card receipts
must show paid equal to total and zero change. Provide reviewable
changes before committing or pushing.

5. Expected Output
A working digital receipt, actual checks of all fields for all methods,
snapshot/date explanation, and phase commit/PR instructions.
Verify the PHP175/PHP200 cash example shows PHP25 change and the
same reference as confirmation. Stop after this phase.
```

Check: receipt details match completed payment and confirmation; Cash, QR, and Card names are correct; opening the receipt never changes its reference or date.

Commit: `git commit -m "feat: display completed transaction receipt"`

Push: `git push -u origin feature/step-6-receipt`

## Step 7 New Transaction

Create `feature/step-7-new-transaction` from the newly merged `main`.

```text
1. Context
The first six steps are merged. Follow the agreed stack and common
rules in IT415-PHASE-GUIDE.md.

2. Objective
Implement Step 7: start a clean new transaction from Receipt.

3. Requirements
New Transaction clears the cart, total, selected method, cash input,
paid amount, change, errors, processing status, confirmed order,
completed receipt, reference, and timestamp, then returns to Items.
Reset both Zustand state and any React Hook Form/local UI state.
Make obsolete simulation callbacks harmless so they cannot restore
old data after reset. Preserve the product catalog.
Complete a second valid transaction and verify a different reference.

4. Constraints
Previous customer details cannot remain visible. Do not clear product
data, reload the entire page as the only reset implementation, or reuse
references. Do not add optional features. Provide reviewable changes.

5. Expected Output
A working full seven-step flow, actual reset and two-transaction checks,
an explanation of reset behavior, and phase commit/PR instructions.
Stop after this phase.
```

Check: after New Transaction, total is PHP0, cart is empty, Continue disabled, and previous payment/receipt absent. Complete a different order using another method; references differ and no old cash input remains.

Commit: `git commit -m "feat: reset kiosk for a new transaction"`

Push: `git push -u origin feature/step-7-new-transaction`

## Phase 8 Validation and feedback review

Create `feature/validation-hardening` from merged `main`.

```text
1. Context
The seven-step flow is implemented. Review the exam and acceptance
checklist using our agreed stack and common implementation rules.

2. Objective
Inspect and strengthen remaining transaction validation and feedback.

3. Requirements
Check empty-order guards, positive integer quantities, allowed screen
transitions, valid method selection, cash parsing, insufficient payment,
exact payment, processing locks, duplicate submissions, and receipt
access only after success. Add missing guards and clear feedback where
there is a real gap. Use React Hook Form/Zod and store-level checks as
appropriate. Record acceptance results and observations. Add focused
regression tests for meaningful money/payment/state risks when needed.

4. Constraints
Do not duplicate working validation or create artificial changes for a
commit. Preserve all valid payment flows. Report any real defect with
reproduction steps and keep its correction visible in an actual fix
commit. If nothing needs changing, document that finding honestly.

5. Expected Output
Actual validation improvements if needed, observed checks and remaining
issues, updated AI evaluation, and a truthful phase commit/PR plan.
```

Commit the suggested validation message only if actual validation changes were made. Otherwise commit only real acceptance documentation with an accurate `docs:` message. The validation implemented in Step 4 remains valid evidence.

## Phase 9 Actual bug fix

Choose a real issue found during development, testing, or PR review. Replace `ACTUAL-ISSUE-SLUG` with a descriptive branch name, such as `fix/cash-blank-input`, only if that bug actually exists.

```text
1. Context
We observed this real defect: [actual behavior, expected behavior,
reproduction steps, relevant commit, and affected files].
Use the existing stack and common rules in IT415-PHASE-GUIDE.md.

2. Objective
Correct the reproduced defect with the smallest suitable change.

3. Requirements
Reproduce it first, explain the cause, implement the correction, and
verify the original reproduction now passes. Add a focused regression
check when appropriate. Recheck the affected valid transaction path.
Document the actual AI debugging prompt, response, evaluation, and
human modifications.

4. Constraints
Do not introduce a deliberate defect, pretend an issue happened, or
relabel documentation as a bug fix. Avoid unrelated feature changes.
If the supplied reproduction does not fail, report that accurately.

5. Expected Output
Before/after evidence, root cause, changed files, actual regression
results, and a descriptive fix commit plus PR instructions.
```

Use a message describing the actual correction. A bug fix earlier in a feature PR can satisfy this evidence category; do not fix it twice merely to match this phase number.

## Phase 10 Refactoring

Create `refactor/kiosk-shared-components` from merged `main`.

```text
1. Context
The working kiosk is merged and tested. Use its existing stack.
Follow the common rules in IT415-PHASE-GUIDE.md.

2. Objective
Perform a real refactor that preserves user-visible behavior.

3. Requirements
Inspect duplication in cart, summary, and receipt rendering and money
formatting. Extract a shared typed order-line component or other
appropriate helper where duplication actually exists. Preserve the
receipt's completed snapshot and touch-friendly editing controls.
Explain the original duplication, the new organization, and why the
refactor helps. Run the affected transaction checks again.

4. Constraints
Do not rename files or add abstraction solely to manufacture a commit.
No new features, changed prices, changed calculations, or receipt state
regressions. If the suggested duplication does not exist, choose another
justified improvement from the real code and explain it.

5. Expected Output
A reviewable behavior-preserving refactor, changed-file explanation,
actual checks, AI refactoring evaluation, and commit/PR instructions.
```

Use the suggested commit message only if it matches the actual refactor; otherwise describe the real change.

## Phase 11 Documentation and deployment evidence

Create `docs/exam-evidence` from merged `main`.

```text
1. Context
The completed kiosk and real development history are available. The
exam checklist requires setup/run instructions, storage and technology
choices, group contributions, and AI/development-process evidence.

2. Objective
Prepare accurate README and evidence files for the demonstration.

3. Requirements
Document npm ci, npm run dev, lint, typecheck, build, and production
run commands. Explain the requested stack, hard-coded product data,
in-memory Zustand storage, refresh behavior, and simulated payments.
Describe the seven-step flow and actual acceptance-test outcomes.
Record real members, GitHub profiles, owned branches, commits, PRs,
reviewers, statuses, and AI prompts/responses/evaluations/modifications.
Provide Vercel GitHub-import instructions and a place to record the
real deployment URL and source commit after deployment. Identify any
unverified or incomplete evidence accurately.

4. Constraints
Do not invent evidence, claim a deployment exists before it does, mark
untested requirements as passing, or attribute code to another person.
Keep any missing separate grading rubric clearly identified.

5. Expected Output
README, contribution register, acceptance results, complete actual AI
logs, deployment instructions, and the documentation commit/PR plan.
```

Commit: `git commit -m "docs: document setup contributions and exam evidence"`

Push: `git push -u origin docs/exam-evidence`

## Shared Git and pull request cycle

For phases after Step 1, run these commands before development. Replace the example branch with that phase's actual branch:

```powershell
git status
git switch main
git pull --ff-only origin main
git switch -c feature/step-2-order-summary
```

If the working tree has unrelated uncommitted work, resolve or preserve it deliberately before switching. Do not discard it. After changing and testing the phase, stage the relevant files, including its actual AI record:

```powershell
npm run lint
npm run typecheck
npm run build
git status --short
git add src docs
git diff --cached --stat
git diff --cached
git commit -m "feat: add order summary with back navigation"
git push -u origin feature/step-2-order-summary
git log -1 --format="%H %an <%ae> %s"
```

If a phase changes configuration, dependencies, or README, explicitly stage those relevant files too. For the documentation-only phase, stage `README.md` and `docs` rather than assuming `src` changed.

On GitHub:

1. Open **Compare & pull request** for the pushed branch.
2. Check **base: main** and **compare: the actual phase branch**.
3. Use a title describing the feature and a body explaining changes, checks performed, screenshot references, and the AI-log location. Use the template below.
4. Request a real teammate review. The reviewer inspects the diff, runs or previews the feature, and records findings using GitHub's review controls. GitHub supports Comment, Approve, and Request changes; see the official [PR review reference](https://docs.github.com/en/pull-requests/reference/pull-request-reviews).
5. Address requested changes with real follow-up commits on the same branch, push, and request another review of the updated changes. Do not invent requested changes to generate history.
6. Once checks and review are complete, merge into `main`. **Create a merge commit** is recommended here to preserve original authored commits and branch history. Use it if enabled for the group repository.
7. Record the original authored commit SHA(s), PR URL, reviewer, actual merge status, and merge SHA. An open or closed-unmerged PR must not be recorded as merged.
8. Pull `main` locally and begin the next dependent phase. A branch deleted after merge remains verifiable through its PR and commit records; preserve its name in the register.

Example PR body:

```markdown
Implements Step 2 Order/Payment Summary with Back navigation that preserves
the cart. The summary uses the same item data and totals as Item Selection.

Validation performed
- [actual lint/typecheck/build results]
- [actual sample-order and Back-navigation results]
- Screenshot or preview: [actual reference]

Evidence
- Author/member: [actual ID and GitHub username]
- AI log: docs/ai/phase-02.md
- Relevant commit(s): [actual SHA(s)]
- Known limitations: [actual phase boundary or remaining issue]
```

Reviewer evidence should say what was checked, not merely "looks good." Example wording to adapt only after performing it: "Checked the PHP175 example, Back preserves quantities, and the summary updates to PHP140 after removing Soft Drink. Reviewed changed files and observed passing checks."

## Member assignment and contribution evidence

Assign member IDs according to your actual group size. The supplied checklist provides M1-M6 slots but permits more rows; it does not establish that your group must have six members. A member can own multiple phases. Do not create accounts or assign fake names to fill every slot.

Example allocation for an actual six-person group:

| Member | Proposed ownership | Possible review responsibility |
|---|---|---|
| M1 | Step 1, setup | Review M2 |
| M2 | Step 2, summary | Review M3 |
| M3 | Step 3, method | Review M4 |
| M4 | Step 4, processing | Review M5 |
| M5 | Steps 5 and 6 | Review M6 |
| M6 | Step 7, validation | Review M1 |

Distribute real bug fixes, refactoring, and documentation among actual members as work emerges. Each member should identify genuine AI generation, debugging, and refactoring work they performed or reviewed, explain how they evaluated it, and demonstrate their code. Do not assume phase ownership alone satisfies every individual-verification row.

Use `CONTRIBUTION-EVIDENCE-TEMPLATE.md` as your group register. Record one row per actual contribution/PR, adding rows for members with multiple branches.

Useful evidence commands:

```powershell
git remote -v
git branch -a
git log --all --graph --oneline --decorate
git log main --no-merges --format="%H | %an | %ae | %s"
git show ACTUAL_COMMIT_SHA
git rev-list --count origin/main..origin/ACTUAL_FEATURE_BRANCH
git log origin/main..origin/ACTUAL_FEATURE_BRANCH --format="%H | %an | %s"
git rev-parse HEAD
```

The last two branch-range commands are useful **before merge**. After merge the range may be empty; use the merged PR's Commits tab and original authored SHAs to identify its contributions. Count alone is not proof of authorship; use commit details, PR records, and the member's explanation.

Save actual branch/network screenshots or URLs, local-clone demonstration evidence, PR review timelines, authored-commit details, and checks. Keep evidence references traceable to actual files or URLs.

## Final acceptance demonstration

Record actual outcomes in `docs/acceptance-results.md`:

| Check | Action | Expected result |
|---|---|---|
| Startup and touch | Open kiosk, tap cards | Six named/priced products; large usable controls |
| Sample order | Coffee x2, Sandwich x1, Soft Drink x1 | PHP90 + PHP50 + PHP35 = PHP175 |
| Quantity | Increase Coffee to three, reduce to two | Total PHP220, then PHP175 |
| Removal | Remove Soft Drink | Total PHP140 |
| Summary and Back | Review, return, edit | Order preserved and total recalculated |
| Methods | Continue to method selection | Cash, QR Payment, Credit/Debit Card |
| Invalid cash | Blank, invalid, negative, insufficient | Clear error; no successful transaction |
| Cash after removal | PHP140 order, pay PHP100 | Rejected; stays in payment |
| Cash overpayment | PHP140 order, pay PHP200 | Change PHP60; success and matching receipt |
| Exact cash | PHP140 order, pay PHP140 | Accepted, change PHP0 |
| Confirmation | Inspect success | Amount, paid, method, stable reference, View Receipt |
| Receipt | Open completed receipt | Reference/date/items/quantities/prices/total/method/paid/change correct |
| QR | Confirm simulated payment | QR labeled; paid equals total; change PHP0; method QR Payment |
| Card | Process simulated payment | Instructions and processing state; paid equals total; change PHP0 |
| Reset | New Transaction from receipt | Empty cart; PHP0; no previous payment or receipt |
| Unique reference | Complete two different transactions | Different references |
| Feedback | Add/remove and trigger errors | Clear feedback for relevant actions |

Also demonstrate rejected payment never produces a receipt, and rapid taps cannot create duplicate payment snapshots. Inventory is optional; if added, stock checks must also pass and rejected payment must not reduce stock.

## Vercel and final integration commit

After the app builds and the relevant PRs are merged, import the **shared GitHub repository** into Vercel. Select the Next.js preset, repository-root application directory, and `main` as the production branch. The clone folder being named `app` on your computer does not make the GitHub repository root a nested `app` directory.

Vercel's Git integration supports feature-branch previews and production deployments from the selected production branch. See the official [Git deployment instructions](https://vercel.com/docs/git). Review previews before merging when the integration is available. Record the actual deployment URL only after it exists, and verify instructor access.

If adding deployment URLs and final evidence requires another documentation commit, do so in a real branch/PR. Then synchronize and record the final integration state:

```powershell
git switch main
git pull --ff-only origin main
git status
git rev-parse HEAD
npm ci
npm run lint
npm run typecheck
npm run build
npm run start
```

Demonstrate the production build locally and repeat the final flow on the deployed application. Confirm Vercel's deployment source SHA matches the recorded integration SHA. Record that SHA in the submitted checklist or evidence document after the last merge. A README commit cannot contain its own final SHA; avoid an endless cycle of changing it to record itself.

Before submission, verify the application checklist, repository access, local clone, at least seven real development stages covering the specified categories, each member's authorship and explanation, real PR reviews before merges, actual AI evidence, README, and final integration/deployment commit alignment. Apply any separately issued rubric when the instructor provides it.

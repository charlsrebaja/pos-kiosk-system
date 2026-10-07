# Campus Corner POS Kiosk

IT415 practical exam, Steps 1–7: Item Selection, Order/Payment Summary, Payment Method, simulated Payment Processing, Payment Successful confirmation, digital Receipt, and New Transaction reset. Built with Next.js App Router, strict TypeScript, Tailwind CSS, generated shadcn/ui Button/Card components, Zustand, and Lucide icons. Cash entry uses React Hook Form, Zod, and zodResolver.

## Run locally

Use Node.js 22 LTS or another supported version meeting the installed Next.js requirements. From this application's folder:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:3000. For a production preview:

```powershell
npm.cmd run build
npm.cmd run start
```

On Linux/macOS, use `npm` in place of `npm.cmd`. Use port 3001 if port 3000 is occupied. Run commands from `app`; the current Git checkout has the application in that subfolder. After pulling or switching to a branch with dependency changes, run `npm ci` before starting the app.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

The type-check script generates Next.js route definitions first so it also works in a fresh clone. Development and production builds use Webpack and Tailwind PostCSS; see the Step 2 results for the original environment issues. The 63 tests cover cart/calculations, navigation, method selection, cash validation/change, QR/card completion, duplicate locks, frozen snapshots, guarded receipt access, reopening, Manila date formatting, reset, consecutive transactions, and obsolete payment callbacks. Actual current results and browser evidence are in [Step 7 results](docs/step-7-results.md); earlier phase files remain historical evidence.

## Implemented behavior

Six large product cards show Coffee PHP45, Sandwich PHP50, Soft Drink PHP35, Cookies PHP25, Bottled Water PHP20, and Chocolate PHP25. Clicking or keyboard-activating a card adds one unit. Cart rows show the item name, unit price, quantity, and subtotal. Plus adds one; minus removes the row at one; Remove deletes the entire row. Feedback is announced through a live status area.

Continue is disabled for an empty cart. With items, it opens Order/Payment Summary, showing each name, quantity, unit price, subtotal, and total. Back to items preserves the order; edits appear when the summary reopens. Continue to Payment opens Cash, QR Payment, and Credit/Debit Card choices beside the current total. Continue stays disabled until a choice is selected, then opens payment processing. Back to Payment Methods is available before submitting.

Cash shows a labeled amount-paid input and Pay Now. Invalid input stays on payment with an inline error. QR displays a labeled demo placeholder and Confirm Payment. Card shows tap/insert/swipe instructions, Process Payment, and a visible processing state. All methods are simulations; no real card details or gateway are used. Submissions and order edits are locked during processing. A valid payment creates one immutable transaction and opens Payment Successful.

Confirmation shows the snapshot's transaction amount, paid amount, change, method, reference, and completion time. View Receipt opens the completed digital receipt with each purchased item's name, quantity, unit price, and subtotal, plus total, method, paid amount, change, original reference, and completion date/time. Back to confirmation and reopening preserve every completed field. Both screens display the completion time in Asia/Manila. New Transaction clears the active order and completed payment and returns to Items with an empty cart, PHP0 total, and disabled Continue. The next customer chooses a payment method again and receives a new reference on completion.

## State and calculations

`src/data/products.ts` contains the typed, fixed product catalog. `src/types/kiosk.ts` defines products, cart items, and derived order lines. Each `KioskProvider` creates one Zustand store for its mounted kiosk. The store keeps product IDs and positive whole quantities, preventing duplicate rows and invalid quantities. It rejects totals exceeding safe integer precision.

Prices are integer centavos: Coffee is 4500. Subtotal is unit price times quantity; total sums subtotals. `formatMoney` divides only for display. The provider stays mounted across `items -> summary -> method -> processing -> success -> receipt -> items`. Totals derive from the active cart until payment is submitted. The store then locks that order and stores its completed snapshot.

`createCashPaymentSchema(totalCentavos)` validates decimal text with at most two places, parses it with BigInt, rejects amounts outside safe integer centavos, and compares it with the actual total. The store revalidates cash independently of the form. Blank, malformed, negative, nonfinite, excessive-precision, and insufficient amounts never complete. PHP175 paid with PHP200 gives PHP25 change; exact PHP175 gives zero. QR/card paid amount equals total and change is zero.

The payment event synchronously acquires a store lock before the simulation delay. Completion generates `TXN-` plus `crypto.randomUUID()` and an ISO completion timestamp once. `completedTransaction` contains copied and frozen order lines, total, method, paid amount, and change; the object, item array, and every line are frozen. Repeated submissions cannot replace it. Confirmation and Receipt read only this snapshot and create no references/timestamps. `requestReceipt` requires screen `success`, a completed snapshot, and no pending processing before switching to `receipt`. `backToSuccess` uses equivalent guards for returning. The receipt component also refuses to display without its completed snapshot. Shared `formatCompletionTime` uses `Intl.DateTimeFormat` with explicit `timeZone: "Asia/Manila"`; both time elements retain the original ISO value. Opening a receipt cannot change its reference or completion time.

`resetTransaction` atomically returns all active state to its initial values: items, method, feedback, payment/receipt flags, errors, busy state, completed snapshot, and screen. Total derives from the now-empty cart; paid amount, change, confirmed purchased lines, reference, and timestamp disappear with the cleared snapshot. Product data stays in the unchanged local catalog. Every reset advances a private store generation; both delayed completion and error callbacks check it before changing state, so an obsolete payment cannot restore old details or unlock a newer payment. The internal reset action can also safely invalidate pending work; its user-facing control appears on Receipt.

Conditional screen rendering unmounts the old payment form. React Hook Form values/errors/submitting state and component refs are discarded; the next payment screen creates a new form with an empty amount. A mounted-instance guard prevents an old async form resolver from submitting after its screen unmounts. Receipt's former local placeholder state has been removed. No browser reload is used by New Transaction.

There is no database or persistence. Refresh also starts an empty session and clears completed transaction data. Inventory, authentication, receipt history, and physical printing are outside this phase.

## Source organization

- `src/app`: entry page, layout, and theme.
- `src/components/kiosk`: kiosk provider, product cards, current cart, and screen composition.
- `src/components/ui`: official CLI-generated shadcn/ui components.
- `src/data`, `src/types`, `src/stores`, `src/lib`: product data, types, cart/transaction actions, shared currency formatting, and Manila completion-time formatting.
- `tests`: cart/calculation, navigation, method selection, payment processing, success, receipt guards/snapshot stability, timezone, reset, and stale callback regression tests.
- `docs/ai/phase-01.md` through `phase-07.md`: prompts and assistant evaluation; student evaluation remains pending.
- `docs/evidence`: real desktop/mobile screenshots.

## Step 7 review, commit, and pull request

The current branch is `feature/new-transaction`. Step 7 changes are uncommitted for review. Review [actual checks](docs/step-7-results.md), [the AI record](docs/ai/phase-07.md), and [commit/PR instructions](docs/step-7-review.md). Use [the PR draft](docs/step-7-pr.md). Earlier phase documents are historical evidence. Obtain a real teammate review before merging; stop after Step 7.

## Historical Step 1 setup instructions

The following was written during Step 1 before the group repository was supplied. The current checkout now has an existing Step 1 commit and GitHub remote; do not repeat the clone/copy procedure for Step 2. Use the actual shared GitHub repository with an existing `main` branch (a GitHub README seed is sufficient). Do not count that seed as the Item Selection development commit.

To copy this prepared app into a fresh clone while preserving the shared repository's Git history, replace the URL and identity values below. These commands are instructions, not actions already performed. Run them from the outer workspace folder:

```powershell
Set-Location 'C:\Users\Charls\Desktop\pos-kiosk-system'
git clone 'https://github.com/YOUR-OWNER/pos-kiosk-system.git' group-repo
git -C group-repo switch -c feature/step-1-item-selection
robocopy app group-repo /E /XD node_modules .next .git /XF *.tsbuildinfo
Set-Location group-repo
git config user.name 'YOUR REAL NAME'
git config user.email 'YOUR VERIFIED GITHUB EMAIL OR GITHUB NOREPLY EMAIL'
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
git status --short
git add .
git diff --cached --stat
git diff --cached
git commit -m 'feat: set up kiosk and implement item selection'
git push -u origin feature/step-1-item-selection
```

`robocopy` normally returns codes 0-7 for successful/nonfatal copy outcomes; inspect its summary and stop on errors. It does not mirror-delete destination files. Use this example with a new seed-only clone; reconcile deliberately if the shared repository already has implementation files.

Open GitHub's **Compare & pull request**, with base `main` and compare `feature/step-1-item-selection`. Title: **Step 1 Item Selection and cart**. Include the actual checks, screenshots, source files, and `docs/ai/phase-01.md`. Ask an actual teammate to review the code and demo. Address review changes on the same branch. Record actual authored SHA(s), PR URL, reviewer, and status in the group contribution register. Do not mark a review or merge complete before it happens.

If GitHub CLI is already installed and authenticated, this is an alternative PR creation command after pushing:

```powershell
gh pr create --base main --head feature/step-1-item-selection --title 'Step 1 Item Selection and cart' --body-file docs/step-1-pr.md
```

## Vercel readiness

The app is a standard Next.js project and builds successfully. When later authorized to deploy, import the shared repository into Vercel with framework Next.js and production branch `main`. No deployment is claimed here. Only deploy completed and reviewed phases. In this checkout, set Vercel’s Root Directory to `app`; for a repository containing the app files at its root, leave Root Directory at the repository root.

## Dependency audit

The installation audit reported nine high-severity affected dependency entries, tracing to `braces` through tooling dependencies, including shadcn's CLI and Next.js ESLint tooling. GitHub's [GHSA-vfj7-8cjw-p6xm advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched version as of this review. No forced downgrade was applied. This app does not accept user-supplied glob patterns; the advisory remains a dependency maintenance item. Passing app tests is not a claim that the dependency audit is clean.

## Contributions

Actual student names, GitHub accounts, human evaluation, commits, PRs, reviews, and merge evidence remain to be recorded by the group. Steps 1–7 have separate assistant records in `docs/ai`. Step 7 was implemented and checked in the current conversation; its human evaluation and review are pending. Refer to the outer workspace's contribution template and phase guide for the complete workflow.

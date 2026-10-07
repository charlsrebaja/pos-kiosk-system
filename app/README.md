# Campus Corner POS Kiosk

IT415 practical exam, Steps 1–3: Item Selection, Order/Payment Summary, and Payment Method. Built with Next.js App Router, strict TypeScript, Tailwind CSS, generated shadcn/ui Button/Card components, Zustand, and Lucide icons. React Hook Form, Zod, and the Zod resolver are installed for the later payment phase; these phases need no payment form.

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

The type-check script generates Next.js route definitions first so it also works in a fresh clone. Development and production builds use Next.js’s supported Webpack option and Tailwind’s PostCSS integration because the Turbopack worker could not bind its port on this machine. See the Step 2 results for the original failures and successful final build. The nine store/calculation tests cover the sample order, plus/minus, removal at quantity one, invalid quantities, rapid actions, separate store instances, and peso formatting. Five additional navigation tests cover empty-cart guards, preserving the cart on Back, edited summaries, the ordered payment handoff, and returning to items if the cart becomes empty. Eight payment-method tests cover all three choices, selection/handoff guards, Back and changed totals, clearing stale handoffs, empty-order cleanup, and store isolation. Actual current results are in [Step 3 results](docs/step-3-results.md); the Step 1 and Step 2 result files remain historical evidence.

## Implemented behavior

Six large product cards show Coffee PHP45, Sandwich PHP50, Soft Drink PHP35, Cookies PHP25, Bottled Water PHP20, and Chocolate PHP25. Clicking or keyboard-activating a card adds one unit. Cart rows show the item name, unit price, quantity, and subtotal. Plus adds one; minus removes the row at one; Remove deletes the entire row. Feedback is announced through a live status area.

Continue is disabled for an empty cart. With items, it opens Order/Payment Summary, showing each name, quantity, unit price, subtotal, and total. Back to items preserves the order; quantity/removal edits appear when the summary reopens. Continue to Payment opens Cash, QR Payment, and Credit/Debit Card choices beside the current order total. A selected button has a checkmark, border highlight, and pressed state. Back to Order Summary retains the cart and choice. Continue stays disabled until a choice is selected; it then shows an inline Step 4 handoff message. No payment processing, successful transaction, reference, or receipt is created.

## State and calculations

`src/data/products.ts` contains the typed, fixed product catalog. `src/types/kiosk.ts` defines products, cart items, and derived order lines. Each `KioskProvider` creates one Zustand store for its mounted kiosk. The store keeps product IDs and positive whole quantities, preventing duplicate rows and invalid quantities. It rejects totals exceeding safe integer precision.

Prices are integer centavos: Coffee is 4500. Subtotal is unit price in centavos times quantity, and total is the sum of subtotals. `formatMoney` divides only when formatting the result in PHP with two decimals. Totals are derived rather than stored separately, so they update immediately when the cart changes. Both screens use `getOrderLines`, `getItemCount`, `getTotalCentavos`, and `formatMoney`. The provider stays mounted across `items -> summary -> method` screen changes. Guarded store actions require a nonempty cart and the correct preceding screen; no copied order or confirmed payment snapshot exists in these phases. `selectedMethod` is `cash | qr | card | null`; `paymentHandoffRequested` only records a guarded handoff request while the screen remains `method`. Changing a choice, going Back, or editing the order clears that request. Emptying the cart also clears the selected method. Refresh starts a new session with no choice.

There is no database or persistent active cart. Refreshing the browser starts an empty session. Product data is appropriate as local typed data for this exam phase. Inventory, payment processing, authentication, receipts, and reset are outside Steps 1–3.

## Source organization

- `src/app`: entry page, layout, and theme.
- `src/components/kiosk`: kiosk provider, product cards, current cart, and screen composition.
- `src/components/ui`: official CLI-generated shadcn/ui components.
- `src/data`, `src/types`, `src/stores`, `src/lib`: product data, types, cart actions, and shared currency formatting.
- `tests/cart.test.ts`, `tests/navigation.test.ts`, `tests/payment-method.test.ts`: behavioral cart/calculation and screen-transition tests.
- `docs/ai/phase-01.md`, `docs/ai/phase-02.md`, `docs/ai/phase-03.md`: actual prompts and assistant evaluation; student evaluation remains pending.
- `docs/evidence`: real desktop/mobile screenshots.

## Step 3 review, commit, and pull request

The current branch is `feature/payment-method`. No Step 3 commit or push has been made. Review [changed files and checks](docs/step-3-results.md), [the AI record](docs/ai/phase-03.md), and [commit/PR instructions](docs/step-3-review.md). A PR body is prepared in [docs/step-3-pr.md](docs/step-3-pr.md). Step 2 documents remain historical records of that phase. Obtain a real teammate review before merging; stop after Step 3.

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

The app is a standard Next.js project and builds successfully. When later authorized to deploy, import the shared repository into Vercel with framework Next.js and production branch `main`. This README does not claim a deployment exists. Only deploy phases actually completed and reviewed; payment selection is implemented; processing is not yet implemented. In this checkout, set Vercel’s Root Directory to `app`, where `package.json` lives; for a repository containing the app files at its root, leave Root Directory at the repository root.

## Dependency audit

The installation audit reported nine high-severity affected dependency entries, tracing to `braces` through tooling dependencies, including shadcn's CLI and Next.js ESLint tooling. GitHub's [GHSA-vfj7-8cjw-p6xm advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched version as of this review. No forced downgrade was applied. This app does not accept user-supplied glob patterns; the advisory remains a dependency maintenance item. Passing app tests is not a claim that the dependency audit is clean.

## Contributions

Actual student names, GitHub accounts, human evaluation, commits, PRs, reviews, and merge evidence remain to be recorded by the group. Steps 1–3 have separate assistant records in `docs/ai`. Step 3 was implemented and checked in the current conversation; actual human evaluation and review are pending. Refer to the outer workspace's contribution template and phase guide for the complete workflow.

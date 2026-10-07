# Campus Corner POS Kiosk

IT415 practical exam, Step 1: Item Selection. Built with Next.js App Router, strict TypeScript, Tailwind CSS, generated shadcn/ui Button/Card components, Zustand, and Lucide icons. React Hook Form, Zod, and the Zod resolver are installed for the later payment phase; Step 1 needs no form.

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

The production preview was started during implementation and left available on port 3000. Stop that process before starting another server on the same port, or use `npm.cmd run dev -- --port 3001`.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

The type-check script generates Next.js route definitions first so it also works in a fresh clone. The nine store/calculation tests cover the sample order, plus/minus, removal at quantity one, invalid quantities, rapid actions, separate store instances, and peso formatting. Browser verification and actual results are in [Step 1 results](docs/step-1-results.md).

## Implemented behavior

Six large product cards show Coffee PHP45, Sandwich PHP50, Soft Drink PHP35, Cookies PHP25, Bottled Water PHP20, and Chocolate PHP25. Clicking or keyboard-activating a card adds one unit. Cart rows show the item name, unit price, quantity, and subtotal. Plus adds one; minus removes the row at one; Remove deletes the entire row. Feedback is announced through a live status area.

Continue is disabled for an empty cart. With items, it displays a clearly labeled Step 2 placeholder and preserves the current order. No order-summary screen or later transaction feature is implemented yet.

## State and calculations

`src/data/products.ts` contains the typed, fixed product catalog. `src/types/kiosk.ts` defines products, cart items, and derived order lines. Each `KioskProvider` creates one Zustand store for its mounted kiosk. The store keeps product IDs and positive whole quantities, preventing duplicate rows and invalid quantities. It rejects totals exceeding safe integer precision.

Prices are integer centavos: Coffee is 4500. Subtotal is unit price in centavos times quantity, and total is the sum of subtotals. `formatMoney` divides only when formatting the result in PHP with two decimals. Totals are derived rather than stored separately, so they update immediately when the cart changes.

There is no database or persistent active cart. Refreshing the browser starts an empty session. Product data is appropriate as local typed data for this exam phase. Inventory, payments, authentication, receipts, and reset are outside Step 1.

## Source organization

- `src/app`: entry page, layout, and theme.
- `src/components/kiosk`: kiosk provider, product cards, current cart, and screen composition.
- `src/components/ui`: official CLI-generated shadcn/ui components.
- `src/data`, `src/types`, `src/stores`, `src/lib`: product data, types, cart actions, and shared currency formatting.
- `tests/cart.test.ts`: behavioral cart/calculation tests.
- `docs/ai/phase-01.md`: actual prompt and assistant evaluation; student evaluation remains pending.
- `docs/evidence`: real desktop/mobile screenshots.

## First feature commit and pull request

No commit, push, repository initialization, remote, or pull request was created by the assistant. No group repository URL or member identity was provided. Use the actual shared GitHub repository with an existing `main` branch (a GitHub README seed is sufficient). Do not count that seed as the Item Selection development commit.

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

The app is a standard Next.js project and builds successfully. When later authorized to deploy, import the shared repository into Vercel with framework Next.js and production branch `main`. This README does not claim a deployment exists. Do not deploy later phases as complete from this Step 1 branch.

## Dependency audit

The installation audit reported nine high-severity affected dependency entries, tracing to `braces` through tooling dependencies, including shadcn's CLI and Next.js ESLint tooling. GitHub's [GHSA-vfj7-8cjw-p6xm advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched version as of this review. No forced downgrade was applied. This app does not accept user-supplied glob patterns; the advisory remains a dependency maintenance item. Passing app tests is not a claim that the dependency audit is clean.

## Contributions

Actual student names, GitHub accounts, human evaluation, commits, PRs, reviews, and merge evidence remain to be recorded by the group. This implementation was generated and checked with the assistant in the current Step 1 conversation. Refer to the outer workspace's contribution template and phase guide for the complete workflow.

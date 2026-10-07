# Step 2 review and Git instructions

Prepared October 7, 2026, Asia/Manila. The current branch is `feature/order-summary`; it existed before this task. Changes are uncommitted and unstaged. The assistant did not commit, push, or create a PR. Step 1 being merged is supplied user context; no remote merge/review evidence was fetched or invented.

## Review first

Read `docs/step-2-results.md`, inspect the changed source and tooling, and review `docs/ai/phase-02.md`. Run the app, compare the PHP175 order on both screens, use Back and edit Coffee, remove Soft Drink for PHP140, and empty the cart to confirm Continue is disabled. Continue to Payment should only show the Step 3 placeholder and a Back button.

The actual checkout contains `app/package.json` beneath the Git root. Run app checks inside `app`, then stage paths from the outer repository root. Use the actual student Git identity already configured for the shared repository; do not attribute assistant generation to an invented person.

## After human review

From the outer repository root on `feature/order-summary`:

```bash
git status --short
git branch --show-current
git diff -- app/src app/tests app/package.json app/package-lock.json app/postcss.config.mjs app/README.md
cd app
npm run lint
npm run typecheck
npm run test
npm run build
cd ..
git add app/src/components/kiosk/cart-panel.tsx app/src/components/kiosk/kiosk.tsx app/src/components/kiosk/order-summary.tsx app/src/components/kiosk/payment-handoff.tsx app/src/stores/kiosk-store.ts app/src/types/kiosk.ts
git add app/tests/navigation.test.ts app/package.json app/package-lock.json app/postcss.config.mjs app/README.md
git add app/docs/ai/phase-02.md app/docs/step-2-results.md app/docs/step-2-review.md app/docs/step-2-pr.md
git add app/docs/evidence/step-2-*.jpg
git diff --cached --stat
git diff --cached
git commit -m "feat: add order summary with back navigation"
git push -u origin feature/order-summary
git log -1 --format="%H %an <%ae> %s"
```

Stage only real evidence files listed in the results document. Do not stage generated `.next`, `node_modules`, temporary files, or unrelated changes. If additional human edits are made, rerun the relevant checks before committing.

Open a pull request with base `main`, compare `feature/order-summary`, title **Step 2 Order Summary with Back navigation**, and body from `app/docs/step-2-pr.md`. With authenticated GitHub CLI, from the outer repository root:

```bash
gh pr create --base main --head feature/order-summary --title "Step 2 Order Summary with Back navigation" --body-file app/docs/step-2-pr.md
```

Request a real teammate review of the code and demo. Resolve actual findings on this branch, rerun checks, and request re-review. Merge only after checks and human review, following the group's merge policy (the guide recommends a merge commit). Record actual authored SHA(s), PR URL, reviewer, and merge status in the contribution register after those actions happen. Stop after Step 2; begin Step 3 only after a separate request and the dependent merge.

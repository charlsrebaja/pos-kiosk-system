# Step 3 review, commit, and PR instructions

Current branch: `feature/payment-method`. Base: the locally recorded Step 2 merge `f108c64` on `origin/main`. Step 3 changes are unstaged and uncommitted. No Step 3 push or PR was performed by the assistant.

Review `docs/step-3-results.md`, the new method screen, store actions, tests, and `docs/ai/phase-03.md`. Demo all three choices; compare the total with summary; use Back; verify Continue is disabled without a choice and that selection/handoff never produces success or a receipt. Record your real human evaluation and any modifications in the AI record before committing.

From the outer repository root, after review:

```bash
git branch --show-current
git status --short
cd app
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
cd ..
git diff
git add app/src/types/kiosk.ts app/src/data/payment-methods.ts app/src/stores/kiosk-store.ts app/src/components/kiosk/kiosk.tsx app/src/components/kiosk/payment-method.tsx
git add -A app/src/components/kiosk/payment-handoff.tsx
git add app/tests/payment-method.test.ts app/README.md
git add app/docs/ai/phase-03.md app/docs/step-3-results.md app/docs/step-3-review.md app/docs/step-3-pr.md
git add app/docs/evidence/step-3-*.jpg
git diff --cached --stat
git diff --cached
git commit -m "feat: add cash QR and card payment selection"
git push -u origin feature/payment-method
git log -1 --format="%H %an <%ae> %s"
```

Use your own real, verified Git author identity. Stage only the intended phase changes and listed evidence; do not stage generated `.next`, `node_modules`, temporary files, or unrelated edits. The `git add -A` line stages removal of the superseded placeholder. App checks run inside `app`; Git paths here are relative to the outer repository root.

Open a PR with base **main**, compare **feature/payment-method**, title **Step 3 Payment Method Selection**, and body from `app/docs/step-3-pr.md`. With authenticated GitHub CLI, from the outer root:

```bash
gh pr create --base main --head feature/payment-method --title "Step 3 Payment Method Selection" --body-file app/docs/step-3-pr.md
```

Request a real teammate review of the diff and demo. Resolve actual findings with follow-up changes on this branch, rerun relevant checks, and request re-review. Merge only after checks and review. Record real authored SHA(s), PR URL, reviewer, merge status, and merge SHA in the contribution register after those actions occur. After the merge, update local `main` and run `npm ci` inside `app` before previewing it. Step 4 requires a separate implementation request.

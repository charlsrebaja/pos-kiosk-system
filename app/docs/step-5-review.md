# Step 5 review and Git handoff

Run from `app` on the user's existing branch `feature/payment-success`. These are instructions, not completed Git actions. Review the confirmation source, store guard, actual results, and AI log. Fill in actual student evaluation/manual modifications before committing.

```powershell
git branch --show-current
git status --short
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
git add src tests/payment-success.test.ts README.md docs/ai/phase-05.md docs/step-5-results.md docs/step-5-review.md docs/step-5-pr.md
git diff --cached --stat
git diff --cached
git commit -m "feat: show payment confirmation and unique reference"
git push -u origin feature/payment-success
git log -1 --format="%H %an <%ae> %s"
gh pr create --base main --head feature/payment-success --title "Step 5: show completed payment confirmation" --body-file docs/step-5-pr.md
```

Alternatively use GitHub Compare & pull request with base main and compare feature/payment-success. Request a real teammate review of all three method labels/amounts, rejected/pending guards, original reference/time reuse, touch layout, and View Receipt handoff. Address actual findings with real follow-up commits. Record actual author SHA, PR URL, reviewer, findings, review status, and eventual merge SHA only after they exist. Stop after Step 5; leave the receipt implementation to Step 6.

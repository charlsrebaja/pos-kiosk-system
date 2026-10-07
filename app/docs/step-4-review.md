# Step 4 review and Git handoff

These commands are instructions; the assistant has not staged, committed, pushed, or opened a PR. Run from `app` on the existing `feature/payment-processing` branch. Review the source, results, and AI evaluation first. Record actual student identity and human modifications in `docs/ai/phase-04.md`.

```powershell
git branch --show-current
git status --short
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
git add src tests README.md docs/ai/phase-04.md docs/step-4-results.md docs/step-4-review.md docs/step-4-pr.md
git diff --cached --stat
git diff --cached
git commit -m "feat: process and validate simulated payments"
git push -u origin feature/payment-processing
git log -1 --format="%H %an <%ae> %s"
gh pr create --base main --head feature/payment-processing --title "Step 4: validate and process simulated payments" --body-file docs/step-4-pr.md
```

Alternatively open Compare & pull request on GitHub after pushing. Require a real teammate review of invalid cash, PHP175 sample payments, QR/card simulation, processing locks, snapshot contents and rapid taps. Address real findings with descriptive follow-up commits; for a reproduced payment defect use `fix: <actual corrected defect>` and record before/after evidence and the actual SHA in the results/AI log. Do not create a fake bug or manufacture a defective commit. The BigInt compilation correction is included in these reviewable feature changes; no separate fix commit exists yet.

Record actual authored SHA, PR URL, reviewer, review outcome, and eventual merge SHA/status only after they exist. Stop after Step 4; do not implement Step 5 or merge without the group review cycle.

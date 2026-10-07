# Step 6 review and Git handoff

The user's existing branch is `feature/receipt`, starting from merged Step 5 at `0f6a1fe`. Step 6 changes remain uncommitted. These are commands for the student to execute after inspecting the changes, not Git actions already performed by the assistant. Preserve other work if the working tree changes before review.

## Inspect and reproduce

Run from the outer repository root (the app is a subfolder):

```powershell
Set-Location 'C:\Users\Charls\Desktop\pos-kiosk-system'
git branch --show-current
git status --short
git diff
npm.cmd --prefix app run lint
npm.cmd --prefix app run typecheck
npm.cmd --prefix app run test
npm.cmd --prefix app run build
npm.cmd --prefix app run start -- --port 3003
```

Confirm the branch is `feature/receipt`. Do not start a second server on port 3003 if the assistant's production preview is still running; use that preview, or stop it first. Open localhost:3003. Build Coffee x2 + Sandwich x1 + Soft Drink x1, continue through summary and Cash, enter PHP200, and pay. Check confirmation and receipt share the original reference and Manila date/time; items total PHP175, paid PHP200, change PHP25. Back to confirmation and reopen the receipt. Repeat with QR and Card in separate refreshed demo sessions: paid equals PHP175 and change PHP0. New Transaction should show its Step 7 handoff and keep the completed receipt.

Review `receipt.tsx`, the guarded Zustand transitions, shared time formatter, tests, [actual results](step-6-results.md), and [AI record](ai/phase-06.md). Record your real evaluation and any human modifications before committing. Use your own Git author identity and GitHub account; do not attribute work to a teammate who did not perform it.

## Stage and commit this phase

After returning to the repository root, stage only the reviewed phase files:

```powershell
git add app/src/components/kiosk/receipt.tsx app/src/components/kiosk/payment-success.tsx app/src/components/kiosk/kiosk.tsx app/src/lib/transaction-time.ts app/src/stores/kiosk-store.ts app/src/types/kiosk.ts app/tests/receipt.test.ts app/tests/payment-success.test.ts app/README.md app/docs/ai/phase-06.md app/docs/step-6-results.md app/docs/step-6-review.md app/docs/step-6-pr.md app/docs/evidence/step-6-cash-desktop.png app/docs/evidence/step-6-cash-mobile.png app/docs/evidence/step-6-qr.png app/docs/evidence/step-6-card.png
git diff --cached --stat
git diff --cached
git commit -m "feat: display completed transaction receipt"
git push -u origin feature/receipt
git log -1 --format="%H %an <%ae> %s"
gh pr create --base main --head feature/receipt --title "Step 6: display completed transaction receipt" --body-file app/docs/step-6-pr.md
```

GitHub CLI is optional and requires authentication. Alternatively open the shared repository on GitHub, choose Compare & pull request, base `main`, compare `feature/receipt`, and use the prepared `app/docs/step-6-pr.md` description. The guide's generic `feature/step-6-receipt` example is superseded by the user's explicit branch name.

## Real contribution and PR evidence

Request a real teammate review of all receipt fields for Cash, QR, and Card, snapshot reuse, Manila display, rejected/pending guards, readable touch layout, and the Step 7 placeholder. Have the reviewer record what they actually checked using GitHub's review controls. Address actual findings on this branch with genuine follow-up commits and repeat affected checks.

Record actual member ID/name/GitHub account, original authored SHA(s), branch, PR URL, reviewer/review link, findings and resolutions, review status, and eventual merge SHA in the group's contribution register. Mark these pending until they exist. After checks and review, merge the PR into `main` using the group's agreed method; preserving the authored feature commit through a merge commit supports contribution evidence. Stop after Step 6. Begin Step 7 only after the reviewed merge is synchronized locally.

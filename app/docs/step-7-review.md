# Step 7 review and Git handoff

User-specified existing branch: `feature/new-transaction`. Clean starting HEAD: `67bce1d`, merged Step 6. Changes are uncommitted for review. The following commands are instructions for the student, not actions already performed by the assistant.

## Review and reproduce

Run from the outer repository root:

```powershell
Set-Location 'C:\Users\Charls\Desktop\pos-kiosk-system'
git branch --show-current
git status --short
git diff
npm.cmd --prefix app run lint
npm.cmd --prefix app run typecheck
npm.cmd --prefix app run test
npm.cmd --prefix app run build
npm.cmd --prefix app run start -- --port 3004
```

Confirm branch `feature/new-transaction`. Use the existing preview if port 3004 is already running; do not start a second server there. Complete the PHP175 sample in Cash, paid PHP200. Record its reference. Click View Receipt then New Transaction. Verify Items, no old details/feedback/errors, empty cart, PHP0, disabled Continue, and six intact product cards. Build Bottled Water + Cookies, PHP45. All payment choices should be unselected. Select Cash and inspect its blank input/no old error; then Back, choose QR and complete. Verify PHP45 paid, zero change, only the new purchased items, and a reference different from the first. Do not refresh between orders. Repeat New Transaction from the second receipt.

Inspect the atomic reset, generation guard on success and catch paths, form lifecycle guard, and new regression tests. Read [actual results](step-7-results.md) and [AI record](ai/phase-07.md). Record your real evaluation and any human modifications; use your actual Git author identity and GitHub login.

## Stage, feature commit, and PR

From the repository root, stage only the reviewed phase files:

```powershell
git add app/src/stores/kiosk-store.ts app/src/components/kiosk/receipt.tsx app/src/components/kiosk/payment-processing.tsx app/tests/new-transaction.test.ts app/README.md app/docs/ai/phase-07.md app/docs/step-7-results.md app/docs/step-7-review.md app/docs/step-7-pr.md app/docs/evidence/step-7-first-cash.png app/docs/evidence/step-7-empty-after-reset.png app/docs/evidence/step-7-fresh-cash-form.png app/docs/evidence/step-7-second-qr.png
git diff --cached --stat
git diff --cached
git commit -m "feat: reset kiosk for a new transaction"
git push -u origin feature/new-transaction
git log -1 --format="%H %an <%ae> %s"
gh pr create --base main --head feature/new-transaction --title "Step 7: reset kiosk for a new transaction" --body-file app/docs/step-7-pr.md
```

GitHub CLI requires authentication. Alternatively use GitHub Compare & pull request with base `main`, compare `feature/new-transaction`, and the prepared PR body. The guide's generic `feature/step-7-new-transaction` example is superseded by the user's explicit branch.

## Contribution and review evidence

Request a real teammate review of the reset fields, fresh cash form, two consecutive different-method transactions, catalog preservation, stale completion/error protections, and new reference creation. The reviewer should record what was actually inspected and demonstrated in GitHub's review controls. Address genuine findings on this branch and rerun affected checks.

Record actual member ID/name/GitHub account, branch, original authored SHA(s), PR URL, reviewer/review link, findings/resolutions, review status, and eventual merge SHA in the group's contribution register. Keep these pending until they exist. Merge only after checks and review, following the group's agreed method; a merge commit preserves the original authored feature commit. Stop after Step 7. Any final acceptance audit or deployment is separate work.

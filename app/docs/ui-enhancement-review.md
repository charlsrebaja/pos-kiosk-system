# UI enhancement: review and Git handoff

Working branch: `feature/enhance-ui`; initial HEAD `8ea9f29`, merged Step 7. Changes remain uncommitted. These commands are instructions for the student, not actions already performed.

## Review and reproduce

```powershell
Set-Location 'C:\Users\Charls\Desktop\pos-kiosk-system'
git branch --show-current
git status --short
git diff
npm.cmd --prefix app run lint
npm.cmd --prefix app run typecheck
npm.cmd --prefix app run test
npm.cmd --prefix app run build
npm.cmd --prefix app run start -- --port 3005
```

Use the existing preview if port 3005 is already running. Inspect the desktop grid/cart, 390px Items and 320px receipt, sticky header during scroll, keyboard focus, touch actions and image mappings. Complete Cash PHP175 paid PHP200, reopen receipt, check unchanged reference/date and PHP25 change. Check QR/Card paid equals total with zero change. Check reset, blank next cash input, and distinct references.

Manually inspect browser Print Receipt preview on intended paper size: only receipt, all fields, black on white, readable reference wrapping, no clipping or extra blank pages. Turn off browser headers/footers. Cancel and confirm unchanged payment details. Read [actual results](ui-enhancement-results.md) and [AI record](ai/ui-enhancement.md); record your own evaluation and modifications.

## Stage reviewed files, commit, and open PR

Run from repository root. Assets are required static imports; include all six originals. Stage only the reviewed enhancement files:

```powershell
git add app/assets/images app/src/data/product-images.ts app/public/campus-icon.svg app/src/app/globals.css app/src/components/kiosk/cart-panel.tsx app/src/components/kiosk/kiosk.tsx app/src/components/kiosk/order-summary.tsx app/src/components/kiosk/payment-method.tsx app/src/components/kiosk/payment-success.tsx app/src/components/kiosk/product-card.tsx app/src/components/kiosk/receipt.tsx app/src/components/ui/button.tsx app/README.md app/docs/ui-enhancement-results.md app/docs/ui-enhancement-review.md app/docs/ui-enhancement-pr.md app/docs/ai/ui-enhancement.md app/docs/evidence/ui-items-desktop.png app/docs/evidence/ui-items-mobile.png app/docs/evidence/ui-receipt-desktop.png app/docs/evidence/ui-receipt-mobile.png
git diff --cached --check
git diff --cached --stat
git diff --cached
git commit -m "feat: refresh kiosk UI and add receipt printing"
git push -u origin feature/enhance-ui
git log -1 --format="%H %an <%ae> %s"
gh pr create --base main --head feature/enhance-ui --title "Refresh kiosk UI and add receipt printing" --body-file app/docs/ui-enhancement-pr.md
```

Use your own real Git author identity and GitHub login. GitHub CLI must already be installed and authenticated; otherwise use GitHub Compare & pull request with base `main`, compare `feature/enhance-ui`, and the prepared PR body.

Request an actual teammate review covering assets, touch/responsive layout, focus/sticky behavior, print preview, receipt snapshot stability and reset. Record real authored SHA(s), PR URL, reviewer/review link, findings, resolutions and eventual merge SHA in the contribution register. These are pending until they exist. No deployment is part of this task.

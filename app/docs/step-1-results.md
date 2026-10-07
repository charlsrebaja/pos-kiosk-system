# Step 1 verification results

Verified October 7, 2026, Asia/Manila, against the locally built application.

## Command checks

| Check | Observed outcome |
|---|---|
| `npm.cmd run lint` | Passed with no lint diagnostics |
| `npm.cmd run typecheck` | Passed with no TypeScript diagnostics |
| `npm.cmd run test` | 9 tests passed, 0 failed when run outside the sandbox |
| `npm.cmd run build` | Passed; `/` and `/_not-found` generated successfully |
| `npm.cmd run start` | Production preview ready on localhost:3000 |

The initial sandbox test run failed in the runner's Windows user-profile lookup (`uv_os_get_passwd`), before any tests executed. Retrying outside the sandbox passed all tests. The initial browser navigation preceded server startup and was refused; browser verification below occurred after the production server was ready.

## Browser checks

| Scenario | Observed result |
|---|---|
| Initial cart | Empty state, total PHP0.00, Continue disabled |
| Coffee tapped twice | One Coffee row, quantity 2, subtotal PHP90.00 |
| Add Sandwich and Soft Drink | Subtotals PHP90, PHP50, PHP35; total PHP175.00 |
| Increase Coffee to three | Total PHP220.00 |
| Decrease Coffee to two | Total PHP175.00 |
| Remove Soft Drink | Row removed; total PHP140.00 |
| Minus on Sandwich at one | Sandwich row removed |
| Remove the remaining Coffee | Empty cart; total PHP0; Continue disabled again |
| Nonempty Continue | Step 2 placeholder shown; order kept on Item Selection |
| Other three products | Cookies, Bottled Water, Chocolate selectable; total PHP245 when added to the sample order |
| Keyboard | Space on the Chocolate product button added an item |
| Touch-oriented sizes | Plus/minus 48px by 48px; Remove 48px high; Continue 56px high; entire product card clickable |
| Responsive layout | No document horizontal overflow at 320px, 390px, or 768px widths; desktop grid/cart inspected |
| Console | Browser inspection returned no error/warning messages |

After responsive checks, the browser was restored to its normal viewport and the sample PHP175 order. Screenshots show real browser state:

- [Desktop sample order](evidence/step-1-desktop.png)
- [390px mobile sample order](evidence/step-1-mobile.png)

Browser checks use clicks and keyboard input. No physical touchscreen device was tested. Student demo, teammate review, GitHub evidence, and deployment remain pending. npm audit also reports the dependency maintenance issue described in README.

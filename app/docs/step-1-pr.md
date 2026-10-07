Implements Step 1 Item Selection for the IT415 campus POS kiosk. Six large product cards add products to a current-order panel with whole quantities, plus/minus controls, removal, per-item subtotals, and a derived total in Philippine pesos.

The project includes Next.js App Router, strict TypeScript, Tailwind CSS, generated shadcn/ui Button/Card components, and an isolated Zustand store. React Hook Form/Zod dependencies are prepared for the later payment phase. Continue is disabled for an empty order and shows a Step 2 placeholder for a nonempty order.

Validation performed by the assistant
- ESLint, TypeScript, and production build passed.
- Nine cart/calculation tests passed.
- Browser sample: Coffee x2 + Sandwich + Soft Drink = PHP175.
- Quantity changes produced PHP220 then PHP175; removing Soft Drink produced PHP140.
- Minus at one removes the row; empty cart disables Continue.
- Responsive checks at 320px, 390px, and 768px had no horizontal overflow.

Evidence
- docs/step-1-results.md
- docs/evidence/step-1-desktop.png
- docs/evidence/step-1-mobile.png
- docs/ai/phase-01.md

Student author/member: to be filled by the actual author before opening the PR.
Student evaluation and teammate review: pending.
Dependency audit: reported tooling dependency advisory is documented in README; no patched version was listed during review.

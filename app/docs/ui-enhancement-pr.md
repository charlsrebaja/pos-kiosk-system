# Refresh kiosk UI and add receipt printing

The seven-step kiosk now uses a blue-and-white interface with a compact sticky header and six supplied product photos. Product selection, order review, payment and confirmation share the palette and touch controls. Receipt places the completed transaction on the left and information/actions on the right on desktop, stacking on mobile.

Print Receipt invokes browser printing on click. Print styles hide surrounding UI and retain all receipt fields in black on white. Printing reads the existing immutable snapshot and does not reset or create new payment details. Existing prices, centavo calculations, validation, simulation guards and reset behavior are preserved.

Validation: lint, typecheck, 63 regression tests and production build passed. Browser checks covered desktop/mobile layout, all six photos, Cash PHP175/PHP200/PHP25, QR PHP45/PHP45/PHP0, Card PHP25/PHP25/PHP0, distinct references and clean reset/fresh cash input. See `app/docs/ui-enhancement-results.md` for screenshots and actual results.

Review still needs target-browser print-preview/pagination inspection: the native print modal blocked automation. Cancelling retained the original reference/time. The supplied cookies image contains a watermark and remains unchanged. Include all six original assets with the source so fresh-clone builds work.

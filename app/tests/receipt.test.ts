import assert from "node:assert/strict";
import test from "node:test";
import { getPaymentMethodLabel } from "../src/data/payment-methods";
import { formatCompletionTime } from "../src/lib/transaction-time";
import { createKioskStore } from "../src/stores/kiosk-store";

function checkout(method: "cash" | "qr" | "card") {
  const store = createKioskStore();
  for (const id of ["coffee", "coffee", "sandwich", "soft-drink"] as const) store.getState().addItem(id);
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  store.getState().selectPaymentMethod(method);
  store.getState().preparePayment();
  return store;
}

for (const method of ["cash", "qr", "card"] as const) {
  test(`${method} receipt preserves every completed field through reopening and unrelated live cart changes`, async () => {
    const store = checkout(method);
    await store.getState().submitPayment(method === "cash" ? "200" : undefined);
    const snapshot = store.getState().completedTransaction!;
    const original = JSON.stringify(snapshot);
    store.getState().requestReceipt();
    assert.equal(store.getState().screen, "receipt");
    assert.deepEqual(snapshot.items.map((item) => [item.name, item.quantity, item.unitPriceCentavos, item.subtotalCentavos]), [
      ["Coffee", 2, 4500, 9000], ["Sandwich", 1, 5000, 5000], ["Soft Drink", 1, 3500, 3500],
    ]);
    assert.equal(snapshot.totalCentavos, 17500);
    assert.equal(snapshot.paidCentavos, method === "cash" ? 20000 : 17500);
    assert.equal(snapshot.changeCentavos, method === "cash" ? 2500 : 0);
    assert.equal(getPaymentMethodLabel(snapshot.method), method === "cash" ? "Cash" : method === "qr" ? "QR Payment" : "Credit/Debit Card");
    assert.match(snapshot.reference, /^TXN-/);
    assert.ok(Number.isFinite(Date.parse(snapshot.completedAt)));
    // Simulate replacement of active cart data independently of the completed order.
    store.setState({ items: [{ productId: "chocolate", quantity: 9 }], selectedMethod: "cash" });
    for (let count = 0; count < 3; count++) {
      store.getState().backToSuccess();
      assert.equal(store.getState().screen, "success");
      store.getState().requestReceipt();
      assert.equal(store.getState().screen, "receipt");
      assert.strictEqual(store.getState().completedTransaction, snapshot);
      assert.equal(JSON.stringify(snapshot), original);
    }
  });
}

test("receipt is inaccessible for empty, pending, rejected, or missing-snapshot sessions", async () => {
  const empty = createKioskStore();
  empty.getState().requestReceipt();
  empty.getState().backToSuccess();
  assert.equal(empty.getState().screen, "items");
  const rejected = checkout("cash");
  assert.equal(await rejected.getState().submitPayment("100"), false);
  rejected.getState().requestReceipt();
  assert.equal(rejected.getState().screen, "processing");
  const pending = checkout("card");
  const payment = pending.getState().submitPayment();
  pending.getState().requestReceipt();
  assert.equal(pending.getState().screen, "processing");
  await payment;
  pending.setState({ completedTransaction: null });
  pending.getState().requestReceipt();
  assert.equal(pending.getState().screen, "success");
});

test("receipt date uses Manila across UTC midnight regardless of host timezone", () => {
  const originalTimezone = process.env.TZ;
  try {
    for (const timezone of ["UTC", "America/Los_Angeles", "Asia/Tokyo"]) {
      process.env.TZ = timezone;
      assert.equal(formatCompletionTime("2026-10-07T16:05:00.000Z"), "Oct 8, 2026, 12:05 AM");
      assert.equal(formatCompletionTime("2026-10-07T00:00:00.000Z"), "Oct 7, 2026, 8:00 AM");
    }
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

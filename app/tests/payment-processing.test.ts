import assert from "node:assert/strict";
import test from "node:test";
import { createCashPaymentSchema } from "../src/lib/payment-schema";
import { createKioskStore } from "../src/stores/kiosk-store";
import type { PaymentMethod } from "../src/types/kiosk";

function paymentOrder(method: PaymentMethod = "cash", removeDrink = false) {
  const store = createKioskStore();
  for (const id of ["coffee", "coffee", "sandwich", "soft-drink"] as const) store.getState().addItem(id);
  if (removeDrink) store.getState().removeItem("soft-drink");
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  store.getState().selectPaymentMethod(method);
  store.getState().preparePayment();
  return store;
}

const invalid = ["", " ", "abc", "200abc", "1e3", "1,000", "-200", "-0", "NaN", "Infinity", "-Infinity", "175.001", "200.", ".50", "100", "0", "174.99", "90071992547409.92"];
for (const amount of invalid) {
  test(`cash rejects ${JSON.stringify(amount)} without completing a transaction`, async () => {
    const store = paymentOrder();
    assert.equal(createCashPaymentSchema(17500).safeParse({ amountPaid: amount }).success, false);
    assert.equal(await store.getState().submitPayment(amount), false);
    assert.equal(store.getState().screen, "processing");
    assert.equal(store.getState().isProcessing, false);
    assert.equal(store.getState().completedTransaction, null);
    assert.ok(store.getState().paymentError);
  });
}

for (const [amount, paid, change] of [["200", 20000, 2500], ["175", 17500, 0], ["175.01", 17501, 1]] as const) {
  test(`PHP175 paid with ${amount}: one frozen snapshot, change ${change} centavos`, async () => {
    const store = paymentOrder();
    let completions = 0;
    store.subscribe((state, previous) => {
      if (state.completedTransaction !== previous.completedTransaction && state.completedTransaction) completions++;
    });
    const first = store.getState().submitPayment(amount);
    assert.equal(store.getState().isProcessing, true);
    const repeated = Array.from({ length: 20 }, () => store.getState().submitPayment(amount));
    assert.equal(await first, true);
    assert.ok((await Promise.all(repeated)).every((result) => !result));
    const snapshot = store.getState().completedTransaction!;
    assert.equal(snapshot.totalCentavos, 17500);
    assert.equal(snapshot.paidCentavos, paid);
    assert.equal(snapshot.changeCentavos, change);
    assert.equal(snapshot.method, "cash");
    assert.match(snapshot.reference, /^TXN-[0-9a-f-]{36}$/);
    assert.ok(Number.isFinite(Date.parse(snapshot.completedAt)));
    assert.ok(Object.isFrozen(snapshot) && Object.isFrozen(snapshot.items) && snapshot.items.every(Object.isFrozen));
    assert.deepEqual(snapshot.items.map((line) => [line.name, line.quantity, line.unitPriceCentavos, line.subtotalCentavos]),
      [["Coffee", 2, 4500, 9000], ["Sandwich", 1, 5000, 5000], ["Soft Drink", 1, 3500, 3500]]);
    assert.equal(await store.getState().submitPayment(amount), false);
    assert.strictEqual(store.getState().completedTransaction, snapshot);
    assert.equal(completions, 1);
  });
}

for (const method of ["qr", "card"] as const) {
  test(`${method}: visible processing state locks edits, method, navigation and duplicate submissions`, async () => {
    const store = paymentOrder(method);
    const items = store.getState().items;
    let completions = 0;
    store.subscribe((state, previous) => { if (state.completedTransaction && !previous.completedTransaction) completions++; });
    const pending = store.getState().submitPayment();
    assert.equal(store.getState().isProcessing, true);
    assert.equal(store.getState().completedTransaction, null);
    store.getState().addItem("coffee");
    store.getState().decreaseItem("coffee");
    store.getState().removeItem("sandwich");
    store.getState().setQuantity("coffee", 5);
    store.getState().backToMethods();
    store.getState().backToSummary();
    store.getState().backToItems();
    store.getState().selectPaymentMethod("cash");
    assert.strictEqual(store.getState().items, items);
    assert.equal(store.getState().screen, "processing");
    assert.equal(store.getState().selectedMethod, method);
    assert.equal(await store.getState().submitPayment(), false);
    assert.equal(await pending, true);
    const snapshot = store.getState().completedTransaction!;
    assert.equal(snapshot.method, method);
    assert.equal(snapshot.paidCentavos, 17500);
    assert.equal(snapshot.changeCentavos, 0);
    assert.equal(completions, 1);
    store.getState().removeItem("coffee");
    assert.strictEqual(store.getState().completedTransaction, snapshot);
    assert.strictEqual(store.getState().items, items);
  });
}

test("reject then retry; updated PHP140 total; separate completed references", async () => {
  const first = paymentOrder("cash", true);
  assert.equal(await first.getState().submitPayment("100"), false);
  assert.equal(await first.getState().submitPayment("200"), true);
  assert.equal(first.getState().completedTransaction!.totalCentavos, 14000);
  assert.equal(first.getState().completedTransaction!.changeCentavos, 6000);
  assert.equal(first.getState().paymentError, "");
  const second = paymentOrder("qr", true);
  await second.getState().submitPayment();
  assert.equal(second.getState().completedTransaction!.paidCentavos, 14000);
  assert.notEqual(first.getState().completedTransaction!.reference, second.getState().completedTransaction!.reference);
});

test("selection and out-of-order submissions never complete; Back allows edits before payment", async () => {
  const store = createKioskStore();
  assert.equal(await store.getState().submitPayment("200"), false);
  const checkout = paymentOrder();
  checkout.getState().backToMethods();
  assert.equal(await checkout.getState().submitPayment("200"), false);
  checkout.getState().backToSummary();
  checkout.getState().backToItems();
  checkout.getState().removeItem("soft-drink");
  assert.equal(checkout.getState().completedTransaction, null);
});

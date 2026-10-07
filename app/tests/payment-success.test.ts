import assert from "node:assert/strict";
import test from "node:test";
import { createKioskStore } from "../src/stores/kiosk-store";
import type { PaymentMethod } from "../src/types/kiosk";

function checkout(method: PaymentMethod) {
  const store = createKioskStore();
  for (const id of ["coffee", "coffee", "sandwich", "soft-drink"] as const) store.getState().addItem(id);
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  store.getState().selectPaymentMethod(method);
  store.getState().preparePayment();
  return store;
}

for (const method of ["cash", "qr", "card"] as const) {
  test(`${method} confirmation and repeated receipt handoffs retain the same completed snapshot`, async () => {
    const store = checkout(method);
    const pending = store.getState().submitPayment(method === "cash" ? "200" : undefined);
    store.getState().requestReceipt();
    assert.equal(store.getState().screen, "processing");
    assert.equal(store.getState().receiptHandoffRequested, false);
    await pending;
    const transaction = store.getState().completedTransaction!;
    const before = JSON.stringify(transaction);
    assert.equal(store.getState().screen, "success");
    assert.equal(transaction.totalCentavos, 17500);
    assert.equal(transaction.paidCentavos, method === "cash" ? 20000 : 17500);
    assert.equal(transaction.changeCentavos, method === "cash" ? 2500 : 0);
    assert.equal(transaction.method, method);
    let updates = 0;
    store.subscribe(() => updates++);
    for (let i = 0; i < 20; i++) store.getState().requestReceipt();
    assert.equal(store.getState().receiptHandoffRequested, true);
    assert.equal(store.getState().screen, "success");
    assert.equal(updates, 1);
    assert.strictEqual(store.getState().completedTransaction, transaction);
    assert.equal(JSON.stringify(transaction), before);
    assert.equal(await store.getState().submitPayment("200"), false);
    assert.strictEqual(store.getState().completedTransaction, transaction);
  });
}

test("empty sessions and rejected cash never enter success or prepare a receipt", async () => {
  const empty = createKioskStore();
  empty.getState().requestReceipt();
  assert.equal(empty.getState().screen, "items");
  assert.equal(empty.getState().receiptHandoffRequested, false);
  const store = checkout("cash");
  for (const input of ["", "abc", "-200", "Infinity", "175.001", "100"]) {
    assert.equal(await store.getState().submitPayment(input), false);
    store.getState().requestReceipt();
    assert.equal(store.getState().screen, "processing");
    assert.equal(store.getState().completedTransaction, null);
    assert.equal(store.getState().receiptHandoffRequested, false);
  }
});

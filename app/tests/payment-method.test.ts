import assert from "node:assert/strict";
import test from "node:test";
import { paymentMethods } from "../src/data/payment-methods";
import { createKioskStore, getTotalCentavos } from "../src/stores/kiosk-store";
import type { PaymentMethod } from "../src/types/kiosk";

function paymentOrder() {
  const store = createKioskStore();
  store.getState().addItem("coffee");
  store.getState().addItem("coffee");
  store.getState().addItem("sandwich");
  store.getState().addItem("soft-drink");
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  return store;
}

for (const { id, label } of paymentMethods) {
  test(`${label} selection preserves the order and only prepares an unpaid handoff`, () => {
    const store = paymentOrder();
    const items = store.getState().items;
    store.getState().selectPaymentMethod(id);
    assert.equal(store.getState().selectedMethod, id);
    assert.equal(store.getState().screen, "method");
    assert.equal(store.getState().paymentHandoffRequested, false);
    assert.strictEqual(store.getState().items, items);
    assert.equal(getTotalCentavos(store.getState().items), 17500);
    store.getState().preparePayment();
    store.getState().preparePayment();
    assert.equal(store.getState().paymentHandoffRequested, true);
    assert.equal(store.getState().screen, "method");
    assert.strictEqual(store.getState().items, items);
  });
}

test("empty, out-of-order, invalid, and unselected requests cannot prepare a handoff", () => {
  const empty = createKioskStore();
  empty.getState().selectPaymentMethod("cash");
  empty.getState().preparePayment();
  assert.equal(empty.getState().selectedMethod, null);
  assert.equal(empty.getState().paymentHandoffRequested, false);

  empty.getState().addItem("coffee");
  empty.getState().selectPaymentMethod("cash");
  assert.equal(empty.getState().selectedMethod, null);
  empty.getState().reviewOrder();
  empty.getState().preparePayment();
  empty.getState().selectPaymentMethod("qr");
  assert.equal(empty.getState().selectedMethod, null);
  empty.getState().continueToPayment();
  empty.getState().selectPaymentMethod("unknown" as PaymentMethod);
  empty.getState().preparePayment();
  assert.equal(empty.getState().selectedMethod, null);
  assert.equal(empty.getState().paymentHandoffRequested, false);
});

test("Back preserves method and cart while order edits refresh the total", () => {
  const store = paymentOrder();
  const items = store.getState().items;
  store.getState().selectPaymentMethod("qr");
  store.getState().backToSummary();
  assert.equal(store.getState().screen, "summary");
  assert.strictEqual(store.getState().items, items);
  assert.equal(store.getState().selectedMethod, "qr");
  store.getState().backToItems();
  store.getState().removeItem("soft-drink");
  store.getState().reviewOrder();
  assert.equal(getTotalCentavos(store.getState().items), 14000);
  store.getState().continueToPayment();
  assert.equal(getTotalCentavos(store.getState().items), 14000);
  assert.equal(store.getState().selectedMethod, "qr");
});

test("changing the method, going Back, or editing an order clears the previous handoff", () => {
  const store = paymentOrder();
  store.getState().selectPaymentMethod("cash");
  store.getState().preparePayment();
  store.getState().selectPaymentMethod("card");
  assert.equal(store.getState().selectedMethod, "card");
  assert.equal(store.getState().paymentHandoffRequested, false);
  store.getState().preparePayment();
  store.getState().backToSummary();
  assert.equal(store.getState().paymentHandoffRequested, false);
  store.getState().preparePayment();
  assert.equal(store.getState().paymentHandoffRequested, false);
  store.getState().continueToPayment();
  store.getState().preparePayment();
  store.getState().decreaseItem("coffee");
  assert.equal(store.getState().paymentHandoffRequested, false);
});

test("emptying an order clears the method and requires a new choice for the next order", () => {
  const store = paymentOrder();
  store.getState().selectPaymentMethod("card");
  store.getState().preparePayment();
  for (const item of [...store.getState().items]) store.getState().removeItem(item.productId);
  assert.equal(store.getState().screen, "items");
  assert.equal(store.getState().selectedMethod, null);
  assert.equal(store.getState().paymentHandoffRequested, false);
  store.getState().addItem("sandwich");
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  store.getState().preparePayment();
  assert.equal(store.getState().paymentHandoffRequested, false);
});

test("kiosk instances do not share a selected method or handoff", () => {
  const first = paymentOrder();
  const second = paymentOrder();
  first.getState().selectPaymentMethod("cash");
  first.getState().preparePayment();
  assert.equal(second.getState().selectedMethod, null);
  assert.equal(second.getState().paymentHandoffRequested, false);
});

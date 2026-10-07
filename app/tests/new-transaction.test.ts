import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../src/data/products";
import { createKioskStore, getTotalCentavos, type KioskStore } from "../src/stores/kiosk-store";
import type { PaymentMethod, ProductId } from "../src/types/kiosk";

function prepare(store: KioskStore, method: PaymentMethod, ids: ProductId[] = ["coffee", "coffee", "sandwich", "soft-drink"]) {
  for (const id of ids) store.getState().addItem(id);
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  store.getState().selectPaymentMethod(method);
  store.getState().preparePayment();
}

function assertClean(store: KioskStore) {
  const state = store.getState();
  assert.equal(state.screen, "items");
  assert.deepEqual(state.items, []);
  assert.equal(getTotalCentavos(state.items), 0);
  assert.equal(state.selectedMethod, null);
  assert.equal(state.completedTransaction, null);
  assert.equal(state.paymentError, "");
  assert.equal(state.feedback, "");
  assert.equal(state.isProcessing, false);
  assert.equal(state.paymentHandoffRequested, false);
  assert.equal(state.receiptHandoffRequested, false);
}

for (const method of ["cash", "qr", "card"] as const) {
  test(`New Transaction after ${method} clears all state and completes a different second order`, async () => {
    const store = createKioskStore();
    const catalog = JSON.stringify(products);
    prepare(store, method);
    await store.getState().submitPayment(method === "cash" ? "200" : undefined);
    const first = store.getState().completedTransaction!;
    const original = JSON.stringify(first);
    store.getState().requestReceipt();
    assert.equal(store.getState().screen, "receipt");
    store.getState().resetTransaction();
    assertClean(store);
    store.getState().reviewOrder();
    store.getState().continueToPayment();
    store.getState().requestReceipt();
    store.getState().backToSuccess();
    assertClean(store);
    assert.equal(JSON.stringify(products), catalog);
    const nextMethod = method === "cash" ? "qr" : "cash";
    prepare(store, nextMethod, ["bottled-water", "cookies"]);
    if (nextMethod === "cash") {
      assert.equal(await store.getState().submitPayment(""), false);
      assert.equal(store.getState().completedTransaction, null);
    }
    assert.equal(await store.getState().submitPayment(nextMethod === "cash" ? "50" : undefined), true);
    const second = store.getState().completedTransaction!;
    assert.notEqual(second.reference, first.reference);
    assert.notEqual(second.completedAt, first.completedAt);
    assert.equal(second.method, nextMethod);
    assert.equal(second.totalCentavos, 4500);
    assert.equal(second.paidCentavos, nextMethod === "cash" ? 5000 : 4500);
    assert.equal(second.changeCentavos, nextMethod === "cash" ? 500 : 0);
    assert.deepEqual(second.items.map((item) => item.id), ["bottled-water", "cookies"]);
    assert.equal(store.getState().paymentError, "");
    store.getState().requestReceipt();
    assert.equal(store.getState().screen, "receipt");
    assert.equal(JSON.stringify(first), original, "reset must not mutate the detached old frozen snapshot");
  });
}

test("reset clears rejected cash errors, feedback, and navigation flags", async () => {
  const store = createKioskStore();
  prepare(store, "cash");
  assert.equal(await store.getState().submitPayment("100"), false);
  assert.ok(store.getState().paymentError);
  assert.ok(store.getState().feedback);
  store.getState().resetTransaction();
  assertClean(store);
});

test("old delayed card completion cannot restore a receipt or unlock a new card payment", async () => {
  const store = createKioskStore();
  prepare(store, "card");
  const abandoned = store.getState().submitPayment();
  assert.equal(store.getState().isProcessing, true);
  store.getState().resetTransaction();
  assertClean(store);
  prepare(store, "card", ["chocolate"]);
  const current = store.getState().submitPayment();
  assert.equal(await abandoned, false);
  assert.equal(store.getState().isProcessing, true);
  assert.equal(store.getState().completedTransaction, null);
  assert.equal(await current, true);
  assert.equal(store.getState().completedTransaction!.totalCentavos, 2500);
  assert.deepEqual(store.getState().completedTransaction!.items.map((item) => item.id), ["chocolate"]);
});

test("old payment failure cannot inject an error or release the next payment lock", async (context) => {
  const store = createKioskStore();
  prepare(store, "card");
  const timer = context.mock.method(globalThis, "setTimeout", () => { throw new Error("Simulated timer failure"); });
  const abandoned = store.getState().submitPayment();
  timer.mock.restore();
  store.getState().resetTransaction();
  prepare(store, "qr", ["cookies"]);
  const current = store.getState().submitPayment();
  assert.equal(await abandoned, false);
  assert.equal(store.getState().paymentError, "");
  assert.equal(store.getState().isProcessing, true);
  assert.equal(await current, true);
  assert.equal(store.getState().completedTransaction!.method, "qr");
  assert.equal(store.getState().completedTransaction!.totalCentavos, 2500);
});

test("repeated reset leaves an empty session and preserves usable store actions", () => {
  const store = createKioskStore();
  for (let i = 0; i < 3; i++) store.getState().resetTransaction();
  assertClean(store);
  store.getState().addItem("coffee");
  assert.equal(getTotalCentavos(store.getState().items), 4500);
});

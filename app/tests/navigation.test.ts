import assert from "node:assert/strict";
import test from "node:test";
import { createKioskStore, getOrderLines, getTotalCentavos } from "../src/stores/kiosk-store";

function sampleOrder() {
  const store = createKioskStore();
  store.getState().addItem("coffee");
  store.getState().addItem("coffee");
  store.getState().addItem("sandwich");
  store.getState().addItem("soft-drink");
  return store;
}

test("empty orders cannot enter summary or payment", () => {
  const store = createKioskStore();
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  assert.equal(store.getState().screen, "items");
  assert.deepEqual(store.getState().items, []);
});

test("Back preserves the same cart and summary derives subsequent quantity and removal edits", () => {
  const store = sampleOrder();
  const items = store.getState().items;
  store.getState().reviewOrder();
  assert.equal(store.getState().screen, "summary");
  assert.strictEqual(store.getState().items, items);
  assert.equal(getTotalCentavos(store.getState().items), 17500);
  store.getState().backToItems();
  assert.equal(store.getState().screen, "items");
  assert.strictEqual(store.getState().items, items);
  store.getState().addItem("coffee");
  store.getState().reviewOrder();
  assert.equal(getOrderLines(store.getState().items)[0].quantity, 3);
  assert.equal(getTotalCentavos(store.getState().items), 22000);
  store.getState().backToItems();
  store.getState().decreaseItem("coffee");
  store.getState().removeItem("soft-drink");
  store.getState().reviewOrder();
  assert.equal(getTotalCentavos(store.getState().items), 14000);
  assert.deepEqual(getOrderLines(store.getState().items).map((line) => line.name), ["Coffee", "Sandwich"]);
});

test("payment handoff requires summary and its Back retains the order", () => {
  const store = sampleOrder();
  const items = store.getState().items;
  store.getState().continueToPayment();
  assert.equal(store.getState().screen, "items");
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  store.getState().continueToPayment();
  store.getState().reviewOrder();
  assert.equal(store.getState().screen, "method");
  assert.strictEqual(store.getState().items, items);
  store.getState().backToSummary();
  assert.equal(store.getState().screen, "summary");
  assert.strictEqual(store.getState().items, items);
});

test("removing all items after Back prevents checkout again", () => {
  const store = sampleOrder();
  store.getState().reviewOrder();
  store.getState().backToItems();
  for (const item of [...store.getState().items]) store.getState().removeItem(item.productId);
  store.getState().reviewOrder();
  store.getState().continueToPayment();
  assert.equal(store.getState().screen, "items");
  assert.equal(getTotalCentavos(store.getState().items), 0);
});

test("emptying an order while at checkout returns to Item Selection", () => {
  for (const screen of ["summary", "method"] as const) {
    const store = createKioskStore();
    store.getState().addItem("coffee");
    store.getState().reviewOrder();
    if (screen === "method") store.getState().continueToPayment();
    assert.equal(store.getState().screen, screen);
    store.getState().removeItem("coffee");
    store.getState().continueToPayment();
    assert.equal(store.getState().screen, "items");
    assert.deepEqual(store.getState().items, []);
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../src/data/products";
import { formatMoney } from "../src/lib/money";
import { createKioskStore, getItemCount, getOrderLines, getTotalCentavos } from "../src/stores/kiosk-store";

function sampleOrder() {
  const store = createKioskStore();
  store.getState().addItem("coffee");
  store.getState().addItem("coffee");
  store.getState().addItem("sandwich");
  store.getState().addItem("soft-drink");
  return store;
}

test("the six exam products have the specified prices in centavos", () => {
  assert.deepEqual(products.map((product) => [product.name, product.unitPriceCentavos]), [
    ["Coffee", 4500], ["Sandwich", 5000], ["Soft Drink", 3500],
    ["Cookies", 2500], ["Bottled Water", 2000], ["Chocolate", 2500],
  ]);
});

test("Coffee x2 plus Sandwich and Soft Drink totals PHP175 with correct subtotals", () => {
  const store = sampleOrder();
  assert.deepEqual(getOrderLines(store.getState().items).map((line) => line.subtotalCentavos), [9000, 5000, 3500]);
  assert.equal(getTotalCentavos(store.getState().items), 17500);
  assert.equal(getItemCount(store.getState().items), 4);
  assert.equal(store.getState().items.length, 3);
});

test("increasing then decreasing Coffee changes PHP175 to PHP220 and back", () => {
  const store = sampleOrder();
  store.getState().addItem("coffee");
  assert.equal(getTotalCentavos(store.getState().items), 22000);
  store.getState().decreaseItem("coffee");
  assert.equal(getTotalCentavos(store.getState().items), 17500);
});

test("explicit removal reduces the sample total to PHP140", () => {
  const store = sampleOrder();
  store.getState().removeItem("soft-drink");
  assert.equal(getTotalCentavos(store.getState().items), 14000);
  assert.ok(!store.getState().items.some((item) => item.productId === "soft-drink"));
});

test("minus at one removes the row and repeated minus cannot create negative quantity", () => {
  const store = createKioskStore();
  store.getState().addItem("cookies");
  store.getState().decreaseItem("cookies");
  store.getState().decreaseItem("cookies");
  assert.deepEqual(store.getState().items, []);
  assert.equal(getTotalCentavos(store.getState().items), 0);
});

test("invalid quantities are rejected without changing the cart", () => {
  const store = sampleOrder();
  const before = store.getState().items;
  for (const quantity of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
    store.getState().setQuantity("coffee", quantity);
    assert.deepEqual(store.getState().items, before);
    assert.equal(getTotalCentavos(store.getState().items), 17500);
    assert.notEqual(store.getState().feedback, "");
  }
});

test("rapid repeated product actions produce one row with the full quantity", () => {
  const store = createKioskStore();
  for (let index = 0; index < 20; index++) store.getState().addItem("coffee");
  assert.deepEqual(store.getState().items, [{ productId: "coffee", quantity: 20 }]);
  assert.equal(getTotalCentavos(store.getState().items), 90000);
});

test("separate kiosk instances never share their active order", () => {
  const first = sampleOrder();
  const second = createKioskStore();
  assert.equal(getTotalCentavos(first.getState().items), 17500);
  assert.deepEqual(second.getState().items, []);
});

test("peso formatting shows two decimals and rejects fractional centavos", () => {
  assert.equal(formatMoney(17500), "₱175.00");
  assert.equal(formatMoney(0), "₱0.00");
  assert.throws(() => formatMoney(1.5), RangeError);
});

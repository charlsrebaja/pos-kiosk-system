import { createStore } from "zustand/vanilla";
import { productsById } from "../data/products";
import { paymentMethods } from "../data/payment-methods";
import type { CartItem, KioskScreen, OrderLine, PaymentMethod, ProductId } from "../types/kiosk";

export interface KioskState {
  screen: KioskScreen;
  items: CartItem[];
  feedback: string;
  selectedMethod: PaymentMethod | null;
  paymentHandoffRequested: boolean;
  addItem: (productId: ProductId) => void;
  decreaseItem: (productId: ProductId) => void;
  removeItem: (productId: ProductId) => void;
  setQuantity: (productId: ProductId, quantity: number) => void;
  reviewOrder: () => void;
  backToItems: () => void;
  continueToPayment: () => void;
  backToSummary: () => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  preparePayment: () => void;
}

export function getOrderLines(items: readonly CartItem[]): OrderLine[] {
  return items.map(({ productId, quantity }) => {
    const product = productsById[productId];
    return { ...product, quantity, subtotalCentavos: product.unitPriceCentavos * quantity };
  });
}

export function getTotalCentavos(items: readonly CartItem[]): number {
  return getOrderLines(items).reduce((sum, line) => sum + line.subtotalCentavos, 0);
}

export function getItemCount(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function createKioskStore() {
  return createStore<KioskState>()((set, get) => ({
    screen: "items",
    items: [],
    feedback: "",
    selectedMethod: null,
    paymentHandoffRequested: false,
    reviewOrder: () => {
      if (get().screen === "items" && get().items.length > 0) set({ screen: "summary" });
    },
    backToItems: () => {
      if (get().screen === "summary") set({ screen: "items" });
    },
    continueToPayment: () => {
      if (get().screen === "summary" && get().items.length > 0) set({ screen: "method" });
    },
    backToSummary: () => {
      if (get().screen === "method" && get().items.length > 0) {
        set({ screen: "summary", paymentHandoffRequested: false });
      }
    },
    selectPaymentMethod: (method) => {
      if (get().screen === "method" && get().items.length > 0 && paymentMethods.some((option) => option.id === method)) {
        set({ selectedMethod: method, paymentHandoffRequested: false });
      }
    },
    // Step 4 will consume the selected method and current order from this store.
    preparePayment: () => {
      if (get().screen === "method" && get().items.length > 0 && get().selectedMethod !== null) {
        set({ paymentHandoffRequested: true });
      }
    },
    setQuantity: (productId, quantity) => {
      const product = productsById[productId];
      if (!product || !Number.isSafeInteger(quantity) || quantity < 0) {
        set({ feedback: "Please use a whole, nonnegative quantity." });
        return;
      }

      const remainingItems = get().items.filter((item) => item.productId !== productId);
      const nextTotal = getTotalCentavos(remainingItems) + product.unitPriceCentavos * quantity;
      if (!Number.isSafeInteger(nextTotal)) {
        set({ feedback: "That quantity is too large. Please choose a smaller amount." });
        return;
      }

      const existingItem = get().items.find((item) => item.productId === productId);
      const items = quantity === 0
        ? remainingItems
        : existingItem
          ? get().items.map((item) => item.productId === productId ? { ...item, quantity } : item)
          : [...get().items, { productId, quantity }];

      const feedback = quantity === 0
        ? `${product.name} removed from your order.`
        : !existingItem || quantity > existingItem.quantity
          ? `${product.name} added. Quantity: ${quantity}.`
          : `${product.name} quantity updated to ${quantity}.`;

      set({
        items,
        feedback,
        paymentHandoffRequested: false,
        ...(items.length === 0 ? { screen: "items" as const, selectedMethod: null } : {}),
      });
    },
    addItem: (productId) => {
      const quantity = get().items.find((item) => item.productId === productId)?.quantity ?? 0;
      get().setQuantity(productId, quantity + 1);
    },
    decreaseItem: (productId) => {
      const item = get().items.find((entry) => entry.productId === productId);
      if (item) get().setQuantity(productId, item.quantity - 1);
    },
    removeItem: (productId) => {
      if (get().items.some((item) => item.productId === productId)) {
        get().setQuantity(productId, 0);
      }
    },
  }));
}

export type KioskStore = ReturnType<typeof createKioskStore>;

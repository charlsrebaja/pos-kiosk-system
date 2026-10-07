export type ProductId =
  | "coffee"
  | "sandwich"
  | "soft-drink"
  | "cookies"
  | "bottled-water"
  | "chocolate";

export interface Product {
  readonly id: ProductId;
  readonly name: string;
  readonly description: string;
  readonly unitPriceCentavos: number;
}

export interface CartItem {
  readonly productId: ProductId;
  readonly quantity: number;
}

export type KioskScreen = "items" | "summary" | "method" | "processing" | "success" | "receipt";

export type PaymentMethod = "cash" | "qr" | "card";

export interface OrderLine extends Product {
  readonly quantity: number;
  readonly subtotalCentavos: number;
}

export interface CompletedTransaction {
  readonly reference: string;
  readonly completedAt: string;
  readonly items: readonly OrderLine[];
  readonly totalCentavos: number;
  readonly method: PaymentMethod;
  readonly paidCentavos: number;
  readonly changeCentavos: number;
}

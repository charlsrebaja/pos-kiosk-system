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

export interface OrderLine extends Product {
  readonly quantity: number;
  readonly subtotalCentavos: number;
}

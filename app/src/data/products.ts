import type { Product, ProductId } from "../types/kiosk";

export const products = [
  { id: "coffee", name: "Coffee", description: "Your daily pick-me-up", unitPriceCentavos: 4500 },
  { id: "sandwich", name: "Sandwich", description: "A lunch-break favorite", unitPriceCentavos: 5000 },
  { id: "soft-drink", name: "Soft Drink", description: "A refreshing little fizz", unitPriceCentavos: 3500 },
  { id: "cookies", name: "Cookies", description: "A sweet study companion", unitPriceCentavos: 2500 },
  { id: "bottled-water", name: "Bottled Water", description: "Stay fresh, stay hydrated", unitPriceCentavos: 2000 },
  { id: "chocolate", name: "Chocolate", description: "A moment of sweetness", unitPriceCentavos: 2500 },
] as const satisfies readonly Product[];

export const productsById = Object.fromEntries(
  products.map((product) => [product.id, product]),
) as Record<ProductId, Product>;

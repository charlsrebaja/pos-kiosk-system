import type { PaymentMethod } from "../types/kiosk";

export const paymentMethods = [
  { id: "cash", label: "Cash", description: "Pay with cash" },
  { id: "qr", label: "QR Payment", description: "Pay using a QR code" },
  { id: "card", label: "Credit/Debit Card", description: "Pay using your card" },
] as const satisfies readonly { id: PaymentMethod; label: string; description: string }[];

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return paymentMethods.find((option) => option.id === method)!.label;
}

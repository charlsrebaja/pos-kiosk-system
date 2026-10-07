"use client";

import { ArrowLeft, ArrowRight, Banknote, Check, CreditCard, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPaymentMethodLabel, paymentMethods } from "@/data/payment-methods";
import { formatMoney } from "@/lib/money";
import { getTotalCentavos } from "@/stores/kiosk-store";
import { useKioskStore } from "./kiosk-provider";

const methodIcons = { cash: Banknote, qr: QrCode, card: CreditCard };

export function PaymentMethodSelection() {
  const items = useKioskStore((state) => state.items);
  const selectedMethod = useKioskStore((state) => state.selectedMethod);
  const selectPaymentMethod = useKioskStore((state) => state.selectPaymentMethod);
  const backToSummary = useKioskStore((state) => state.backToSummary);
  const preparePayment = useKioskStore((state) => state.preparePayment);

  return (
    <section aria-labelledby="payment-heading" className="mx-auto max-w-3xl">
      <h1 id="payment-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">How would you like to pay?</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">Choose a payment method for your order.</p>

      <Card className="mt-7 rounded-2xl [--card-spacing:--spacing(6)]">
        <CardContent className="flex items-baseline justify-between gap-3">
          <span className="text-base font-medium">Order total</span>
          <p aria-label="Order total" className="text-3xl font-bold tracking-tight tabular-nums">{formatMoney(getTotalCentavos(items))}</p>
        </CardContent>
      </Card>

      <div role="group" aria-label="Payment methods" className="mt-6 grid gap-3 sm:grid-cols-3">
        {paymentMethods.map((method) => {
          const selected = selectedMethod === method.id;
          const Icon = methodIcons[method.id];

          return (
            <Button
              key={method.id}
              variant="outline"
              aria-label={method.label}
              aria-pressed={selected}
              onClick={() => selectPaymentMethod(method.id)}
              className={`min-h-48 w-full flex-col gap-3 whitespace-normal rounded-2xl border-2 p-5 text-center ${selected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "bg-white"}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary"><Icon aria-hidden="true" className="size-7" /></span>
              <span className="text-lg font-semibold leading-6">{method.label}</span>
              <span className="text-sm font-normal text-muted-foreground">{method.description}</span>
              <span className={`flex items-center gap-1 text-sm font-semibold ${selected ? "text-primary" : "text-muted-foreground"}`}>
                {selected && <Check aria-hidden="true" className="size-4" />}{selected ? "Selected" : "Tap to select"}
              </span>
            </Button>
          );
        })}
      </div>

      <div role="status" aria-live="polite" aria-atomic="true" className="mt-5 min-h-12 text-sm leading-6">
        <p className="font-medium text-primary">{selectedMethod ? `Selected: ${getPaymentMethodLabel(selectedMethod)}` : "Select a payment method to continue."}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={backToSummary} className="min-h-14 rounded-xl text-base font-semibold"><ArrowLeft aria-hidden="true" className="mr-2 size-5" />Back to Order Summary</Button>
        <Button disabled={items.length === 0 || selectedMethod === null} onClick={preparePayment} className="min-h-14 rounded-xl text-base font-semibold">Continue<ArrowRight aria-hidden="true" className="ml-2 size-5" /></Button>
      </div>
    </section>
  );
}

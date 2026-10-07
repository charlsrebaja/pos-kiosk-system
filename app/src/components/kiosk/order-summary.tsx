"use client";

import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";
import { getItemCount, getOrderLines, getTotalCentavos } from "@/stores/kiosk-store";
import { useKioskStore } from "./kiosk-provider";

export function OrderSummary() {
  const items = useKioskStore((state) => state.items);
  const backToItems = useKioskStore((state) => state.backToItems);
  const continueToPayment = useKioskStore((state) => state.continueToPayment);
  const lines = getOrderLines(items);
  const count = getItemCount(items);

  return (
    <section aria-labelledby="summary-heading" className="mx-auto max-w-3xl">
      <h1 id="summary-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Review your order</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">Check your items and quantities before continuing to payment.</p>

      <Card className="mt-7 rounded-2xl [--card-spacing:--spacing(6)]">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-3 text-xl font-semibold"><ShoppingBag aria-hidden="true" className="h-5 w-5 text-primary" />Order summary</h2>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm tabular-nums text-muted-foreground">{count} {count === 1 ? "item" : "items"}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul aria-label="Selected products" className="divide-y divide-border">
            {lines.map((line) => (
              <li key={line.id} className="py-5 first:pt-0">
                <h3 className="text-lg font-semibold">{line.name}</h3>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 text-sm sm:grid-cols-3">
                  <div><dt className="text-muted-foreground">Quantity</dt><dd aria-label={`${line.name} quantity`} className="mt-1 font-semibold tabular-nums">{line.quantity}</dd></div>
                  <div><dt className="text-muted-foreground">Unit price</dt><dd aria-label={`${line.name} unit price`} className="mt-1 tabular-nums">{formatMoney(line.unitPriceCentavos)}</dd></div>
                  <div className="col-span-2 sm:col-span-1 sm:text-right"><dt className="text-muted-foreground">Subtotal</dt><dd aria-label={`${line.name} subtotal`} className="mt-1 font-semibold tabular-nums">{formatMoney(line.subtotalCentavos)}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between gap-3 border-t border-border pt-6">
            <span className="text-base font-medium">Order total</span>
            <p aria-label="Order total" className="text-3xl font-bold tracking-tight tabular-nums">{formatMoney(getTotalCentavos(items))}</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">All prices in Philippine pesos.</p>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={backToItems} className="min-h-14 rounded-xl text-base font-semibold"><ArrowLeft aria-hidden="true" className="mr-2 h-5 w-5" />Back to items</Button>
        <Button disabled={items.length === 0} onClick={continueToPayment} className="min-h-14 rounded-xl text-base font-semibold">Continue to Payment<ArrowRight aria-hidden="true" className="ml-2 h-5 w-5" /></Button>
      </div>
      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">Need to change anything? Go back to edit your order.</p>
    </section>
  );
}

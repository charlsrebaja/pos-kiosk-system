"use client";

import { useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { getItemCount, getOrderLines, getTotalCentavos } from "@/stores/kiosk-store";
import { useKioskStore } from "./kiosk-provider";

export function CartPanel() {
  const items = useKioskStore((state) => state.items);
  const addItem = useKioskStore((state) => state.addItem);
  const decreaseItem = useKioskStore((state) => state.decreaseItem);
  const removeItem = useKioskStore((state) => state.removeItem);
  const [showNextStepMessage, setShowNextStepMessage] = useState(false);
  const lines = getOrderLines(items);
  const count = getItemCount(items);
  const total = getTotalCentavos(items);

  return (
    <aside aria-labelledby="order-heading" className="overflow-hidden rounded-2xl border border-border bg-white lg:sticky lg:top-7">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <ShoppingBag aria-hidden="true" className="h-5 w-5 text-primary" />
          <h2 id="order-heading" className="text-xl font-semibold tracking-tight">Your order</h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium tabular-nums text-muted-foreground">{count} {count === 1 ? "item" : "items"}</span>
      </div>

      {lines.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center px-7 py-12 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f5ef]">
            <ShoppingBag aria-hidden="true" className="h-8 w-8 stroke-[1.4] text-primary/60" />
          </div>
          <h3 className="text-lg font-semibold">A good day starts here</h3>
          <p className="mt-2 max-w-56 text-sm leading-6 text-muted-foreground">Your order is empty. Tap something you like to add it here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border px-6" aria-label="Selected products">
          {lines.map((line) => (
            <li key={line.id} className="py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{line.name}</h3>
                  <p className="mt-1 text-sm tabular-nums text-muted-foreground">{formatMoney(line.unitPriceCentavos)} each</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums" aria-label={`${line.name} subtotal`}>{formatMoney(line.subtotalCentavos)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Subtotal</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 rounded-xl border border-border p-1">
                  <Button variant="ghost" size="icon" aria-label={`Decrease ${line.name} quantity`} className="h-12 w-12 rounded-lg" onClick={() => decreaseItem(line.id)}>
                    <Minus aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <span className="min-w-8 text-center text-base font-semibold tabular-nums" aria-label={`${line.name} quantity`}>{line.quantity}</span>
                  <Button variant="ghost" size="icon" aria-label={`Increase ${line.name} quantity`} className="h-12 w-12 rounded-lg" onClick={() => addItem(line.id)}>
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" aria-label={`Remove ${line.name}`} className="min-h-12 px-3 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-700" onClick={() => removeItem(line.id)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-border bg-[#fafbf8] px-6 py-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-base font-medium text-muted-foreground">Order total</span>
          <p aria-label="Order total" className="text-3xl font-bold tracking-tight tabular-nums">{formatMoney(total)}</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">All prices in Philippine pesos.</p>
        <Button disabled={items.length === 0} onClick={() => setShowNextStepMessage(true)} className="mt-6 min-h-14 w-full rounded-xl text-base font-semibold shadow-none">
          Continue <ArrowRight aria-hidden="true" className="ml-2 h-5 w-5" />
        </Button>
        <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">Next: review your order · available in Step 2</p>
        {showNextStepMessage && items.length > 0 && (
          <p role="status" className="mt-3 rounded-lg border border-primary/15 bg-primary/5 p-3 text-sm leading-5 text-primary">
            Order Summary will be available in Step 2. Your selected items stay here for now.
          </p>
        )}
      </div>
    </aside>
  );
}

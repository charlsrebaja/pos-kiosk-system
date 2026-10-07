"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPaymentMethodLabel } from "@/data/payment-methods";
import { formatMoney } from "@/lib/money";
import { formatCompletionTime } from "@/lib/transaction-time";
import { useKioskStore } from "./kiosk-provider";

export function ReceiptView() {
  const transaction = useKioskStore((state) => state.completedTransaction);
  const screen = useKioskStore((state) => state.screen);
  const busy = useKioskStore((state) => state.isProcessing);
  const back = useKioskStore((state) => state.backToSuccess);
  const [newTransactionRequested, setNewTransactionRequested] = useState(false);

  if (screen !== "receipt" || busy || !transaction) return null;

  return (
    <section aria-labelledby="receipt-heading" className="mx-auto w-full max-w-2xl">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Receipt aria-hidden="true" className="size-7" />
        </div>
        <h1 id="receipt-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Your receipt</h1>
        <p className="mt-3 text-muted-foreground">Thanks for stopping by Campus Corner.</p>
      </div>

      <Card className="gap-0 overflow-hidden rounded-2xl py-0 shadow-none">
        <CardContent className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Campus Corner</p>
              <h2 className="mt-1 text-lg font-semibold">Digital receipt</h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
              <CircleCheck aria-hidden="true" className="size-4" />Payment successful
            </span>
          </div>

          <dl className="space-y-4 py-5">
            <div>
              <dt className="text-sm text-muted-foreground">Transaction reference</dt>
              <dd aria-label="Receipt transaction reference" className="mt-1 break-all font-mono text-sm font-semibold leading-6">{transaction.reference}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Completed at</dt>
              <dd aria-label="Receipt completed at" className="mt-1 font-medium">
                <time dateTime={transaction.completedAt}>{formatCompletionTime(transaction.completedAt)}</time>
              </dd>
              <dd className="mt-1 text-xs text-muted-foreground">Asia/Manila · UTC+08:00</dd>
            </div>
          </dl>

          <div className="border-y border-dashed border-border py-5">
            <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-hidden="true">
              <span>Purchased items</span><span>Subtotal</span>
            </div>
            <ul aria-label="Receipt purchased items" className="space-y-5">
              {transaction.items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                      <span aria-label={`${item.name} receipt quantity`}>{item.quantity}</span>
                      {" × "}<span aria-label={`${item.name} receipt unit price`}>{formatMoney(item.unitPriceCentavos)}</span>{" each"}
                    </p>
                  </div>
                  <p aria-label={`${item.name} receipt subtotal`} className="shrink-0 font-semibold tabular-nums">{formatMoney(item.subtotalCentavos)}</p>
                </li>
              ))}
            </ul>
          </div>

          <dl className="space-y-4 pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <dt className="text-lg font-semibold">Total</dt>
              <dd aria-label="Receipt total" className="text-3xl font-bold tracking-tight tabular-nums">{formatMoney(transaction.totalCentavos)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Payment method</dt>
              <dd aria-label="Receipt payment method" className="font-semibold">{getPaymentMethodLabel(transaction.method)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Amount paid</dt>
              <dd aria-label="Receipt amount paid" className="font-semibold tabular-nums">{formatMoney(transaction.paidCentavos)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Change</dt>
              <dd aria-label="Receipt change" className="font-semibold tabular-nums">{formatMoney(transaction.changeCentavos)}</dd>
            </div>
          </dl>
          <p className="mt-6 border-t border-dashed border-border pt-4 text-center text-xs leading-5 text-muted-foreground">All amounts are in Philippine pesos. This transaction used simulated payment.</p>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={back} className="min-h-14 flex-1 rounded-xl text-base">
          <ArrowLeft aria-hidden="true" className="mr-2 size-4" />Back to confirmation
        </Button>
        <Button onClick={() => setNewTransactionRequested(true)} className="min-h-14 flex-1 rounded-xl text-base font-semibold">
          New Transaction<ArrowRight aria-hidden="true" className="ml-2 size-4" />
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">New Transaction reset will be available in Step 7.</p>
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-3 min-h-6">
        {newTransactionRequested && <p className="rounded-xl border border-border bg-white p-4 text-sm leading-6 text-muted-foreground">New Transaction will start a fresh order in Step 7. Your completed receipt stays available here for now.</p>}
      </div>
    </section>
  );
}

"use client";

import { ArrowLeft, ArrowRight, CircleCheck, Printer, Receipt } from "lucide-react";
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
  const reset = useKioskStore((state) => state.resetTransaction);

  if (screen !== "receipt" || busy || !transaction) return null;

  return (
    <section aria-labelledby="receipt-heading" className="receipt-view mx-auto w-full max-w-5xl">
      <div className="print-hidden mb-7">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700"><CircleCheck aria-hidden="true" className="size-4" />Payment complete</p>
        <h1 id="receipt-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Your receipt</h1>
        <p className="mt-3 text-muted-foreground">Thanks for stopping by Campus Corner.</p>
      </div>

      <div className="receipt-layout grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="receipt-paper gap-0 overflow-hidden rounded-2xl py-0">
        <CardContent className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border pb-5">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"><Receipt aria-hidden="true" className="size-4" />Campus Corner</p>
              <h2 className="mt-1 text-lg font-semibold">Digital receipt</h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
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

      <aside aria-labelledby="receipt-info-heading" className="print-hidden rounded-2xl border border-border bg-white p-5 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.18)] lg:sticky lg:top-20 sm:p-6">
        <h2 id="receipt-info-heading" className="text-lg font-semibold tracking-tight">Transaction information</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Keep a copy of your receipt, or start a fresh order.</p>
        <dl className="my-6 space-y-4 border-y border-border py-5 text-sm">
          <div><dt className="text-muted-foreground">Reference</dt><dd aria-label="Transaction information reference" className="mt-1 break-all font-mono text-xs font-semibold leading-5">{transaction.reference}</dd></div>
          <div><dt className="text-muted-foreground">Completed at · Asia/Manila</dt><dd className="mt-1 font-medium"><time dateTime={transaction.completedAt}>{formatCompletionTime(transaction.completedAt)}</time></dd></div>
          <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">Payment method</dt><dd className="font-semibold">{getPaymentMethodLabel(transaction.method)}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Amount paid</dt><dd className="font-semibold tabular-nums">{formatMoney(transaction.paidCentavos)}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Change</dt><dd className="font-semibold tabular-nums">{formatMoney(transaction.changeCentavos)}</dd></div>
        </dl>
        <div className="flex flex-col gap-3">
          <Button variant="outline" onClick={() => window.print()} className="min-h-14 w-full rounded-xl border-blue-200 text-base font-semibold text-primary"><Printer aria-hidden="true" className="mr-2 size-4" />Print Receipt</Button>
          <Button onClick={reset} className="min-h-14 w-full rounded-xl text-base font-semibold">New Transaction<ArrowRight aria-hidden="true" className="ml-2 size-4" /></Button>
          <Button variant="ghost" onClick={back} className="min-h-12 w-full rounded-xl text-sm text-muted-foreground"><ArrowLeft aria-hidden="true" className="mr-2 size-4" />Back to confirmation</Button>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">New Transaction clears this receipt and returns to the menu.</p>
      </aside>
      </div>
    </section>
  );
}

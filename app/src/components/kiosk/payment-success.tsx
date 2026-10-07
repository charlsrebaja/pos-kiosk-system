"use client";

import { CircleCheck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPaymentMethodLabel } from "@/data/payment-methods";
import { formatMoney } from "@/lib/money";
import { useKioskStore } from "./kiosk-provider";

const completionFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium", timeStyle: "short",
});

export function PaymentSuccess() {
  const transaction = useKioskStore((state) => state.completedTransaction);
  const screen = useKioskStore((state) => state.screen);
  const busy = useKioskStore((state) => state.isProcessing);
  const handoffRequested = useKioskStore((state) => state.receiptHandoffRequested);
  const requestReceipt = useKioskStore((state) => state.requestReceipt);

  // The payment event is the sole entry into success; also guard the display.
  if (screen !== "success" || busy || !transaction) return null;

  return (
    <section aria-labelledby="success-heading" className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CircleCheck aria-hidden="true" className="size-11" />
        </div>
        <h1 id="success-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Payment successful!</h1>
        <p className="mt-3 text-muted-foreground">Thank you. Your simulated payment is complete.</p>
      </div>

      <Card className="my-7 rounded-2xl [--card-spacing:--spacing(6)]">
        <CardContent>
          <dl className="space-y-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <dt className="font-medium">Transaction amount</dt>
              <dd aria-label="Transaction amount" className="text-3xl font-bold tabular-nums">{formatMoney(transaction.totalCentavos)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-5">
              <dt className="text-muted-foreground">Amount paid</dt>
              <dd aria-label="Amount paid" className="text-lg font-semibold tabular-nums">{formatMoney(transaction.paidCentavos)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Change</dt>
              <dd aria-label="Change" className="text-lg font-semibold tabular-nums">{formatMoney(transaction.changeCentavos)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Payment method</dt>
              <dd aria-label="Payment method" className="font-semibold">{getPaymentMethodLabel(transaction.method)}</dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="text-muted-foreground">Transaction reference</dt>
              <dd aria-label="Transaction reference" className="mt-2 break-all font-mono text-base font-semibold">{transaction.reference}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Completed at</dt>
              <dd className="mt-2 font-medium"><time dateTime={transaction.completedAt}>{completionFormatter.format(new Date(transaction.completedAt))}</time></dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Button onClick={requestReceipt} className="min-h-16 w-full rounded-xl text-lg font-semibold">
        <Receipt aria-hidden="true" className="mr-2 size-5" />View Receipt
      </Button>
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-4 min-h-6 text-sm leading-6 text-muted-foreground">
        {handoffRequested && <p className="rounded-xl border border-border bg-white p-4">Your receipt is ready for the next step. Receipt viewing will be available in Step 6.</p>}
      </div>
    </section>
  );
}

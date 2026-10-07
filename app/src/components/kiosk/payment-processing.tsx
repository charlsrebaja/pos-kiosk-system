"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createCashPaymentSchema } from "@/lib/payment-schema";
import { formatMoney } from "@/lib/money";
import { getPaymentMethodLabel } from "@/data/payment-methods";
import { getTotalCentavos } from "@/stores/kiosk-store";
import { useKioskStore } from "./kiosk-provider";

export function PaymentProcessing() {
  const items = useKioskStore((state) => state.items);
  const method = useKioskStore((state) => state.selectedMethod);
  const busy = useKioskStore((state) => state.isProcessing);
  const paymentError = useKioskStore((state) => state.paymentError);
  const submitPayment = useKioskStore((state) => state.submitPayment);
  const back = useKioskStore((state) => state.backToMethods);
  const schema = createCashPaymentSchema(getTotalCentavos(items));
  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema), defaultValues: { amountPaid: "" },
  });
  // Covers async resolver work before the store's synchronous processing lock.
  const submitting = useRef(false);
  const locked = busy || form.formState.isSubmitting;
  const error = form.formState.errors.amountPaid?.message || paymentError;

  return (
    <section aria-labelledby="processing-heading" className="mx-auto max-w-2xl">
      <h1 id="processing-heading" className="text-3xl font-bold">{method ? getPaymentMethodLabel(method) : "Payment"}</h1>
      <p className="mt-3 text-muted-foreground">Demo payment only. No money is transferred.</p>
      <Card className="my-7 rounded-2xl">
        <CardContent className="flex items-center justify-between gap-4">
          <span className="font-medium">Total due</span>
          <strong className="text-3xl tabular-nums">{formatMoney(getTotalCentavos(items))}</strong>
        </CardContent>
      </Card>
      {method === "cash" && (
        <form noValidate onSubmit={(event) => {
          event.preventDefault();
          if (submitting.current) return;
          submitting.current = true;
          void form.handleSubmit(async () => {
            // Store revalidates the raw string against the confirmed current total.
            await submitPayment(form.getValues("amountPaid"));
          })(event).finally(() => { submitting.current = false; });
        }}>
          <label htmlFor="amount-paid" className="block text-lg font-semibold">Amount paid (PHP)</label>
          <input id="amount-paid" type="text" inputMode="decimal" autoComplete="off"
            disabled={locked} aria-invalid={Boolean(error)} aria-describedby="cash-help cash-error"
            {...form.register("amountPaid")}
            className="mt-3 min-h-14 w-full rounded-xl border border-border bg-white px-4 text-xl focus-visible:outline-2 focus-visible:outline-primary" />
          <p id="cash-help" className="mt-2 text-sm text-muted-foreground">Enter pesos with up to two decimal places, such as 200.00.</p>
          <p id="cash-error" role="alert" className="mt-3 min-h-6 font-medium text-destructive">{error}</p>
          <Button type="submit" disabled={locked} className="mt-4 min-h-14 w-full rounded-xl text-lg">{locked ? "Processing payment…" : "Pay Now"}</Button>
        </form>
      )}
      {method === "qr" && (
        <div className="space-y-5">
          <div role="img" aria-label="Demo QR placeholder — not a scannable payment code" className="mx-auto flex w-56 flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-white p-6">
            <QrCode aria-hidden="true" className="size-24" /><span className="text-center font-semibold">Demo QR placeholder</span>
          </div>
          <p>Simulate scanning the demo QR with your phone, then select Confirm Payment. This placeholder cannot accept payments.</p>
          <Button disabled={locked} onClick={() => void submitPayment()} className="min-h-14 w-full rounded-xl text-lg">{busy ? "Confirming payment…" : "Confirm Payment"}</Button>
        </div>
      )}
      {method === "card" && (
        <div className="space-y-5">
          <p className="text-lg">Simulate tapping, inserting, or swiping your card at the terminal, then select Process Payment. No card details are needed.</p>
          <Button disabled={locked} onClick={() => void submitPayment()} className="min-h-14 w-full rounded-xl text-lg">{busy ? "Processing card…" : "Process Payment"}</Button>
        </div>
      )}
      <p role="status" aria-live="polite" className="mt-4 min-h-6 font-medium text-primary">{busy ? "Processing simulated payment. Please wait…" : ""}</p>
      {method !== "cash" && paymentError && <p role="alert" className="text-destructive">{paymentError}</p>}
      <Button variant="outline" disabled={locked} onClick={back} className="mt-5 min-h-14 w-full rounded-xl text-base">Back to Payment Methods</Button>
    </section>
  );
}

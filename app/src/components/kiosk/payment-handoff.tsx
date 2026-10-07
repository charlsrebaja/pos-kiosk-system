"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useKioskStore } from "./kiosk-provider";

// Step 3 will replace this boundary with payment-method selection.
export function PaymentHandoff() {
  const backToSummary = useKioskStore((state) => state.backToSummary);

  return (
    <section aria-labelledby="payment-heading" className="mx-auto max-w-3xl">
      <h1 id="payment-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Payment is coming next</h1>
      <Card className="mt-7 rounded-2xl [--card-spacing:--spacing(6)]">
        <CardContent>
          <p className="text-base leading-7">Payment selection will be available in Step 3. Your order is kept while you return to the summary or edit your items.</p>
          <p className="mt-3 text-sm text-muted-foreground">No payment has been taken.</p>
        </CardContent>
      </Card>
      <Button variant="outline" onClick={backToSummary} className="mt-6 min-h-14 w-full rounded-xl text-base font-semibold sm:w-auto sm:px-8"><ArrowLeft aria-hidden="true" className="mr-2 h-5 w-5" />Back to summary</Button>
    </section>
  );
}

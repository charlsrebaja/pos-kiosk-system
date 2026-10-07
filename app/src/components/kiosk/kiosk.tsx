"use client";

import { useEffect, useRef } from "react";
import { Check, GraduationCap, Hand, Leaf } from "lucide-react";
import { products } from "@/data/products";
import { CartPanel } from "./cart-panel";
import { ProductCard } from "./product-card";
import { OrderSummary } from "./order-summary";
import { PaymentMethodSelection } from "./payment-method";
import { PaymentProcessing } from "./payment-processing";
import { PaymentSuccess } from "./payment-success";
import { KioskProvider, useKioskStore } from "./kiosk-provider";

function KioskScreens() {
  const screen = useKioskStore((state) => state.screen);
  const mainRef = useRef<HTMLElement>(null);
  const previousScreen = useRef(screen);
  const step = screen === "items"
    ? { number: "01", label: "Item selection" }
    : screen === "summary"
      ? { number: "02", label: "Order / Payment Summary" }
      : screen === "method"
        ? { number: "03", label: "Payment method" }
        : screen === "processing"
          ? { number: "04", label: "Payment processing" }
          : { number: "05", label: "Payment successful" };

  useEffect(() => {
    if (previousScreen.current !== screen) {
      mainRef.current?.focus();
      window.scrollTo(0, 0);
      previousScreen.current = screen;
    }
  }, [screen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white"><GraduationCap aria-hidden="true" className="h-6 w-6" /></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.19em] text-primary">Campus</p><p className="text-xl font-bold leading-6 tracking-tight">Corner<span className="text-primary">.</span></p></div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />Self-service kiosk
          </div>
        </div>
      </header>

      <main ref={mainRef} tabIndex={-1} aria-label={step.label} className="mx-auto max-w-7xl outline-none px-5 pb-8 pt-8 sm:px-8 sm:pt-10">
        <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] text-white">{step.number}</span>
          {step.label} <span className="ml-1 h-px w-12 bg-border" />
        </div>
        {screen === "items" && <ItemSelection />}
        {screen === "summary" && <OrderSummary />}
        {screen === "method" && <PaymentMethodSelection />}
        {screen === "processing" && <PaymentProcessing />}
        {screen === "success" && <PaymentSuccess />}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5"><Leaf aria-hidden="true" className="h-3.5 w-3.5 text-primary" />Small bites. Big campus energy.</p>
          <p>Campus Corner · {step.label}</p>
        </footer>
      </main>
    </div>
  );
}

function ItemSelection() {
  const feedback = useKioskStore((state) => state.feedback);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_370px] xl:gap-10">
      <section aria-labelledby="menu-heading">
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-primary">A little fuel for your day</p>
          <h1 id="menu-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">What sounds good?</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">Tap to add your favorites. We’ll take care of the totals.</p>
        </div>
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
          <h2 className="text-sm font-semibold">On the menu <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-muted-foreground">6</span></h2>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Hand aria-hidden="true" className="h-3.5 w-3.5" /> Tap a card to add</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-5 flex min-h-12 items-center gap-2 text-sm font-medium text-primary">
          {feedback && <><Check aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{feedback}</span></>}
        </div>
      </section>
      <CartPanel />
    </div>
  );
}

export function Kiosk() {
  return <KioskProvider><KioskScreens /></KioskProvider>;
}

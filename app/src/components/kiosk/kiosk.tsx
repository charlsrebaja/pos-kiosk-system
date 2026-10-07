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
import { ReceiptView } from "./receipt";
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
          : screen === "success"
            ? { number: "05", label: "Payment successful" }
            : { number: "06", label: "Receipt" };

  useEffect(() => {
    if (previousScreen.current !== screen) {
      mainRef.current?.focus();
      window.scrollTo(0, 0);
      previousScreen.current = screen;
    }
  }, [screen]);

  return (
    <div className="kiosk-shell min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-blue-600/20"><GraduationCap aria-hidden="true" className="size-5" /></div>
            <div><p className="text-base font-bold leading-5 tracking-tight">Campus<span className="text-primary"> Corner.</span></p><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Your campus. Your corner.</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700 sm:px-3 sm:text-xs">
            <span className="size-1.5 rounded-full bg-primary" /><span className="hidden min-[360px]:inline">Self-service </span>kiosk
          </div>
        </div>
      </header>

      <main ref={mainRef} tabIndex={-1} aria-label={step.label} className="mx-auto max-w-7xl scroll-mt-20 outline-none px-4 pb-8 pt-6 sm:px-8 sm:pt-8">
        <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span className="flex size-8 items-center justify-center rounded-lg border border-blue-100 bg-white text-xs font-bold text-primary shadow-sm">{step.number}</span>
          {step.label} <span className="ml-1 h-px flex-1 bg-border" />
        </div>
        {screen === "items" && <ItemSelection />}
        {screen === "summary" && <OrderSummary />}
        {screen === "method" && <PaymentMethodSelection />}
        {screen === "processing" && <PaymentProcessing />}
        {screen === "success" && <PaymentSuccess />}
        {screen === "receipt" && <ReceiptView />}
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
    <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-9">
      <section aria-labelledby="menu-heading">
        <div className="mb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Fresh picks. Campus favorites.</p>
          <h1 id="menu-heading" className="text-3xl font-bold tracking-tight sm:text-[40px] sm:leading-tight">What sounds good?</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">Tap to add your favorites. We’ll take care of the totals.</p>
        </div>
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
          <h2 className="text-sm font-semibold">On the menu <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-muted-foreground">6</span></h2>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Hand aria-hidden="true" className="h-3.5 w-3.5" /> Tap a card to add</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-5 flex min-h-12 items-center gap-2 text-sm font-medium text-emerald-700">
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

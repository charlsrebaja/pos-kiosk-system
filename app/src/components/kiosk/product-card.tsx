"use client";

import { Candy, Coffee, Cookie, CupSoda, Droplets, Plus, Sandwich } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";
import type { Product, ProductId } from "@/types/kiosk";
import { useKioskStore } from "./kiosk-provider";

const appearance = {
  coffee: { icon: Coffee, color: "bg-[#f3e8db] text-[#886340]" },
  sandwich: { icon: Sandwich, color: "bg-[#f3eccd] text-[#967b36]" },
  "soft-drink": { icon: CupSoda, color: "bg-[#e1ebfa] text-[#5f7db0]" },
  cookies: { icon: Cookie, color: "bg-[#f7e4d7] text-[#b97745]" },
  "bottled-water": { icon: Droplets, color: "bg-[#ddf0ec] text-[#468b85]" },
  chocolate: { icon: Candy, color: "bg-[#eae3f3] text-[#877199]" },
} satisfies Record<ProductId, { icon: typeof Coffee; color: string }>;

export function ProductCard({ product }: { product: Product }) {
  const addItem = useKioskStore((state) => state.addItem);
  const quantity = useKioskStore((state) => state.items.find((item) => item.productId === product.id)?.quantity ?? 0);
  const { icon: Icon, color } = appearance[product.id];

  return (
    <button
      type="button"
      onClick={() => addItem(product.id)}
      aria-label={`Add ${product.name}, ${formatMoney(product.unitPriceCentavos)}`}
      className="group h-full cursor-pointer rounded-2xl text-left outline-none transition-transform active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
    >
      <Card className="relative h-full gap-0 overflow-hidden rounded-2xl border-border bg-white p-4 shadow-none transition-colors group-hover:border-primary/40 group-focus-visible:border-primary sm:p-5">
        <div className={`relative flex h-32 items-center justify-center rounded-xl sm:h-36 ${color}`}>
          <Icon aria-hidden="true" className="h-16 w-16 stroke-[1.25] transition-transform group-hover:scale-105" />
          {quantity > 0 && (
            <span className="absolute right-2.5 top-2.5 flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2 text-sm font-semibold text-white" aria-label={`${quantity} in your order`}>
              {quantity}
            </span>
          )}
        </div>
        <div className="pt-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{product.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{product.description}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-lg font-bold tabular-nums text-foreground">{formatMoney(product.unitPriceCentavos)}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Plus aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>
        </div>
      </Card>
    </button>
  );
}

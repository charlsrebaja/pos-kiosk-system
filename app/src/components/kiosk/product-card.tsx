"use client";

import { Candy, Coffee, Cookie, CupSoda, Droplets, Plus, Sandwich } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { productImages } from "@/data/product-images";
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
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => addItem(product.id)}
      aria-label={`Add ${product.name}, ${formatMoney(product.unitPriceCentavos)}`}
      className="group h-full min-w-0 scroll-mt-20 cursor-pointer rounded-2xl text-left outline-none transition-transform active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
    >
      <Card className={`relative h-full gap-0 overflow-hidden rounded-2xl bg-white p-0 transition-colors group-hover:ring-primary/40 ${quantity > 0 ? "ring-2 ring-primary/50" : "ring-1 ring-border"}`}>
        <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden ${color}`}>
          {imageFailed ? <Icon aria-hidden="true" className="size-14 stroke-[1.25]" /> : (
            <Image src={productImages[product.id]} alt={product.name} fill placeholder="blur"
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 260px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageFailed(true)} />
          )}
          {quantity > 0 && (
            <span className="absolute right-2.5 top-2.5 flex h-8 min-w-8 items-center justify-center rounded-full border border-white/30 bg-primary px-2 text-sm font-semibold text-white shadow-sm" aria-label={`${quantity} in your order`}>
              {quantity}
            </span>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">{product.name}</h3>
          <p className="mt-1 min-h-8 text-xs leading-4 text-muted-foreground">{product.description}</p>
          <div className="mt-3 flex items-center justify-between gap-1">
            <span className="text-base font-bold tabular-nums text-foreground sm:text-lg">{formatMoney(product.unitPriceCentavos)}</span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary sm:size-10" aria-hidden="true">
              <Plus className="size-4" />
            </span>
          </div>
        </div>
      </Card>
    </button>
  );
}

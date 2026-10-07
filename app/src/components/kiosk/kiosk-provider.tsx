"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createKioskStore, type KioskState, type KioskStore } from "@/stores/kiosk-store";

const KioskContext = createContext<KioskStore | null>(null);

export function KioskProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createKioskStore);
  return <KioskContext.Provider value={store}>{children}</KioskContext.Provider>;
}

export function useKioskStore<T>(selector: (state: KioskState) => T): T {
  const store = useContext(KioskContext);
  if (!store) throw new Error("Kiosk components must be inside KioskProvider.");
  return useStore(store, selector);
}

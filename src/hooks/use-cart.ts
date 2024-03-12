"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// TYPES
import type { CartStoreType } from "@/lib/schema";

export const useCart = create<CartStoreType>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, product] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

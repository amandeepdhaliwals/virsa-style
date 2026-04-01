"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  slug: string;
  wantStitching?: boolean;
  stitchingPrice?: number;
  customizations?: string;
  measurements?: string;
  designReference?: string;
}

interface CartStore {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      addItem: (item) => {
        const items = get().items;
        if (item.wantStitching) {
          set({ items: [...items, item] });
          return;
        }
        const existing = items.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color && !i.wantStitching
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id && i.size === item.size && i.color === item.color && !i.wantStitching
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id, size, color) => {
        const items = get().items;
        const idx = items.findIndex(
          (i) => i.id === id && i.size === size && i.color === color
        );
        if (idx >= 0) {
          set({ items: [...items.slice(0, idx), ...items.slice(idx + 1)] });
        }
      },
      updateQuantity: (id, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color);
          return;
        }
        const items = get().items;
        let found = false;
        set({
          items: items.map((i) => {
            if (!found && i.id === id && i.size === size && i.color === color) {
              found = true;
              return { ...i, quantity };
            }
            return i;
          }),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      totalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: "virsa-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

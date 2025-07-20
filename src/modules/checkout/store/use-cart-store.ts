import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TenantCart {
  productIds: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;

  addProduct: (slug: string, id: string) => void;
  removeProduct: (slug: string, id: string) => void;
  clearCart: (slug: string) => void;
  clearAllCarts: () => void;
  // getCartProductCount: (slug: string) => number;
  // hasProduct: (slug: string, id: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      // state
      tenantCarts: {},

      // actions
      addProduct: (slug, id) =>
        set((state) => {
          const listIds = state.tenantCarts[slug]?.productIds || [];
          // Prevent duplicate products
          if (!listIds.includes(id)) {
            (state.tenantCarts[slug] ??= { productIds: [] }).productIds.push(
              id
            );
          }
          // if (listIds.includes(id)) {
          //   return state;
          // }
          // return {
          //   tenantCarts: {
          //     ...state.tenantCarts,
          //     [slug]: {
          //       productIds: [...listIds, id],
          //     },
          //   },
          // };
        }),

      removeProduct: (slug, id) =>
        set((state) => {
          const existingCart = state.tenantCarts[slug];
          if (!existingCart) return state;

          return {
            tenantCarts: {
              ...state.tenantCarts,
              [slug]: {
                productIds: existingCart.productIds.filter(
                  (pId: string) => pId !== id
                ),
              },
            },
          };
        }),

      clearCart: (slug) =>
        set((state) => {
          // Remove the cart entirely if it exists
          if (!state.tenantCarts[slug]) return state;
          const remainingCarts = { ...state.tenantCarts };
          delete remainingCarts[slug];
          return { tenantCarts: remainingCarts };
        }),

      clearAllCarts: () => set({ tenantCarts: {} }),
      // getCartProductCount: (slug) =>
      //   get().tenantCarts[slug]?.productIds.length ?? 0,

      // hasProduct: (slug, id) =>
      //   get().tenantCarts[slug]?.productIds.includes(id) ?? false,
    })),
    {
      name: "funroad-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { useCallback, useMemo } from "react";
import { useCartStore } from "../store/use-cart-store";

import { useShallow } from "zustand/react/shallow";

export default function useCart(tenantSlug: string) {
  // const { addProduct, removeProduct, clearCart, clearAllCarts, productIds } =
  //   useCartStore(
  //     useShallow((state) => ({
  //       addProduct: state.addProduct,
  //       removeProduct: state.removeProduct,
  //       clearCart: state.clearCart,
  //       clearAllCarts: state.clearAllCarts,
  //       productIds: state.tenantCarts[tenantSlug]?.productIds || [],
  //     }))
  //   );
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || [])
  );

  // Memoize the total count for better performance
  const totalItems = useMemo(() => productIds.length, [productIds]);

  // Optimized callbacks with proper dependencies
  const addToCart = useCallback(
    (productId: string) => addProduct(tenantSlug, productId),
    [addProduct, tenantSlug]
  );

  const removeFromCart = useCallback(
    (productId: string) => removeProduct(tenantSlug, productId),
    [removeProduct, tenantSlug]
  );

  const clearTenantCart = useCallback(
    () => clearCart(tenantSlug),
    [clearCart, tenantSlug]
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        addProduct(tenantSlug, productId);
      }
    },
    [addProduct, removeProduct, productIds, tenantSlug]
  );

  const isProductInCart = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  // Additional utility methods
  const isEmpty = useMemo(() => totalItems === 0, [totalItems]);

  // const getProductQuantity = useCallback(
  //   (productId: string) => {
  //     // Count occurrences of the product (useful if you later support quantities)
  //     return productIds.filter((id) => id === productId).length;
  //   },
  //   [productIds]
  // );

  return {
    // Data
    productIds,
    totalItems,
    isEmpty,

    // Actions
    addToCart,
    removeFromCart,
    clearTenantCart,
    toggleProduct,
    clearAllCarts,

    // Queries
    isProductInCart,
    // getProductQuantity,
  };
}

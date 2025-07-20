import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useCart from "@/modules/checkout/hooks/use-cart";
import React from "react";

type CartButtonProps = {
  tenantSlug: string;
  productId: string;
  // isPurchased?: boolean;
};

export function CartButton({
  tenantSlug,
  productId,
  // isPurchased,
}: CartButtonProps) {
  const cart = useCart(tenantSlug);

  return (
    <Button
      variant={"elevated"} // Styled as an elevated button
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white"
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
}

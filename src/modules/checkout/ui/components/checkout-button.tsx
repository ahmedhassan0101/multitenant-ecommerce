import React from "react";
import useCart from "../../hooks/use-cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { generateTenantURL } from "@/lib/utils";

type CheckoutButtonProps = {
  hideIfEmpty?: boolean;
  tenantSlug: string;
};

export function CheckoutButton({
  hideIfEmpty = true,
  tenantSlug,
}: CheckoutButtonProps) {
  const { totalItems } = useCart(tenantSlug);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button variant={"elevated"} asChild className="bg-white">
      <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
        <ShoppingCartIcon />
        {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
}

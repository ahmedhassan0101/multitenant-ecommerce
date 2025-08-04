/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCart from "../../hooks/use-cart";
import { useTRPC } from "@/trpc/client";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { generateTenantURL } from "@/lib/utils";
import CheckoutSidebar from "../components/checkout-sidebar";
import CheckoutItem from "../components/checkout-item";
import { useEffect } from "react";
import { toast } from "sonner";
import { useCheckoutState } from "../../hooks/use-checkout-state";
import { useRouter } from "next/navigation";
import { useCheckoutLogic } from "../../hooks/useCheckoutLogic";

type CheckoutViewProps = { tenantSlug: string };

export default function CheckoutView({ tenantSlug }: CheckoutViewProps) {
  const {
    data,
    isLoading,
    isPending,
    purchaseHandler,
    states,
    removeFromCart,
  } = useCheckoutLogic(tenantSlug);

  if (isLoading) return <LoadingComponent />;
  if (data?.totalDocs === 0) return <EmptyComponent />;

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeFromCart(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={purchaseHandler}
            isCanceled={states.cancel}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
}

const LoadingComponent = () => (
  <div className="lg:pt-16 pt-4 px-4 lg:px-12">
    <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
      <LoaderIcon className="text-muted-foreground animate-spin" />
    </div>
  </div>
);
const EmptyComponent = () => (
  <div className="lg:pt-16 pt-4 px-4 lg:px-12">
    <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
      <InboxIcon />
      <p className="text-base font-medium">No products found</p>
    </div>
  </div>
);

// TODO -------------------------------

// zustand hook
// ------------
// removeMultipleProducts: (slug, ids) =>
//   set((state) => {
//     const cart = state.tenantCarts[slug];
//     if (!cart) return state;

//     return {
//       tenantCarts: {
//         ...state.tenantCarts,
//         [slug]: {
//           productIds: cart.productIds.filter((id) => !ids.includes(id)),
//         },
//       },
//     };
//   }),

// TODO -------------------------------
// CheckoutView component
// ----------------------
// const { removeMultipleProducts } = useCart(tenantSlug);

// useEffect(() => {
//   if (data?.missingIds?.length) {
//     removeMultipleProducts(data.missingIds);
//     toast.warning("Some products were removed from your cart.");
//   }
// }, [data]);

//NOTE - Current version
//  useEffect(() => {
//     if (data?.missingIds?.length) {
//       data.missingIds.forEach((id) => removeFromCart(id));
//       toast.warning("Some products were removed from your cart.");
//     }
//   }, [data, removeFromCart]);

// -----------------------------------------
// const router = useRouter();

// const { productIds, removeFromCart, clearTenantCart } = useCart(tenantSlug);

// const [states, setStates] = useCheckoutState();

// const trpc = useTRPC();

// const queryClient = useQueryClient();

// const { data, error, isLoading } = useQuery(
//   trpc.checkout.getProducts.queryOptions({ ids: productIds })
// );

// const { mutate, isPending } = useMutation(
//   trpc.checkout.purchase.mutationOptions({
//     onMutate: () => {
//       setStates({ success: false, cancel: false });
//     },
//     onSuccess: (data) => {
//       window.location.href = data.url;
//     },
//     onError: (error) => {
//       if (error.data?.code === "UNAUTHORIZED") router.push("/sign-in");
//     },
//   })
// );

// useEffect(() => {
//   if (error?.data?.code === "NOT_FOUND") {
//     clearTenantCart();
//     toast.warning("Invalid products found, cart cleared.");
//   }
// }, [error, clearTenantCart]);

// useEffect(() => {
//   if (states.success) {
//     setStates({
//       success: false,
//       cancel: false,
//     });
//     clearTenantCart();
//     // queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
//     // router.push("/library");
//   }
// }, [
//   states.success,
//   clearTenantCart,
//   // router,
//   setStates,
// ]);

// const purchaseHandler = () => {
//   mutate({ tenantSlug, productIds });
// };

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import useCart from "./use-cart";
import { useCheckoutState } from "./use-checkout-state";

export function useCheckoutLogic(tenantSlug: string) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { productIds, removeFromCart, clearTenantCart } = useCart(tenantSlug);
  const [states, setStates] = useCheckoutState();

  // Query to fetch products
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
      // tenantSlug: tenantSlug, // Added tenantSlug for better security
    })
  );

  // Mutation to handle purchase
  const { mutate, isPending } = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("You need to be signed in to purchase.");
          router.push("/sign-in");
        } else {
          toast.error(`Checkout failed. Please try again. : ${error}`);
          // You could also set a state for cancellation if needed
          setStates({ ...states, cancel: true });
        }
      },
      // THIS IS THE CRITICAL ADDITION
      // This callback runs after the mutation is successful or has an error.
      // It's the perfect place to reset the local state.
      // onSettled: () => {
      //   setStates({ success: false, cancel: false });
      // },
    })
  );
  useEffect(() => {
    if (states.success) {
      setStates({
        success: false, // Reset success state to prevent re-trigger
        cancel: false, // Clear any cancel flag
      });

      clearTenantCart(); // Remove all products from cart after successful purchase

      // Invalidate cached queries related to the user's library to ensure fresh data
      queryClient.invalidateQueries(trpc.library.getAll.infiniteQueryFilter());

      // Redirect user to the library page
      router.push("/library");
    }
  }, [
    states.success,
    clearTenantCart,
    setStates,
    router,
    queryClient,
    trpc.library.getAll,
  ]);

  // Effect to handle invalid products
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearTenantCart();
      toast.warning("Invalid products found, cart cleared.");
    }
  }, [error, clearTenantCart]);

  const purchaseHandler = () => {
    mutate({ tenantSlug, productIds });
  };

  return {
    data,
    isLoading,
    isPending,
    purchaseHandler,
    states,
    removeFromCart,
  };
}

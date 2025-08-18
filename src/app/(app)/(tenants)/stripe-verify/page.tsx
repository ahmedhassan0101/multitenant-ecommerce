"use client"; // Enable client-side rendering

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

// Page - Client component that triggers Stripe account verification and redirects the user
const Page = () => {
  const trpc = useTRPC(); // Initialize TRPC client

  // Mutation hook to call the verify the user's Stripe account
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        // Redirect the user to the Stripe onboarding URL returned by the server
        window.location.href = data.url;
      },
      onError: () => {
        // Redirect to home page if verification fails
        window.location.href = "/";
      },
    })
  );

  // Run `verify` once on mount to initiate Stripe verification flow
  useEffect(() => {
    verify(); // Trigger the Stripe verification mutation immediately after mount
  }, [verify]); // Run only once

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Shows a spinner while verification is in progress */}
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
};

export default Page;

import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

// ReviewGetOneOutput - Inferred output type of the reviews.getOne procedure
export type ReviewGetOneOutput =
  inferRouterOutputs<AppRouter>["reviews"]["getOne"];

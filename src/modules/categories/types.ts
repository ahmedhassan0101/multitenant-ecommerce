import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type CategoriesGetAll =
  inferRouterOutputs<AppRouter>["categories"]["getAll"]["docs"];


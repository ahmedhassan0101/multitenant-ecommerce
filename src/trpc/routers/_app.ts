// src\trpc\routers\_app.ts
import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { productRouter } from "@/modules/products/server/procedures";
export const appRouter = createTRPCRouter({
  auth: authRouter,
  categories: categoriesRouter,
  products: productRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;


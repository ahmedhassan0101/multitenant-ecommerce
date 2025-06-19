// src\trpc\routers\_app.ts
import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { productRouter } from "@/modules/products/server/procedures";
import { tagsRouter } from "@/modules/tags/procedures";
export const appRouter = createTRPCRouter({
  auth: authRouter,
  categories: categoriesRouter,
  products: productRouter,
  tags: tagsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;


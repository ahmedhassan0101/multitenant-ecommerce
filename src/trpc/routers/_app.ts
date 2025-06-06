// src\trpc\routers\_app.ts
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter, // The "categoriesRouter" are created in a separate file, and are imported here.
});
// export type definition of API
export type AppRouter = typeof appRouter;


// export const appRouter = createTRPCRouter({
//   hello: baseProcedure
//     .input(
//       z.object({
//         text: z.string(),
//       }),
//     )
//     .query((opts) => {
//       return {
//         greeting: `hello ${opts.input.text}`,
//       };
//     }),
// });

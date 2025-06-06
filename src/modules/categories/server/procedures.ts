// src\modules\categories\server\procedures.ts
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "categories",
      depth: 1,
      where: {
        parent: {
          exists: false,
        },
      },
      limit: 1000,
      sort: "name",
    });
    return data;
  }),
});

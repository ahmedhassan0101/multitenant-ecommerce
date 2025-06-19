import { DEFAULT_CURSOR, DEFAULT_LIMIT } from "@/lib/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
export const tagsRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(DEFAULT_CURSOR),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const data = await ctx.payload.find({
        collection: "tags",
        depth: 0,
        page: cursor,
        limit,
        sort: "createdAt",
      });
      return data;
    }),
});

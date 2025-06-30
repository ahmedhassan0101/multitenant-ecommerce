import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import z from "zod";
export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input: { slug } }) => {
      // Query the tenants collection to find the tenant by its slug
      const tenantsData = await ctx.payload.find({
        collection: "tenants",
        depth: 1,
        where: {
          slug: {
            equals: slug, // Match the tenant by slug
          },
        },
        limit: 1,
        pagination: false,
      });
      const tenant = tenantsData.docs[0]; // Get the first tenant from the results

      if (!tenant) {
        // Throw error if the tenant is not found
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found.", // Message to be returned in case of failure
        });
      }
      // Return the tenant object, with the image explicitly typed as Media or null
      return tenant as Tenant & { image: Media | null };
    }),
});

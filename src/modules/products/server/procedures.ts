/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import {
  // Sort,
  Where,
} from "payload";
export const productRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().nullable().optional(),
        isSubcategory: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categorySlug, isSubcategory } = input;

      console.log("categorySlug: ", categorySlug); // category or subcategory
      console.log("isSubcategory: ", isSubcategory); // boolean

      // If no category specified, return all products
      if (!categorySlug) {
        const products = await ctx.payload.find({
          collection: "products",
          depth: 1,
          pagination: false,
        });
        return products.docs;
      }

      // First, find the category by slug

      const categoryResult = await ctx.payload.find({
        collection: "categories",
        where: {
          slug: {
            equals: categorySlug,
          },
        },
        depth: 1,
        limit: 1,
        pagination: false,
      });

      if (!categoryResult.docs.length) {
        throw new Error(`Category with slug "${categorySlug}" not found`);
      }
      const category = categoryResult.docs[0];

      let whereClause: Where;

      if (isSubcategory) {
        // For subcategory: only products that belong to this specific subcategory
        whereClause = {
          category: {
            equals: category.id,
          },
        };
      } else {
        // For parent category: products from this category + all its subcategories
        const subcategoryIds =
          category.subcategories?.docs?.map((sub: any) => sub.id) || [];

        whereClause = {
          or: [
            // Products directly in this category
            {
              category: {
                equals: category.id,
              },
            },
            // Products in any of the subcategories
            ...(subcategoryIds.length > 0
              ? [
                  {
                    category: {
                      in: subcategoryIds,
                    },
                  },
                ]
              : []),
          ],
        };
      }
      const products = await ctx.payload.find({
        collection: "products",
        where: whereClause,
        depth: 1,
        pagination: false,
      });
      return products.docs;
    }),
});

// const baseCondition = {
//       category: {
//         equals: category.id,
//       },
//     };

//  if (isSubcategory) {
//         // For subcategory: only products that belong to this specific subcategory
//         whereClause = baseCondition;
//       } else {
//         // For parent category: products from this category + all its subcategories
//         const subcategoryIds =
//           category.subcategories?.docs?.map((sub: any) => sub.id) || [];

//         const subcategoryCondition =
//           subcategoryIds.length > 0
//             ? {
//                 category: {
//                   in: subcategoryIds,
//                 },
//               }
//             : null;

//         whereClause = {
//           or: subcategoryCondition
//             ? [baseCondition, subcategoryCondition]
//             : [baseCondition],
//         };
//       }

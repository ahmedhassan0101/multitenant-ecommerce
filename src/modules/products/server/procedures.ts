/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { Sort, Where } from "payload";
import { sortValues } from "@/lib/constants";

const sortMap: Record<(typeof sortValues)[number], Sort> = {
  curated: "-createdAt",
  hot_and_new: "+createdAt",
  trending: "-createdAt",
  price_asc: "+price",
  price_desc: "-price",
};
export const productRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().nullable().optional(),
        isSubcategory: z.boolean().default(false),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categorySlug, isSubcategory, minPrice, maxPrice, sort } = input;

      const sortValue: Sort = sort ? sortMap[sort] : "-createdAt";

      // If no category specified, return all products
      if (!categorySlug) {
        const whereClause: Where = {};

        if (minPrice) {
          whereClause.price = {
            ...(whereClause.price || {}),
            greater_than_equal: parseFloat(minPrice),
          };
        }

        if (maxPrice) {
          whereClause.price = {
            ...(whereClause.price || {}),
            less_than_equal: parseFloat(maxPrice),
          };
        }
        const products = await ctx.payload.find({
          collection: "products",
          depth: 1,
          pagination: false,
          where: whereClause,
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

      //  Add minPrice/maxPrice filtering if present
      if (minPrice || maxPrice) {
        whereClause = {
          and: [
            whereClause,
            {
              price: {
                ...(minPrice
                  ? { greater_than_equal: parseFloat(minPrice) }
                  : {}),
                ...(maxPrice ? { less_than_equal: parseFloat(maxPrice) } : {}),
              },
            },
          ],
        };
      }

      const products = await ctx.payload.find({
        collection: "products",
        where: whereClause,
        depth: 1,
        pagination: false,
        sort: sortValue,
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

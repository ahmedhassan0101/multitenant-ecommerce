/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { Sort, Where } from "payload";
import { sortValues } from "@/lib/constants";
import { Media, Tenant } from "@/payload-types";

const sortMap: Record<(typeof sortValues)[number], Sort> = {
  curated: "-createdAt",
  hot_and_new: "+createdAt",
  trending: "-createdAt",
  price_asc: "+price",
  price_desc: "-price",
};
export const productRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        depth: 2,
        id,
      });

      const reviews = await ctx.payload.find({
        collection: "reviews",
        depth: 1,
        where: {
          product: { equals: id },
        },
      });

      const ratingMetrics = calculateRatingMetrics(reviews.docs);
      return {
        ...product,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        review: reviews.docs,
        ...ratingMetrics,
      };
    }),

  getAll: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().nullable().optional(),
        isSubcategory: z.boolean().default(false),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(6),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        categorySlug,
        isSubcategory,
        minPrice,
        maxPrice,
        sort,
        tags,
        page,
        limit,
        tenantSlug,
      } = input;
      const sortValue: Sort = sort ? sortMap[sort] : "-createdAt";

      // Build category where clause
      let categoryWhereClause: Where = {};

      if (categorySlug) {
        // Find the category by slug
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

        if (isSubcategory) {
          // For subcategory: only products that belong to this specific subcategory
          categoryWhereClause = {
            category: {
              equals: category.id,
            },
          };
        } else {
          // For parent category: products from this category + all its subcategories
          const subcategoryIds =
            category.subcategories?.docs?.map((sub: any) => sub.id) || [];
          categoryWhereClause = {
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
      }

      // Build conditions array
      const conditions = [categoryWhereClause].filter(
        (condition) => Object.keys(condition).length > 0
      );

      // Add price filtering if present
      if (minPrice || maxPrice) {
        conditions.push({
          price: {
            ...(minPrice ? { greater_than_equal: parseFloat(minPrice) } : {}),
            ...(maxPrice ? { less_than_equal: parseFloat(maxPrice) } : {}),
          },
        });
      }

      // Add tags filtering if present
      if (tags && tags.length > 0) {
        conditions.push({
          "tags.name": { in: tags },
        });
      }

      // Apply tenant filter if a tenant slug is provided
      if (tenantSlug) {
        conditions.push({ "tenant.slug": { equals: tenantSlug } });
      }

      // Combine all conditions
      const finalWhere =
        conditions.length > 1 ? { and: conditions } : conditions[0] || {};

      // Execute the query
      const products = await ctx.payload.find({
        collection: "products",
        where: finalWhere,
        depth: 2,
        pagination: true,
        page: page,
        limit: limit,
        sort: sortValue,
      });
      const productIds = products.docs.map((product) => product.id);

      const allReviews = await ctx.payload.find({
        collection: "reviews",
        where: {
          product: {
            in: productIds,
          },
        },
        pagination: false,
        select: {
          product: true,
          rating: true,
        },
      });

      const reviewsByProduct = allReviews.docs.reduce(
        (acc, review) => {
          const productId =
            typeof review.product === "string"
              ? review.product
              : review.product.id;

          if (!acc[productId]) {
            acc[productId] = [];
          }
          acc[productId].push(review);

          return acc;
        },
        {} as Record<string, Array<{ rating: number }>>
      );

      const calculateReviewMetrics = (
        productReviews: Array<{ rating: number }>
      ) => {
        const totalReviews = productReviews.length;

        if (totalReviews === 0) {
          return {
            reviewRating: 0,
            reviewCount: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          };
        }

        let totalRatingSum = 0;
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        productReviews.forEach((review) => {
          const rating = review.rating;
          totalRatingSum += rating;

          if (rating >= 1 && rating <= 5) {
            ratingCounts[rating as keyof typeof ratingCounts]++;
          }
        });

        const reviewRating = Number((totalRatingSum / totalReviews).toFixed(1));

        const ratingDistribution = Object.entries(ratingCounts).reduce(
          (acc, [rating, count]) => {
            acc[Number(rating)] = Math.round((count / totalReviews) * 100);
            return acc;
          },
          {} as Record<number, number>
        );

        return {
          reviewRating,
          reviewCount: totalReviews,
          ratingDistribution,
        };
      };

      const productsWithReviews = products.docs.map((product) => {
        const productReviews = reviewsByProduct[product.id] || [];
        const reviewMetrics = calculateReviewMetrics(productReviews);

        return {
          ...product,
          image: product.image as Media | null,
          tenant: product.tenant as Tenant & { image: Media | null },
          reviewRating: reviewMetrics.reviewRating,
          reviewCount: reviewMetrics.reviewCount,
          ratingDistribution: reviewMetrics.ratingDistribution,
        };
      });
      return {
        products: productsWithReviews,
        pagination: {
          page: products.page,
          limit: products.limit,
          totalPages: products.totalPages,
          totalDocs: products.totalDocs,
          hasNextPage: products.hasNextPage,
          hasPrevPage: products.hasPrevPage,
          nextPage: products.nextPage,
          prevPage: products.prevPage,
        },
      };
      // return {
      //   products: products.docs.map((doc) => ({
      //     ...doc,
      //     image: doc.image as Media | null, // Cast product image to Media or null to enforce proper type
      //     tenant: doc.tenant as Tenant & { image: Media | null }, // Cast tenant field to include image property
      //   })),
      //   // products: products.docs,
      //   pagination: {
      //     page: products.page,
      //     limit: products.limit,
      //     totalPages: products.totalPages,
      //     totalDocs: products.totalDocs,
      //     hasNextPage: products.hasNextPage,
      //     hasPrevPage: products.hasPrevPage,
      //     nextPage: products.nextPage,
      //     prevPage: products.prevPage,
      //   },
      // };
      //  !OR
      //   return {
      //   ...products,
      // docs: products.docs.map((doc) => ({
      //   ...doc,
      //   image: doc.image as Media | null,
      // })),
      // };
    }),
});

const calculateRatingMetrics = (reviewsData: Array<{ rating: number }>) => {
  const totalReviews = reviewsData.length;

  if (totalReviews === 0) {
    return {
      reviewRating: 0,
      reviewCount: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
  // Initialize counters
  let totalRatingSum = 0;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  // Single loop to calculate everything
  reviewsData.forEach((review) => {
    const rating = review.rating;
    totalRatingSum += rating;
    // Count each rating (with validation)
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating as keyof typeof ratingCounts]++;
    }
  });
  // Calculate average rating
  const reviewRating = Number((totalRatingSum / totalReviews).toFixed(1));
  // Convert counts to percentages
  const ratingDistribution = Object.entries(ratingCounts).reduce(
    (acc, [rating, count]) => {
      acc[Number(rating)] = Math.round((count / totalReviews) * 100);
      return acc;
    },
    {} as Record<number, number>
  );

  return {
    reviewRating,
    reviewCount: totalReviews,
    ratingDistribution,
  };
};
//  .query(async ({ ctx, input }) => {
//       const { categorySlug, isSubcategory, minPrice, maxPrice, sort, tags } =
//         input;
//       const sortValue: Sort = sort ? sortMap[sort] : "-createdAt";

//       // If no category specified, return all products
//       if (!categorySlug) {
//         const whereClause: Where = {};

//         if (minPrice) {
//           whereClause.price = {
//             ...(whereClause.price || {}),
//             greater_than_equal: parseFloat(minPrice),
//           };
//         }

//         if (maxPrice) {
//           whereClause.price = {
//             ...(whereClause.price || {}),
//             less_than_equal: parseFloat(maxPrice),
//           };
//         }
//         if (tags && tags.length > 0) {
//           whereClause["tags.name"] = { in: tags };
//         }
//         const products = await ctx.payload.find({
//           collection: "products",
//           depth: 1,
//           pagination: false,
//           where: whereClause,
//         });

//         return products.docs;
//       }
//       // First, find the category by slug
//       const categoryResult = await ctx.payload.find({
//         collection: "categories",
//         where: {
//           slug: {
//             equals: categorySlug,
//           },
//         },
//         depth: 1,
//         limit: 1,
//         pagination: false,
//       });

//       if (!categoryResult.docs.length) {
//         throw new Error(`Category with slug "${categorySlug}" not found`);
//       }
//       const category = categoryResult.docs[0];
//       let whereClause: Where;
//       if (isSubcategory) {
//         // For subcategory: only products that belong to this specific subcategory
//         whereClause = {
//           category: {
//             equals: category.id,
//           },
//         };
//       } else {
//         // For parent category: products from this category + all its subcategories
//         const subcategoryIds =
//           category.subcategories?.docs?.map((sub: any) => sub.id) || [];
//         whereClause = {
//           or: [
//             // Products directly in this category
//             {
//               category: {
//                 equals: category.id,
//               },
//             },
//             // Products in any of the subcategories
//             ...(subcategoryIds.length > 0
//               ? [
//                   {
//                     category: {
//                       in: subcategoryIds,
//                     },
//                   },
//                 ]
//               : []),
//           ],
//         };
//       }

//       //  Add minPrice/maxPrice filtering if present
//       if (minPrice || maxPrice) {
//         whereClause = {
//           and: [
//             whereClause,
//             {
//               price: {
//                 ...(minPrice
//                   ? { greater_than_equal: parseFloat(minPrice) }
//                   : {}),
//                 ...(maxPrice ? { less_than_equal: parseFloat(maxPrice) } : {}),
//               },
//             },
//           ],
//         };
//       }
//       if (tags && tags.length > 0) {
//         whereClause["tags.name"] = { in: tags };
//       }
//       const products = await ctx.payload.find({
//         collection: "products",
//         where: whereClause,
//         depth: 1,
//         pagination: false,
//         sort: sortValue,
//       });

//       return products.docs;
//     }
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

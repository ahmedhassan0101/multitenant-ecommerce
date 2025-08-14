/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTRPCRouter, protectedProcedures } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedures
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const reviewsData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            { product: { equals: product.id } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });
      const review = reviewsData.docs[0];
      if (!review) {
        return null;
      }
      return review;
    }),
  getMultiple: protectedProcedures
    .input(
      z.object({
        productIds: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.productIds.length) {
        return {};
      }

      const reviews = await ctx.payload.find({
        collection: "reviews",
        where: {
          and: [
            {
              product: {
                in: input.productIds,
              },
            },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });

      // Transform to object for easy lookup: { productId: review }
      const reviewsMap = reviews.docs.reduce(
        (acc, review) => {
          // Fix the typing issue by ensuring we get the product ID as string
          const productId =
            typeof review.product === "string"
              ? review.product
              : review.product.id;
          acc[productId] = review;
          return acc;
        },
        {} as Record<string, any>
      );

      return reviewsMap;
    }),
  create: protectedProcedures
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, { message: "Rating is required" }).max(5),
        description: z.string().min(3, { message: "Description is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReviewsData = await ctx.payload.find({
        collection: "reviews",
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });

      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      const review = await ctx.payload.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
        },
      });

      return review;
    }),

  update: protectedProcedures
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: "Rating is required" }).max(5),
        description: z.string().min(3, { message: "Description is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.payload.findByID({
        depth: 0,
        collection: "reviews",
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }
      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this review",
        });
      }
      const updatedReview = await ctx.payload.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      return updatedReview;
    }),
});

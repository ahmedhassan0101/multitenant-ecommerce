import { Media, Product, Tenant, User } from "@/payload-types";
import { createTRPCRouter, protectedProcedures } from "@/trpc/init";
import { z } from "zod";

export const libraryRoute = createTRPCRouter({
  getOne: protectedProcedures
    .input(z.object({ orderId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const orderData = await ctx.payload.find({
          collection: "orders",
          pagination: false,
          depth: 3,
          limit: 1,
          where: {
            and: [
              {
                id: {
                  equals: input.orderId,
                },
              },
              {
                user: {
                  equals: ctx.session.user.id,
                },
              },
            ],
          },
        });

        if (!orderData.docs.length) {
          throw new Error(
            "Order not found or you don't have permission to view it"
          );
        }
        const order = orderData.docs[0];

        return {
          ...order,
          user: order.user as User,
          tenant: {
            ...(order.tenant as Tenant),
            image: (order.tenant as Tenant).image as Media | null,
          },
          products: (order.products as Product[]).map((product) => ({
            ...product,
            image: product.image as Media | null,
            tenant: {
              ...(product.tenant as Tenant),
              image: (product.tenant as Tenant).image as Media | null,
            },
          })),
        };
        // return order;
      } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error("Failed to fetch order details");
      }
    }),

  getAll: protectedProcedures
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(2),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;

      const ordersData = await ctx.payload.find({
        collection: "orders",
        depth: 2,
        page: cursor,
        limit,
        where: { user: { equals: ctx.session.user.id } },
      });
      return {
        ...ordersData,
        docs: ordersData.docs.map((order) => ({
          ...order,
          user: order.user as User,
          tenant: {
            ...(order.tenant as Tenant),
            image: (order.tenant as Tenant).image as Media | null,
          },
          products: (order.products as Product[]).map((product) => ({
            ...product,
            tenant: {
              ...(product.tenant as Tenant),
              image: (product.tenant as Tenant).image as Media | null,
            },
            image: product.image as Media | null,
          })),
        })),
      };
      // return ordersData;
      // return {
      //   ...ordersData,
      //   docs: ordersData.docs.map((order) => ({
      //     ...order,
      //     user: order.user as User,
      //     tenant: order.tenant as Tenant & { image: Media | null },
      //     products: order.products.map((product) => {
      //       const fullProduct = product as Product;
      //       return {
      //         ...fullProduct,
      //         tenant: fullProduct.tenant as Tenant & { image: Media | null },
      //         image: fullProduct.image as Media,
      //       };
      //     }),
      //   })),
      // };
    }),
});

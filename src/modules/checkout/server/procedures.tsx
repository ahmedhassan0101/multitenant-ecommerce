/* eslint-disable @typescript-eslint/no-unused-vars */
import { Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedures,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
// import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENTAGE } from "@/lib/constants";
export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: { id: { in: input.ids } },
      });

      const missingIds = input.ids.filter(
        (id) => !data.docs.some((prod) => prod.id === id)
      );

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const totalPrice = data.docs.reduce((acc, prod) => {
        const price = Number(prod.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice,
        missingIds,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),

  purchase: protectedProcedures
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productIds, tenantSlug } = input;
      const { id: userId, email: userEmail } = ctx.session.user;

      // Validate user
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }
      //Fetch products that match the provided IDs and belong to the specified tenant
      const products = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: productIds,
              },
            },
            {
              "tenant.slug": {
                equals: tenantSlug,
              },
            },
            // {
            //   isArchived: {
            //     not_equals: true,
            //   },
            // },
          ],
        },
      });

      if (products.totalDocs === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      if (products.totalDocs !== productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Some products were not found or do not belong to this tenant",
        });
      }
      // const tenantsData = await ctx.payload.find({
      //   collection: "tenants",
      //   limit: 1,
      //   pagination: false,
      //   where: {
      //     slug: { equals: tenantSlug },
      //   },
      // });

      // const tenant = tenantsData.docs[0];
      const tenant = products.docs[0].tenant as Tenant; // Assuming all products share the same tenant

      if (!tenant || !tenant.stripeAccountId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant or Stripe account not found",
        });
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: Number(product.price) * 100,
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata,
              // Metadata attached to each product inside line_items.
              // This is accessible in the webhook by expanding: `line_items.data.price.product.metadata`.
              // Used to retrieve detailed info about each individual product purchased.
            },
          },
        }));

      const totalAmount = products.docs.reduce((acc, item) => {
        return acc + item.price * 100;
      }, 0);

      const platformFeeAmount = Math.round(
        totalAmount * (PLATFORM_FEE_PERCENTAGE / 100)
      );

      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: userEmail,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}/checkout?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          invoice_creation: {
            enabled: true,
          },
          metadata: {
            userId,
            tenantSlug,
            tenantId: tenant.id,
            productIds: productIds.join(","),
          } as CheckoutMetadata,
          // Metadata attached directly to the Stripe Checkout Session.
          // This data is available in `event.data.object.metadata` inside the webhook handler.
          // Used to identify the user, tenant, and purchased product IDs at the session level.
          // payment_intent_data: {
          //   application_fee_amount: platformFeeAmount,
          // },
        },
        // tenant.stripeAccountId && tenant.stripeAccountId !== "test"
        //   ? { stripeAccount: tenant.stripeAccountId }
        //   : {}
        // {
        //   stripeAccount: tenant.stripeAccountId,
        // }
      );

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
      return {
        url: checkout.url,
      };
    }),
});

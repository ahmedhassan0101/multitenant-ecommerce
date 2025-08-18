import { isSuperAdmin } from "@/lib/access";
import { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    read: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "tenant",
      type: "relationship",
      relationTo: "tenants",
      required: true,
      hasMany: false,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: true,
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description: "Total order amount in cents",
      },
    },
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Stripe checkout session associated with this order", // Help text shown in the admin UI
      },
    },
    {
      name: "stripeAccountId",
      type: "text",
      admin: {
        description: "Stripe account associated with this order", // Help text shown in the admin UI
      },
    },
  ],
};

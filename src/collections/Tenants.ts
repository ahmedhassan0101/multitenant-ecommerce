import { isSuperAdmin } from "@/lib/access";
import { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/tenants)
  slug: "tenants",
  access: {
    read: () => true,

    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "slug",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Store Name",
      admin: {
        description: "The name of the store (e.g., John Doe's Store)",
      },
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description: "The subdomain of the store (e.g., [slug].funroad.com)",
      },
    },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description: "Stripe Account ID associated with your shop",
      },
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description:
          "You cannot create products until you’ve submitted your Stripe details.",
      },
    },
  ],
};

import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req }) => {
      // If the user is a super admin, allow them to create products
      if (isSuperAdmin(req.user)) return true;

      // Get the tenant from the user
      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;

      // Check if the tenant has submitted their stripe details
      return Boolean(tenant?.stripeDetailsSubmitted);
    },
    delete: ({ req }) => isSuperAdmin(req.user), // Only super admins can delete products
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your account before you can create products.",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "Price in USD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
      defaultValue: "30-day",
    },
    {
      name: "content",
      type: "richText",
      admin: {
        description:
          "Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Support markdown formatting.",
      },
    },

    // isPrivate - Checkbox to make the product private
    {
      name: "isPrivate",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "If checked, this product will not be shown on the public storefront.",
      },
    },

    // isArchived - Checkbox to archive the product
    {
      name: "isArchived",
      label: "Archive",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "If checked, this product will be archived.",
      },
    },
  ],
};

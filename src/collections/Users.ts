import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",

  arrayFieldAccess: {
    read: () => true,
    // create: () => true,
    // update: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    // create: () => true,
    // update: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    // Allow all users to read create delete
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      // If the user is a super admin, allow them to update any user
      if (isSuperAdmin(req.user)) return true;

      // If the user is not a super admin, allow them to update their own user
      return req.user?.id === id;
    },
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isSuperAdmin(user), // Hide the users collection from non-super admins
  },
  auth: true,
  //  auth: {
  //   cookies: {
  //     ...(process.env.NODE_ENV !== "development" && {
  //       sameSite: "None",
  //       domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  //       secure: true,
  //     }),
  //   },
  // },
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      defaultValue: ["user"],
      options: ["super-admin", "user"],
      admin: {
        position: "sidebar",
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: "password",
      type: "text",
      required: true,
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField.admin || {}),
        position: "sidebar",
      },
    },
  ],
};

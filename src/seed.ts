import config from "@payload-config";
import { getPayload } from "payload";
import { categoriesSeeder } from "./lib/seed/categories-seeder";

async function seed() {
  try {
    const payload = await getPayload({ config });

    // Create admin tenant
    // This is the root tenant used to isolate super-admin resources.
    // All system-level or tenant-agnostic features should be scoped under this tenant.
    const adminTenant = await payload.create({
      collection: "tenants",
      data: {
        name: "admin", // Human-readable name of the tenant
        slug: "admin", // Used for routing or subdomain mapping
        stripeAccountId: "adminAccount.id", // Use the admin Stripe account ID
      },
    });

    // Create admin user
    // This user acts as the global super-admin for the platform.
    // Has elevated privileges and is linked to the admin tenant for top-level access.
    await payload.create({
      collection: "users",
      data: {
        username: "admin", // Username used for internal identification or display
        email: "admin@demo.com", // Admin's login email
        password: "demo", // Admin's initial password (should be updated in production)
        roles: ["super-admin"], // Assign the highest-level role for unrestricted access
        tenants: [{ tenant: adminTenant.id }], // Link the admin user to the admin tenant
      },
    });

    await categoriesSeeder(payload);
    console.log("🎉 All seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}
await seed();

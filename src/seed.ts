import config from "@payload-config";
import { getPayload } from "payload";
import { categoriesSeeder } from "./lib/seed/categories-seeder";
import { stripe } from "./lib/stripe";

async function seed() {
  try {
    const payload = await getPayload({ config });
    // Create admin Stripe account
    const adminAccount = await stripe.accounts.create({});
    /* 
    Create admin tenant
    This is the root tenant used to isolate super-admin resources.
    All system-level or tenant-agnostic features should be scoped under this tenant.
    */
    const adminTenant = await payload.create({
      collection: "tenants",
      data: {
        name: "admin",
        slug: "admin",
        stripeAccountId: adminAccount.id,
      },
    });
    /* 
    Create admin user
    This user acts as the global super-admin for the platform.
    Has elevated privileges and is linked to the admin tenant for top-level access.
    */
    await payload.create({
      collection: "users",
      data: {
        username: "admin",
        email: "admin@demo.com",
        password: "demo",
        roles: ["super-admin"],
        tenants: [{ tenant: adminTenant.id }],
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

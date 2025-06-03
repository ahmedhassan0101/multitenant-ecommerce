import config from "@payload-config";
import { getPayload } from "payload";
import { categoriesSeeder } from "./lib/seed/categories-seeder";


async function seed() {
  try {
    const payload = await getPayload({ config });
    await categoriesSeeder(payload);
    console.log("🎉 All seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}
await seed();
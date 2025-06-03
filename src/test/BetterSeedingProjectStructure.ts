// // src/lib/seed/data/categories.ts
// export const categoriesData = [
//   {
//     name: "All",
//     slug: "all",
//   },
//   {
//     name: "Software Development",
//     color: "#7EC8E3",
//     slug: "software-development",
//     subcategories: [
//       { name: "Web Development", slug: "web-development" },
//       { name: "Mobile Development", slug: "mobile-development" },
//       { name: "Game Development", slug: "game-development" },
//       { name: "Programming Languages", slug: "programming-languages" },
//       { name: "DevOps", slug: "devops" },
//     ],
//   },
//   // ... more categories
// ];

// // src/lib/seed/utils/seeder.ts
// import { Payload } from "payload";

// export class Seeder {
//   constructor(private payload: Payload) {}

//   async checkExists(collection: string, slug: string) {
//     const result = await this.payload.find({
//       collection,
//       where: { slug: { equals: slug } },
//       limit: 1,
//     });
//     return result.docs.length > 0 ? result.docs[0] : null;
//   }

//   async createIfNotExists(collection: string, data: any) {
//     const existing = await this.checkExists(collection, data.slug);
    
//     if (existing) {
//       console.log(`✅ ${data.name} already exists`);
//       return existing;
//     }

//     const created = await this.payload.create({
//       collection,
//       data,
//     });
    
//     console.log(`✨ Created: ${data.name}`);
//     return created;
//   }

//   async seedCollection(collection: string, data: any[]) {
//     console.log(`🌱 Seeding ${collection}...`);
    
//     for (const item of data) {
//       await this.createIfNotExists(collection, item);
//     }
    
//     console.log(`✅ ${collection} seeding complete`);
//   }
// }

// // src/lib/seed/seeders/categories.ts
// import { Seeder } from "../utils/seeder";
// import { categoriesData } from "../data/categories";

// export class CategoriesSeeder extends Seeder {
//   async seed() {
//     console.log("🌱 Starting categories seeding...");

//     for (const category of categoriesData) {
//       const parentCategory = await this.createIfNotExists("categories", {
//         name: category.name,
//         slug: category.slug,
//         color: category.color,
//         parent: null,
//       });

//       if (category.subcategories) {
//         for (const subCategory of category.subcategories) {
//           await this.createIfNotExists("categories", {
//             name: subCategory.name,
//             slug: subCategory.slug,
//             parent: parentCategory.id,
//           });
//         }
//       }
//     }

//     console.log("✅ Categories seeding complete");
//   }
// }

// // src/seed.ts (main seed file)
// import config from "@payload-config";
// import { getPayload } from "payload";
// import { CategoriesSeeder } from "./lib/seed/seeders/categories";

// const seed = async () => {
//   try {
//     console.log("🌱 Starting database seeding...");
    
//     const payload = await getPayload({ config });
    
//     // Run different seeders
//     const categoriesSeeder = new CategoriesSeeder(payload);
//     await categoriesSeeder.seed();
    
//     // Add more seeders here as needed
//     // const usersSeeder = new UsersSeeder(payload);
//     // await usersSeeder.seed();
    
//     console.log("🎉 All seeding completed successfully!");
//   } catch (error) {
//     console.error("❌ Error during seeding:", error);
//     process.exit(1);
//   }
// };

// await seed();
// process.exit(0);
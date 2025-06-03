import { BasePayload } from "payload";
import { categories } from "./categories-data";

export async function categoriesSeeder(payload: BasePayload) {

  try {
    console.log("🌱 Starting database seeding...");

    //! Handle categories---------------------------------------
    for (const category of categories) {
      //! Check if parent category already exists
      const existingParent = await payload.find({
        collection: "categories",
        where: {
          slug: {
            equals: category.slug.toLowerCase(),
          },
        },
        limit: 1,
      });

      let parentCategory;

      if (existingParent.docs.length > 0) {
        console.log(`✅ Parent category "${category.name}" already exists`);
        parentCategory = existingParent.docs[0];
      } else {
        parentCategory = await payload.create({
          collection: "categories",
          data: {
            name: category.name,
            slug: category.slug,
            color: category.color,
            parent: null,
          },
        });
        console.log(`✨ Created parent category: ${category.name}`);
      }

      //! Handle subcategories---------------------------------------
      
      if (category.subcategories) {
        for (const subCategory of category.subcategories) {
          //! Check if subcategory already exists
          const existingSub = await payload.find({
            collection: "categories",
            where: {
              slug: {
                equals: subCategory.slug.toLowerCase(),
              },
            },
            limit: 1,
          });

          if (existingSub.docs.length === 0) {
            await payload.create({
              collection: "categories",
              data: {
                name: subCategory.name,
                slug: subCategory.slug,
                parent: parentCategory.id,
              },
            });
            console.log(`  ✨ Created subcategory: ${subCategory.name}`);
          } else {
            console.log(
              `  ✅ Subcategory "${subCategory.name}" already exists`
            );
          }
        }
      }
    }
    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding Categories:", error);
    throw error;
  }
}



// import { BasePayload } from "payload";
// import { categories } from "./categories-data";

// export async function categoriesSeeder(payload: BasePayload) {
//   try {
//     console.log("🌱 Starting database seeding...");

//     //! Step 1: Fetch all existing categories at once
//     const existing = await payload.find({
//       collection: "categories",
//       limit: 1000, // You can increase this if you have more than 1000 categories
//     });

//     const existingCategories = existing.docs;
//     const categoryMap = new Map<string, any>();
//     for (const cat of existingCategories) {
//       categoryMap.set(cat.slug, cat);
//     }

//     //! Step 2: Loop through main categories
//     for (const category of categories) {
//       let parentCategory = categoryMap.get(category.slug);

//       if (!parentCategory) {
//         parentCategory = await payload.create({
//           collection: "categories",
//           data: {
//             name: category.name,
//             slug: category.slug,
//             color: category.color,
//             parent: null,
//           },
//         });
//         categoryMap.set(category.slug, parentCategory);
//         console.log(`✨ Created parent category: ${category.name}`);
//       } else {
//         console.log(`✅ Parent category "${category.name}" already exists`);
//       }

//       //! Step 3: Handle subcategories
//       for (const subCategory of category.subcategories ?? []) {
//         const existingSub = categoryMap.get(subCategory.slug);

//         if (!existingSub) {
//           const createdSub = await payload.create({
//             collection: "categories",
//             data: {
//               name: subCategory.name,
//               slug: subCategory.slug,
//               parent: parentCategory.id,
//             },
//           });
//           categoryMap.set(subCategory.slug, createdSub);
//           console.log(`  ✨ Created subcategory: ${subCategory.name}`);
//         } else {
//           console.log(`  ✅ Subcategory "${subCategory.name}" already exists`);
//         }
//       }
//     }

//     console.log("🎉 Seeding completed successfully!");
//   } catch (error) {
//     console.error("❌ Error during seeding Categories:", error);
//     throw error;
//   }
// }

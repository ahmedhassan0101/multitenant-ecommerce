
import configPromise from "@payload-config";
import { getPayload } from "payload";

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories", //slug
    depth: 1, // or 0 -- Populate the subcategories, subcategories[0] will be of type Category
    where : {
      parent :{
        exists: false
      }
    }
  });

  return Response.json(data);
};



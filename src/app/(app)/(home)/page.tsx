"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  console.log("🚀 ~ HomePage ~ session:", session)
  return (
    <pre>
      {/* <code>{JSON.stringify(session, null, 2)}</code> */}
    </pre>
  );
}

// TODO: Server component approach
// import { getQueryClient, trpc } from "@/trpc/server";

// export default async function HomePage() {
//   const queryClient = getQueryClient();
//   const categories = await queryClient.fetchQuery(
//     trpc.categories.getAll.queryOptions()
//   );

//   return <h1>{JSON.stringify(categories, null, 2)}</h1>;
// }

// !--------------------------------------------
// TODO: Client component approach.
// "use client"
// import { useQuery } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";

// export default  function HomePage() {
//   const trpc = useTRPC();
//   const categories = useQuery(trpc.categories.getAll.queryOptions());
//   if (!categories.data) return <div>Loading...</div>;

//   return <h1>{JSON.stringify(categories, null, 2)}</h1>;
// }

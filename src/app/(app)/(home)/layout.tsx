import SearchFilters from "@/modules/home/ui/search-filters";
import Navbar from "@/modules/home/ui/Navbar";
import Footer from "@/modules/home/ui/Footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let data = null;
  let error = null;

  try {
    const response = await fetch("http://localhost:3000/my-route", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Error");
    data = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "خطأ غير معروف";
    console.log(error);
  }
  // Because of depth 1, we are confident doc will be a type of Category
  // const formattedData = data.docs.map((doc: Category) => ({
  //   ...doc,
  //   subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
  //     ...(doc as Category),
  //   })),
  // }));
  // console.log("data: 50 50" + JSON.stringify(data, null, 2));

  return (
    <section className="flex min-h-screen flex-col">
      <Navbar />

      <SearchFilters categories={data.docs} />
      <div className="flex-1 bg-[#f4f4f0]">
        <pre>
          {/* <code>{JSON.stringify(data, null, 2)}</code> */}
        </pre>
        {children}
      </div>
      <Footer />
    </section>
  );
}

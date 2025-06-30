import { Footer } from "@/modules/tenants/ui/footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode; // Main content to be rendered within the layout
  params: Promise<{ slug: string }>; // Dynamic route parameter for identifying the tenant
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;

  const queryClient = getQueryClient();

  // Prefetch tenant data before rendering (ensures Navbar has access to tenant info)
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug, // Fetch tenant by slug
    })
  );

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      {/* Top navigation bar, hydrated and rendered with fallback during SSR */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      {/* Main content area grows to fill vertical space */}
      <div className="flex-1">
        {/* Constrain content to max width on large screens */}
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      {/* Footer with tenant-specific links and info */}
      <Footer />
    </div>
  );
}

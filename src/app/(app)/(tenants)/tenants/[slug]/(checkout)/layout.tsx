import { Navbar } from "@/modules/checkout/ui/components/navbar";
import Footer from "@/modules/tenants/ui/footer";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
     <Navbar slug={slug} />
      {/* Main content area that expands to fill available vertical space */}
      <div className="flex-1">
        {/* Constrain content width on large screens */}
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

import CheckoutView from "@/modules/checkout/ui/views/checkout-view";

interface PageProps {
  params: Promise<{ slug: string }>; // Dynamic route parameter for identifying the tenant
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <CheckoutView tenantSlug={slug} />;
}

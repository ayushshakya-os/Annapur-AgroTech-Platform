import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import ProductDetail from "@/components/ui/Product-detail/ProductDetail";
import products from "@/data/market-products.json";
import { notFound } from "next/navigation";
import ToggleDescription from "@/components/ui/Product-detail/ToggleDescription";


export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(), // Convert number → string
    slug: product.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata(props: {
  params: { id: string; slug: string };
}) {
  const params = await props.params;
  const product = products.find((p) => p.id.toString() === params.id);

  if (!product) return {};

  return {
    title: `${product.name} | Marketplace`,
    description: product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
        },
      ],
    },
  };
}

export default async function ProductPage(props: {
  params: { id: string; slug: string };
}) {
  const params = await props.params;
  const product = products.find((p) => p.id.toString() === params.id);

  if (!product) return notFound();

  return (
    <div className="mt-[116px]">

      <Breadcrumb productName={product.name} />
      <ProductDetail product={product} />
      <ToggleDescription product={product} />
    </div>
  );
}

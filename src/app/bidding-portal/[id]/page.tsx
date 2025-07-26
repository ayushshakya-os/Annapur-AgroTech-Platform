// app/bidding/[id]/page.tsx
import { notFound } from "next/navigation";
import allProducts from "@/data/market-products.json";
import BiddingDetail from "@/components/ui/Bidding-Portal/BiddingDetails";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";

export default function BiddingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = allProducts.find((p) => p.id === parseInt(params.id));

  if (!product) return notFound();

  return (
    <section className="mt-[116px]">
      <Breadcrumb productName={product.name} />
      <BiddingDetail product={product} />
    </section>
  );
}

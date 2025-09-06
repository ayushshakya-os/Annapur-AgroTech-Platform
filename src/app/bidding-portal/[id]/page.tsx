import { notFound } from "next/navigation";
import BiddingDetail from "@/components/ui/Bidding-Portal/BiddingDetails";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  const allProducts = (await import("@/data/market-products.json")).default;
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function BiddingDetailPage(props: {
  params: { id: string };
}) {
  const { id: idParam } = await props.params;
  const id = parseInt(idParam, 10);

  const allProducts = (await import("@/data/market-products.json")).default;
  const product = allProducts.find((p) => p.id === id);

  if (!product) return notFound();

  return (
    <section className="mt-[116px] px-5 md:px-10 lg:px-20 mb-10 min-h-screen">
      <Breadcrumb productName={product.name} />
      <BiddingDetail product={product} />
    </section>
  );
}

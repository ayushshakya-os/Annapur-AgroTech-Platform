"use client";

import * as React from "react";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import ProductDetail from "@/components/ui/Product-detail/ProductDetail";
import { useGetProductById } from "@/hooks/api/Market/useGetProductById";
import { notFound } from "next/navigation";
import ToggleDescription from "@/components/ui/Product-detail/ToggleDescription";
import Loading from "./loading";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  // unwrap the promise (Next.js 15+ requirement)
  const { id, slug } = React.use(params);

  // Fetch product from backend using React Query hook
  const { data: product, isLoading, error } = useGetProductById(id);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading product
      </div>
    );
  if (!product) return notFound();

  return (
    <div className="mt-[116px]">
      <Breadcrumb productName={product.name} />
      <ProductDetail product={product} />
      <ToggleDescription product={product} />
    </div>
  );
}

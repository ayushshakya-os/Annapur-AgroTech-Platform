"use client";

import React, { useMemo } from "react";
import Bidding from "@/components/ui/Bidding-Portal/Bidding";
// Adjust this import path if your hook is in a different location
import { useAllProducts } from "@/hooks/api/Market/useGetProducts";

const BiddingPageClient: React.FC = () => {
  const { data, isLoading, isError, error } = useAllProducts();

  // Normalize products and ensure `id` exists for keys/card, and pre-filter to biddable
  const products = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const biddable = list.filter((p: any) => p?.isBiddable === true);
    return biddable.map((p: any) => ({
      id: p.id ?? p._id ?? "",
      ...p,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="px-4 md:px-10 lg:px-20 my-10">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 md:px-10 lg:px-20 my-10">
        <p className="text-red-600">
          Failed to load products
          {(error as any)?.message ? `: ${(error as any).message}` : "."}
        </p>
      </div>
    );
  }

  return <Bidding products={products} />;
};

export default BiddingPageClient;

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import BiddingDetail from "@/components/ui/Bidding-Portal/BiddingDetails";
import { useAllProducts } from "@/hooks/api/Market/useGetProducts";

type RawProduct = {
  _id?: string;
  id?: string | number;
  name: string;
  image: string;
  price: number;
  short_description: string;
  description?: string;
  category: string;
  farmerId: string;
  isBiddable?: boolean;
  createdAt?: string;
};

function normalizeProduct(p: RawProduct) {
  return {
    id: (p.id ?? p._id ?? "") as string | number,
    name: p.name,
    image: p.image,
    price: p.price,
    short_description: p.short_description,
    description: p.description,
    category: p.category,
    farmerId: p.farmerId,
    isBiddable: p.isBiddable === true,
    createdAt: p.createdAt,
    // Keep the original identifiers for robust matching if needed elsewhere
    _id: p._id,
  };
}

export default function BiddingDetailClient({ idParam }: { idParam: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useAllProducts();

  const { product, notOpenForBidding } = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    // Find by id (numeric or string) or by Mongo _id
    const found = list.find((p: RawProduct) => {
      const pid = p.id != null ? String(p.id) : "";
      const oid = p._id != null ? String(p._id) : "";
      return pid === idParam || oid === idParam;
    });

    if (!found) return { product: undefined, notOpenForBidding: false };

    // Only allow details for biddable items
    if (found.isBiddable !== true) {
      return { product: undefined, notOpenForBidding: true };
    }

    return { product: normalizeProduct(found), notOpenForBidding: false };
  }, [data, idParam]);

  if (isLoading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Loading product details...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            Failed to load product details
            {(error as any)?.message ? `: ${(error as any).message}` : "."}
          </p>
          <button
            className="mt-4 px-4 py-2 rounded bg-green-600 text-white"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            {notOpenForBidding
              ? "This item is not open for bidding."
              : "Product not found."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              className="px-4 py-2 rounded bg-green-600 text-white"
              onClick={() => router.push("/bidding")}
            >
              Back to Bidding
            </button>
            <button
              className="px-4 py-2 rounded border border-gray-300"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-[0px]">
      <Breadcrumb productName={product.name} />
      <BiddingDetail product={product as any} />
    </section>
  );
}

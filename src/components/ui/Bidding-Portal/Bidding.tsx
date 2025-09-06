"use client";
import React, { useEffect, useState } from "react";
import { Pagination } from "../Market/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import BiddingCard, { Product } from "./BiddingCart";

type Props = {
  products: Product[];
};

const Bidding: React.FC<Props> = ({ products }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productsPerPage = 12;

  // Limit to first 96 products for ~8 pages
  const limitedProducts = products.slice(0, 96);

  // Get page from URL or default to 1
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState<number>(
    isNaN(initialPage) || initialPage < 1 ? 1 : initialPage
  );

  // Update the URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage.toString());
    router.replace(`?${params.toString()}`);
  }, [currentPage]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = limitedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(limitedProducts.length / productsPerPage);

  return (
    <div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 md:px-10 lg:px-20 my-10">
        {currentProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-20">
            <img
              src="/image/market/no-bids.png"
              alt="No products"
              className="mx-auto mb-4 w-32 h-32"
            />
            <p className="text-lg">
              No items available for bidding at the moment.
            </p>
          </div>
        ) : (
          currentProducts.map((product) => (
            <BiddingCard product={product} key={product.id} />
          ))
        )}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page < 1 || page > totalPages || page === currentPage) return;
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
};

export default Bidding;

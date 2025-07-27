// components/Bidding-Portal/Bidding.tsx
"use client";
import React, { use, useEffect, useState } from "react";
import { showAuthToast } from "../Toasts/ToastMessage";
import { showToast } from "../Toasts/toast";
import { Pagination } from "../Market/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  short_description?: string;
  category?: string;
};

type Props = {
  products: Product[];
};

const BiddingCard: React.FC<{ product: Product }> = ({ product }) => {
  const [currentBid, setCurrentBid] = useState<number>(
    parseFloat(product.price) || 0
  );
  const [bidInput, setBidInput] = useState<string>("");

  const handlePlaceBid = () => {
    const newBid = parseFloat(bidInput);
    if (isNaN(newBid)) {
      showToast("error", "Please enter a valid bid amount.");
      return;
    }

    if (newBid > currentBid) {
      setCurrentBid(newBid);
      showAuthToast("bid-placed");
    } else {
      showToast(
        "error",
        "Please enter a bid higher than the current highest bid."
      );
    }

    setBidInput("");
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      <Link href={`/bidding-portal/${product.id}`} key={product.id}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover rounded-md"
        />
        <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
        <p className="text-sm text-gray-600">
          {product.short_description || product.description}
        </p>
        <p className="mt-2 text-[#88B04B] font-bold">
          Current Bid: Rs {currentBid}
        </p>
      </Link>
      <div className="flex mt-2 space-x-2">
        <input
          type="number"
          value={bidInput}
          onChange={(e) => setBidInput(e.target.value)}
          placeholder="Enter your bid"
          className="w-full border px-2 py-1 rounded"
        />
        <button
          onClick={handlePlaceBid}
          className="bg-[#88B04B] text-white px-4 py-1 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
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
    <>
      <div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-20 my-10">
          {currentProducts.map((product) => (
            <BiddingCard product={product} key={product.id} />
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          {/* {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-[#88B04B] text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))} */}

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
    </>
  );
};

export default Bidding;

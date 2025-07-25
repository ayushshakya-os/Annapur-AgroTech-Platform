// components/Bidding-Portal/Bidding.tsx
"use client";
import React, { useState } from "react";

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
  const [currentBid, setCurrentBid] = useState<number>(parseFloat(product.price) || 0);
  const [bidInput, setBidInput] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handlePlaceBid = () => {
    const newBid = parseFloat(bidInput);
    if (isNaN(newBid)) {
      setMessage("❌ Enter a valid number.");
      return;
    }

    if (newBid > currentBid) {
      setCurrentBid(newBid);
      setMessage("✅ Bid placed successfully!");
    } else {
      setMessage("❌ Bid must be higher than current bid.");
    }

    setBidInput("");
  };

  return (
    <div className="max-w-sm bg-white shadow-md rounded-lg p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
      <p className="text-sm text-gray-600">{product.short_description || product.description}</p>
      <p className="mt-2 text-blue-600 font-bold">Current Bid: Rs {currentBid}</p>
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
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Submit
        </button>
      </div>
      {message && <p className="text-center mt-2 text-sm">{message}</p>}
    </div>
  );
};

const Bidding: React.FC<Props> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 9;

  // Limit to first 72 products for ~8 pages
  const limitedProducts = products.slice(0, 72);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = limitedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(limitedProducts.length / productsPerPage);

  return (
    <div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentProducts.map((product) => (
          <BiddingCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Bidding;
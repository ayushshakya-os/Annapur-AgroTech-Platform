"use client";
import React, { useState } from "react";
import { showToast } from "../Toasts/toast";
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

const BiddingCard: React.FC<{ product: Product }> = ({ product }) => {
  const [currentBid, setCurrentBid] = useState<number>(
    parseFloat(product.price) || 0
  );
  const [bidInput, setBidInput] = useState<string>("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [lastBidder, setLastBidder] = useState<string | null>(null);

  // ✅ State to track broken images
  const [imageErrors, setImageErrors] = useState<{ [url: string]: boolean }>(
    {}
  );

  const getSafeImageSrc = (url: string) =>
    imageErrors[url] ? "/placeholder.png" : url;

  const handleImageError = (url: string) => {
    setImageErrors((prev) => ({ ...prev, [url]: true }));
  };

  const handlePlaceBid = () => {
    const newBid = parseFloat(bidInput);
    if (isNaN(newBid)) {
      showToast("error", "Please enter a valid bid amount.");
      return;
    }
    setIsPlacing(true);
    setTimeout(() => {
      if (newBid > currentBid) {
        setCurrentBid(newBid);
        setLastBidder("You");
        showToast("success", "Bid placed!");
      } else {
        showToast(
          "error",
          "Please enter a bid higher than the current highest bid."
        );
      }
      setBidInput("");
      setIsPlacing(false);
    }, 500);
  };

  return (
    <div className="relative w-full bg-white shadow-lg rounded-xl p-4 border hover:shadow-2xl transition group">
      <Link
        href={`/bidding-portal/${product.id}`}
        key={product.id}
        className="block"
      >
        <div className="relative">
          {/* Optional "New" badge */}
          <span className="absolute top-2 left-2 bg-yellow-400 rounded px-2 text-xs z-10">
            New
          </span>
          <img
            src={getSafeImageSrc(product.image)}
            onError={() => handleImageError(product.image)}
            alt={product.name}
            className="w-full h-56 object-cover rounded-lg transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          {/* Timer display removed */}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {product.short_description || product.description}
        </p>
        <p className="mt-2 text-[#88B04B] font-bold">
          Current Bid: Rs {currentBid}
        </p>
        {lastBidder && (
          <p className="text-xs text-gray-700 mt-1">
            Last Bidder: <span className="text-blue-600">{lastBidder}</span>
          </p>
        )}
      </Link>
      <div className="flex mt-2 space-x-2">
        <input
          type="number"
          value={bidInput}
          onChange={(e) => setBidInput(e.target.value)}
          placeholder="Enter your bid"
          className={`w-full border px-2 py-1 rounded ${
            isPlacing ? "cursor-not-allowed opacity-70" : ""
          }`}
          disabled={isPlacing}
          min={currentBid + 1}
        />
        <button
          onClick={handlePlaceBid}
          className={`bg-[#88B04B] text-white px-4 py-1 rounded hover:bg-[#6d9837] transition-colors duration-150 ${
            isPlacing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isPlacing}
        >
          {isPlacing ? "Submitting..." : "Submit"}
        </button>
      </div>
      {/* Optional Quick Bid Buttons */}
      <div className="flex gap-2 mt-2">
        {[10, 50, 100].map((amount) => (
          <button
            key={amount}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            disabled={isPlacing}
            onClick={() => setBidInput((currentBid + amount).toString())}
            type="button"
          >
            +{amount}
          </button>
        ))}
      </div>
      {/* Timer overlay removed */}
    </div>
  );
};

export default BiddingCard;

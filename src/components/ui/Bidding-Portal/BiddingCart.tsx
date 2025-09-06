"use client";
import React, { useEffect, useState } from "react";
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

const AUCTION_TIME = 2 * 60; // 2 minutes per item (demo)

const BiddingCard: React.FC<{ product: Product }> = ({ product }) => {
  const [currentBid, setCurrentBid] = useState<number>(
    parseFloat(product.price) || 0
  );
  const [bidInput, setBidInput] = useState<string>("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [timer, setTimer] = useState<number>(AUCTION_TIME);
  const [lastBidder, setLastBidder] = useState<string | null>(null);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handlePlaceBid = () => {
    if (timer <= 0) {
      showToast("error", "Auction ended.");
      return;
    }
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

  const mins = Math.floor(timer / 60);
  const secs = timer % 60;
  const formattedTime =
    timer <= 0
      ? "Auction Ended"
      : `${mins}:${secs.toString().padStart(2, "0")}`;

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
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover rounded-lg transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <span className="bg-green-100 text-[#88B04B] px-3 py-1 rounded text-sm font-bold">
            {formattedTime}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {product.short_description || product.description}
        </p>
        <p className="mt-2 text-[#88B04B] font-bold">
          Current Bid: Rs {currentBid}
        </p>
        {lastBidder && timer > 0 && (
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
            timer <= 0 ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          disabled={timer <= 0 || isPlacing}
          min={currentBid + 1}
        />
        <button
          onClick={handlePlaceBid}
          className={`bg-[#88B04B] text-white px-4 py-1 rounded hover:bg-[#6d9837] transition-colors duration-150 ${
            timer <= 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={timer <= 0 || isPlacing}
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
            disabled={timer <= 0 || isPlacing}
            onClick={() => setBidInput((currentBid + amount).toString())}
            type="button"
          >
            +{amount}
          </button>
        ))}
      </div>
      {timer <= 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center text-red-500 text-lg font-bold pointer-events-none">
          Auction Ended
        </div>
      )}
    </div>
  );
};

export default BiddingCard;

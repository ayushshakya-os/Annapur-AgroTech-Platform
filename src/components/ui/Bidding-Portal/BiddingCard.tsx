"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { showToast } from "../Toasts/toast";
import { useCreateNegotiation } from "@/hooks/api/Bidding/useCreateNegotiation";
import { usePlaceBid } from "@/hooks/api/Bidding/Buyer/usePlaceBid";
import { useGetBidsForProduct } from "@/hooks/api/Bidding/useGetAllBids";
import { useNegotiationSocket } from "@/hooks/api/Socket/useNegotiationSocket";
import type { Bid } from "@/lib/types/Bidding";

export type Product = {
  id: string | number;
  name: string;
  description: string;
  image: string;
  price: string;
  short_description?: string;
  category?: string;
  // Prefer to have _id here if id is not Mongo ObjectId
  // _id?: string;
};

const BiddingCardWithApi: React.FC<{ product: Product }> = ({ product }) => {
  // IMPORTANT: Ensure this is the MongoDB ObjectId string
  const productId = String(product.id);
  // If your product has _id, prefer: const productId = String(product._id);

  const basePrice = useMemo(() => {
    const p = parseFloat(product.price);
    return Number.isFinite(p) ? p : 0;
  }, [product.price]);

  const [currentBid, setCurrentBid] = useState<number>(basePrice);
  const [bidInput, setBidInput] = useState<string>("");
  const [lastBidder, setLastBidder] = useState<string | null>(null);
  const [negotiationId, setNegotiationId] = useState<string | null>(null);

  const [imageErrors, setImageErrors] = useState<{ [url: string]: boolean }>(
    {}
  );
  const getSafeImageSrc = (url: string) =>
    imageErrors[url] ? "/placeholder.png" : url;
  const handleImageError = (url: string) =>
    setImageErrors((prev) => ({ ...prev, [url]: true }));

  // Queries
  const { data: bidsResp } = useGetBidsForProduct(productId);
  const createNegotiation = useCreateNegotiation();
  const placeBid = usePlaceBid({ productId });

  const highestBid: Bid | null =
    bidsResp?.bids && bidsResp.bids.length
      ? bidsResp.bids.reduce(
          (max, b) => (b.offeredPrice > max.offeredPrice ? b : max),
          bidsResp.bids[0]
        )
      : null;

  useEffect(() => {
    setCurrentBid(highestBid ? highestBid.offeredPrice : basePrice);
  }, [highestBid, basePrice]);

  useNegotiationSocket({
    negotiationId,
    productId,
    onBidNotification: (payload) => {
      if (payload?.message) showToast("info", payload.message);
    },
  });

  const handlePlaceBid = async () => {
    const newBid = parseFloat(bidInput);
    if (isNaN(newBid)) {
      showToast("error", "Please enter a valid bid amount.");
      return;
    }
    if (newBid <= currentBid) {
      showToast(
        "error",
        "Please enter a bid higher than the current highest bid."
      );
      return;
    }

    // Optional: guard that productId looks like a Mongo ObjectId
    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
      showToast(
        "error",
        "Invalid product identifier. Please refresh and try again."
      );
      return;
    }

    try {
      const res = await createNegotiation.mutateAsync({ productId });
      if (!res?.success || !res.negotiation?._id) {
        throw new Error(
          res?.error || res?.msg || "Failed to start negotiation"
        );
      }

      const negoId = res.negotiation._id;
      setNegotiationId(negoId);

      // Include productId to satisfy backend validator
      const bidRes = await placeBid.mutateAsync({
        negotiationId: negoId,
        offeredPrice: newBid,
        productId,
      });

      if (!bidRes.success || !bidRes.bid) {
        throw new Error(bidRes.error || "Failed to place bid");
      }

      setLastBidder("You");
      setBidInput("");
      setCurrentBid(bidRes.bid.offeredPrice);
      showToast("success", "Bid placed!");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Something went wrong while placing your bid.";
      showToast("error", msg);
    }
  };

  const isPlacing = createNegotiation.isPending || placeBid.isPending;

  return (
    <div className="relative w-full bg-white shadow-lg rounded-xl p-4 border hover:shadow-2xl transition group">
      <Link
        href={`/bidding-portal/${product.id}`}
        key={String(product.id)}
        className="block"
      >
        <div className="relative">
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
          placeholder={`Enter your bid (min ${currentBid + 1})`}
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
          type="button"
        >
          {isPlacing ? "Submitting..." : "Submit"}
        </button>
      </div>

      <div className="flex gap-2 mt-2">
        {[10, 50, 100].map((amount) => (
          <button
            key={amount}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            disabled={isPlacing}
            onClick={() => setBidInput(String(currentBid + amount))}
            type="button"
          >
            +{amount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BiddingCardWithApi;

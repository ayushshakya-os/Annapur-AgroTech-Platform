"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { showToast } from "@/components/ui/Toasts/toast";
import { showAuthToast } from "../Toasts/ToastMessage";
import { useAuth } from "@/hooks/auth/useAuth";

// API hooks (AxiosWrapper-based)
import { useCreateNegotiation } from "@/hooks/api/Bidding/useCreateNegotiation";
import { usePlaceBid } from "@/hooks/api/Bidding/Buyer/usePlaceBid";
import { useGetBidsForProduct } from "@/hooks/api/Bidding/useGetAllBids";
import { useNegotiationSocket } from "@/hooks/api/Socket/useNegotiationSocket";

export type Product = {
  // IMPORTANT: This should be the MongoDB ObjectId string of the product.
  // If your product prop uses `_id`, prefer that instead of `id`.
  id: string | number;
  name: string;
  description: string;
  image: string;
  price: string;
  short_description?: string;
  category?: string;
};

const BiddingDetail = ({ product }: { product: Product }) => {
  // Ensure we're using the MongoDB ObjectId string
  const productId = String(product.id);
  const { user } = useAuth();

  // Base price from product
  const basePrice = useMemo(() => {
    const p = parseFloat(product.price);
    return Number.isFinite(p) ? p : 0;
  }, [product.price]);

  // Local UI state
  const [bidInput, setBidInput] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [negotiationId, setNegotiationId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [url: string]: boolean }>(
    {}
  );

  const getSafeImageSrc = (url: string) =>
    imageErrors[url] ? "/placeholder.png" : url;
  const handleImageError = (url: string) =>
    setImageErrors((prev) => ({ ...prev, [url]: true }));

  // Backend data
  const { data: bidsResp } = useGetBidsForProduct(productId);
  const createNegotiation = useCreateNegotiation();
  const placeBid = usePlaceBid({ productId });

  // Highest bid from server; fall back to base price
  const currentBid = useMemo(() => {
    const bids = bidsResp?.bids ?? [];
    if (!bids.length) return basePrice;
    return bids.reduce(
      (max, b) => (b.offeredPrice > max ? b.offeredPrice : max),
      bids[0].offeredPrice
    );
  }, [bidsResp?.bids, basePrice]);

  // Real-time via Socket.IO once a negotiation exists
  useNegotiationSocket({
    negotiationId,
    productId,
    onBidNotification: (payload) => {
      if (payload?.message) showToast("info", payload.message);
    },
  });

  // Helper to display bidding history using server bids
  const myUserId = (user as any)?._id || (user as any)?.id || "";
  const displayBids = useMemo(() => {
    const bids = bidsResp?.bids ?? [];
    return bids.map((b) => {
      const isMine = myUserId && String(b.buyerId) === String(myUserId);
      return {
        userLabel: isMine ? user?.fullName || "You" : "Buyer",
        amount: b.offeredPrice,
        time: new Date(b.createdAt).toLocaleString(),
        isMine,
        _id: b._id,
      };
    });
  }, [bidsResp?.bids, myUserId, user?.fullName]);

  const handlePlaceBid = async () => {
    setInputError(null);

    const newBid = parseFloat(bidInput);
    if (isNaN(newBid) || newBid <= currentBid) {
      const msg = "Please enter a valid bid higher than current.";
      setInputError(msg);
      showToast("error", msg);
      return;
    }

    // Optional guard to ensure productId looks like a Mongo ObjectId
    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
      showToast(
        "error",
        "Invalid product identifier. Please refresh and try again."
      );
      return;
    }

    try {
      setIsPlacing(true);

      // Ensure an active negotiation exists for buyer+product
      const negoRes = await createNegotiation.mutateAsync({ productId });
      if (!negoRes?.success || !negoRes.negotiation?._id) {
        throw new Error(
          negoRes?.error || negoRes?.msg || "Failed to start negotiation"
        );
      }
      const negoId = negoRes.negotiation._id;
      setNegotiationId(negoId);

      // Place bid — include productId to satisfy backend validator
      const bidRes = await placeBid.mutateAsync({
        negotiationId: negoId,
        offeredPrice: newBid,
        productId,
      });

      if (!bidRes.success || !bidRes.bid) {
        throw new Error(bidRes.error || "Failed to place bid");
      }

      setBidInput("");
      showToast("success", "Bid placed successfully.");
      showAuthToast("bid-placed");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Something went wrong while placing your bid.";
      showToast("error", msg);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div>
      <Link
        href="/bidding-portal"
        className="text-[#88B04B] ml-2 md:ml-20 mb-4 inline-block hover:underline"
      >
        <ChevronLeft className="inline-block mb-1" />
        Back to Bidding Portal
      </Link>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-0 md:p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center p-4">
          <div className="relative w-full group">
            <img
              src={getSafeImageSrc(product.image)}
              onError={() => handleImageError(product.image)}
              className="w-full max-h-80 object-cover rounded-lg border shadow-md group-hover:scale-105 transition"
              alt={product.name}
            />
            <span className="absolute top-3 left-3 bg-yellow-400 text-xs px-3 py-1 rounded font-semibold shadow z-10">
              {product.category || "Auction"}
            </span>
          </div>
          <h1 className="text-3xl font-bold mt-6 mb-1 text-center">
            {product.name}
          </h1>
          <p className="text-gray-600 text-base text-center">
            {product.short_description || product.description}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4">
          <div className="bg-gray-50 p-5 rounded-xl shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">Current Bid:</span>
              <span className="text-2xl text-[#88B04B] font-bold">
                Rs {currentBid}
              </span>
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="number"
                value={bidInput}
                min={currentBid + 1}
                step="1"
                onChange={(e) => setBidInput(e.target.value)}
                className={`border px-3 py-2 rounded w-full shadow-inner focus:ring-2 focus:ring-[#88B04B] ${
                  inputError ? "border-red-400" : ""
                }`}
                placeholder={`Bid at least Rs ${currentBid + 1}`}
                disabled={isPlacing}
                aria-label="Your bid"
              />
              <button
                onClick={handlePlaceBid}
                className="bg-[#88B04B] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#6d9837] transition-colors duration-150 disabled:opacity-60"
                disabled={isPlacing}
                aria-label="Place Bid"
                type="button"
              >
                {isPlacing ? "Placing..." : "Place Bid"}
              </button>
            </div>

            {inputError && (
              <p className="text-xs text-red-500 mt-1">{inputError}</p>
            )}

            <div className="flex gap-2 mt-2">
              {[10, 50, 100].map((inc) => (
                <button
                  key={inc}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  onClick={() => setBidInput(String(currentBid + inc))}
                  disabled={isPlacing}
                  type="button"
                >
                  +{inc}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>Bidding History</span>
              <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs">
                {bidsResp?.bids?.length ?? 0}
              </span>
            </h2>

            <ul className="space-y-2 max-h-64 overflow-auto">
              {!displayBids || displayBids.length === 0 ? (
                <li className="text-sm text-gray-500">
                  No bids yet. Be the first!
                </li>
              ) : (
                displayBids.map((b) => (
                  <li
                    key={b._id}
                    className={`text-sm border-b pb-2 flex items-center gap-2 animate-fade-in-down ${
                      b.isMine ? "bg-[#e9f8e4] font-semibold" : ""
                    }`}
                  >
                    <span className="text-[#88B04B]">{b.userLabel}</span>
                    <span>bid</span>
                    <span className="font-bold text-[#88B04B]">
                      Rs {b.amount}
                    </span>
                    <span className="ml-auto text-gray-400 text-xs">
                      {b.time}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.4s;
        }
      `}</style>
    </div>
  );
};

export default BiddingDetail;

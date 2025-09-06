"use client";
import { useState } from "react";
import { showToast } from "@/components/ui/Toasts/toast";
import { showAuthToast } from "../Toasts/ToastMessage";
import { useAuth } from "@/hooks/auth/useAuth";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  short_description?: string;
  category?: string;
};

type Bid = { user: string; amount: number; time: string };

const BiddingDetail = ({ product }: { product: Product }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidInput, setBidInput] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const { user } = useAuth();

  const currentBid =
    bids.length > 0 ? bids[0].amount : parseFloat(product.price);

  const handlePlaceBid = () => {
    setInputError(null);
    const newBid = parseFloat(bidInput);
    if (isNaN(newBid) || newBid <= currentBid) {
      setInputError("Please enter a valid bid higher than current.");
      showToast("error", "Please enter a valid bid higher than current.");
      return;
    }

    setIsPlacing(true);
    setTimeout(() => {
      const newBidEntry: Bid = {
        user: user?.fullName || "Guest",
        amount: newBid,
        time: new Date().toLocaleString(),
      };
      setBids([newBidEntry, ...bids]);
      setBidInput("");
      setIsPlacing(false);
      showToast("success", "Bid placed successfully.");
      showAuthToast("bid-placed");
    }, 600);
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
              src={product.image}
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
                className={`bg-[#88B04B] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#6d9837] transition-colors duration-150 disabled:opacity-60`}
                disabled={isPlacing}
                aria-label="Place Bid"
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
                  onClick={() => setBidInput((currentBid + inc).toString())}
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
                {bids.length}
              </span>
            </h2>
            <ul className="space-y-2 max-h-64 overflow-auto">
              {bids.length === 0 ? (
                <li className="text-sm text-gray-500">
                  No bids yet. Be the first!
                </li>
              ) : (
                bids.map((b, i) => (
                  <li
                    key={i}
                    className={`text-sm border-b pb-2 flex items-center gap-2 animate-fade-in-down ${
                      b.user === (user?.fullName || "Guest")
                        ? "bg-[#e9f8e4] font-semibold"
                        : ""
                    }`}
                  >
                    <span className="text-[#88B04B]">{b.user}</span>
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
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.4s;
        }
      `}</style>
    </div>
  );
};

export default BiddingDetail;

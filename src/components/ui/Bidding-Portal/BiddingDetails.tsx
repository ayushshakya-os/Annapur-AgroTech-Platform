// components/Bidding-Portal/BiddingDetail.tsx
"use client";
import { useState } from "react";
import { showToast } from "@/components/ui/Toasts/toast";
import { showAuthToast } from "../Toasts/ToastMessage";
import { useAuth } from "@/hooks/auth/useAuth";

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
  const { user } = useAuth();

  const currentBid =
    bids.length > 0 ? bids[0].amount : parseFloat(product.price);

  const handlePlaceBid = () => {
    const newBid = parseFloat(bidInput);
    if (isNaN(newBid) || newBid <= currentBid) {
      showToast("error", "Please enter a valid bid higher than current.");
      return;
    }

    const newBidEntry: Bid = {
      user: user?.firstName || "Guest",
      amount: newBid,
      time: new Date().toLocaleString(),
    };

    setBids([newBidEntry, ...bids]);
    setBidInput("");
    showToast("success", "Bid placed successfully.");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <img src={product.image} className="w-full h-64 object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>

      <div className="mt-4">
        <p className="font-bold text-[#88B04B]">Current Bid: Rs {currentBid}</p>
        <div className="flex mt-2 space-x-2">
          <input
            type="number"
            value={bidInput}
            onChange={(e) => setBidInput(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            placeholder="Your bid"
          />
          <button
            onClick={handlePlaceBid}
            className="bg-[#88B04B] text-white px-4 py-1 rounded"
          >
            Place Bid
          </button>
        </div>
      </div>

      <h2 className="mt-6 text-lg font-semibold">Bidding History</h2>
      <ul className="mt-2 space-y-2">
        {bids.length === 0 ? (
          <p className="text-sm text-gray-500">No bids yet.</p>
        ) : (
          bids.map((b, i) => (
            <li key={i} className="text-sm text-gray-700 border-b pb-2">
              <strong>{b.user}</strong> bid Rs {b.amount} on {b.time}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BiddingDetail;

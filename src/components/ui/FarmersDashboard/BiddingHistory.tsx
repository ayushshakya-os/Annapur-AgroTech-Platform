"use client";

import type { Bid } from "../../../lib/types/type";

export default function BidHistory({ bids }: { bids: Bid[] }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-800">Bid History</h3>
        <p className="text-sm text-gray-600">
          Accepted and rejected bids are listed here for your records.
        </p>
      </div>

      <ul className="divide-y">
        {bids.length === 0 && (
          <li className="p-6 text-center text-gray-500">No history yet.</li>
        )}
        {bids.map((b) => (
          <li key={b._id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm text-gray-600">
                  Product:{" "}
                  <span className="font-medium text-gray-800">
                    {b.productName || b.productId}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Buyer:{" "}
                  <span className="font-medium text-gray-800">
                    {b.buyerName || b.buyerId}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(b.createdAt || 0).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-700">
                  Final Price:{" "}
                  <span className="font-semibold">
                    Rs. {b.offeredPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center mt-1 rounded px-2 py-1 text-xs border ${
                      b.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

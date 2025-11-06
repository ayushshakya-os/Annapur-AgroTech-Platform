"use client";

import { useMemo, useState } from "react";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import clsx from "clsx";
import type { Bid, BidStatus } from "./../../../lib/types/type";

const uid = (p = "id") =>
  `${p}_${Math.random().toString(36).slice(2, 8)}${Date.now()}`;

export default function BiddingList() {
  // Demo data — replace with your API data
  const [bids, setBids] = useState<Bid[]>([
    {
      _id: uid("bid"),
      productId: uid("prod"),
      productName: "Organic Tomatoes",
      buyerId: "me",
      buyerName: "You",
      initialPrice: 120,
      offeredPrice: 115,
      negotiationId: uid("neg"),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      _id: uid("bid"),
      productId: uid("prod"),
      productName: "Golden Wheat",
      buyerId: "me",
      buyerName: "You",
      initialPrice: 55,
      offeredPrice: 52,
      negotiationId: uid("neg"),
      status: "countered",
      createdAt: new Date().toISOString(),
    },
    {
      _id: uid("bid"),
      productId: uid("prod"),
      productName: "Raw Honey",
      buyerId: "me",
      buyerName: "You",
      initialPrice: 380,
      offeredPrice: 370,
      negotiationId: uid("neg"),
      status: "accepted",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [activeTab, setActiveTab] = useState<BidStatus>("pending");
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [offerValue, setOfferValue] = useState<number | "">("");

  const tabs: { key: BidStatus; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "countered", label: "Countered" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
  ];

  const filtered = useMemo(
    () =>
      bids
        .filter((b) => b.status === activeTab)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        ),
    [bids, activeTab]
  );

  // Handlers — UI only for now. Replace with your backend calls later.
  // - Place/update offer: POST /api/bids { negotiationId, offeredPrice }
  // - Accept farmer counter (buyer): POST /api/bids/:id/accept-buyer
  function updateOffer(bidId: string, offeredPrice: number) {
    setBids((prev) =>
      prev.map((b) =>
        b._id === bidId
          ? {
              ...b,
              offeredPrice,
              status: "pending", // buyer re-offered; now awaiting farmer response
            }
          : b
      )
    );
  }

  function acceptCounter(bidId: string) {
    setBids((prev) =>
      prev.map((b) => (b._id === bidId ? { ...b, status: "accepted" } : b))
    );
  }

  function openEdit(bid: Bid) {
    setEditingBid(bid);
    setOfferValue(bid.offeredPrice);
  }

  function closeEdit() {
    setEditingBid(null);
    setOfferValue("");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b bg-gradient-to-r from-emerald-50 to-emerald-100">
          <h3 className="font-semibold text-gray-800">Bidding List</h3>
          <p className="text-sm text-gray-600">
            Review your bids, update your offers, or accept counter-offers from
            farmers.
          </p>
        </div>

        <div className="px-5 py-3 border-b bg-white">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition",
                  activeTab === t.key
                    ? "bg-[#88B04B] text-white"
                    : "bg-white border text-gray-700 hover:bg-gray-50"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No bids in this tab.
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b._id}
                className="p-5 flex flex-col gap-4 md:flex-row md:items-center"
              >
                {/* Product name + time */}
                <div className="md:w-1/3">
                  <div className="font-medium text-gray-800">
                    {b.productName || b.productId}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(b.createdAt || 0).toLocaleString()}
                  </div>
                </div>

                {/* Offer details */}
                <div className="md:flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-700">
                      Initial:{" "}
                      <span className="font-semibold">
                        Rs. {b.initialPrice.toFixed(2)}
                      </span>
                    </span>
                    <span className="text-gray-700">
                      Latest offer:{" "}
                      <span className="font-semibold">
                        Rs. {b.offeredPrice.toFixed(2)}
                      </span>
                    </span>
                    <span
                      className={clsx(
                        "inline-flex items-center rounded px-2 py-0.5 text-xs border",
                        b.status === "accepted"
                          ? "bg-emerald-50 text-[#88B04B] border-emerald-200"
                          : b.status === "countered"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : b.status === "pending"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      )}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {b.status === "pending" && (
                    <button
                      onClick={() => openEdit(b)}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-50"
                      title="Update your offer"
                    >
                      <FiEdit /> Update Offer
                    </button>
                  )}

                  {b.status === "countered" && (
                    <>
                      <button
                        onClick={() => acceptCounter(b._id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#88B04B] px-3 py-2 text-white hover:bg-[#88B04B]/80"
                        title="Accept farmer's counter-offer"
                      >
                        <FiCheck /> Accept Counter
                      </button>
                      <button
                        onClick={() => openEdit(b)}
                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-50"
                        title="Send a new offer"
                      >
                        <FiEdit /> New Offer
                      </button>
                    </>
                  )}

                  {(b.status === "accepted" || b.status === "rejected") && (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-gray-400 cursor-not-allowed"
                      title="Negotiation closed"
                    >
                      <FiX /> Closed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {editingBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={closeEdit}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border p-6">
            <h4 className="text-lg font-semibold text-gray-800">
              Update Your Offer
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              Product:{" "}
              <span className="font-medium">
                {editingBid.productName || editingBid.productId}
              </span>
            </p>
            <div className="mt-4">
              <label className="text-sm text-gray-600">Your Offer (Rs.)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={offerValue}
                onChange={(e) =>
                  setOfferValue(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder={`e.g., ${editingBid.offeredPrice.toFixed(2)}`}
              />
              <p className="mt-2 text-xs text-gray-500">
                Initial price: Rs. {editingBid.initialPrice.toFixed(2)}
              </p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={offerValue === "" || Number(offerValue) <= 0}
                onClick={() => {
                  if (offerValue !== "" && Number(offerValue) > 0) {
                    // Real app: POST /api/bids with { negotiationId, offeredPrice }
                    updateOffer(editingBid._id, Number(offerValue));
                    closeEdit();
                  }
                }}
                className="rounded-lg bg-[#88B04B] px-4 py-2 text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

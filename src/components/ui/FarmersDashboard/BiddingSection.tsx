"use client";

import { useMemo, useState } from "react";
import type { Bid, Product } from "../../../lib/types/type";

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "countered", label: "Countered" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function BiddingSection({
  products,
  bidsByProduct,
  selectedProductId,
  setSelectedProductId,
  onAccept,
  onReject,
  onCounter,
}: {
  products: Product[];
  bidsByProduct: Record<string, Bid[]>;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
  onCounter: (bidId: string, price: number) => void;
}) {
  const [active, setActive] = useState<TabKey>("pending");
  const [counterFor, setCounterFor] = useState<string | null>(null);
  const [counterValue, setCounterValue] = useState<number | "">("");

  const productOptions = useMemo(
    () => [{ _id: "all", name: "All Products" }, ...products],
    [products]
  );

  const filteredBids = useMemo(() => {
    const ids =
      selectedProductId === "all"
        ? products.map((p) => p._id)
        : [selectedProductId];
    let all: Bid[] = [];
    for (const pid of ids) all = all.concat(bidsByProduct[pid] || []);
    return all
      .filter((b) => b.status === active)
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, [products, bidsByProduct, selectedProductId, active]);

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                active === t.key
                  ? "bg-[#88B04B] text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          <select
            className="rounded-lg border px-3 py-2 text-sm text-gray-700"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            {productOptions.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divide-y">
        {filteredBids.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No bids in this tab.
          </div>
        ) : (
          filteredBids.map((b) => (
            <div
              key={b._id}
              className="p-5 flex flex-col gap-2 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-500">Product</span>
                  <span className="font-medium text-gray-800">
                    {b.productName || b.productId}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">Buyer</span>
                  <span className="font-medium text-gray-800">
                    {b.buyerName || b.buyerId}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-sm">
                  <span className="text-gray-700">
                    Initial:{" "}
                    <span className="font-semibold">
                      Rs. {b.initialPrice.toFixed(2)}
                    </span>
                  </span>
                  <span className="text-gray-700">
                    Offered:{" "}
                    <span className="font-semibold">
                      Rs. {b.offeredPrice.toFixed(2)}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(b.createdAt || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {active === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(b._id)}
                    className="rounded-lg bg-[#88B04B] px-3 py-2 text-white hover:bg-emerald-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setCounterFor(b._id)}
                    className="rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Counter
                  </button>
                  <button
                    onClick={() => onReject(b._id)}
                    className="rounded-lg border border-rose-200 px-3 py-2 text-rose-600 hover:bg-rose-50"
                  >
                    Reject
                  </button>
                </div>
              )}

              {active !== "pending" && (
                <div className="text-sm">
                  <span
                    className={`inline-flex items-center rounded px-2 py-1 border ${
                      b.status === "accepted"
                        ? "bg-emerald-50 text-[#88B04B] border-emerald-200"
                        : b.status === "countered"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </div>
              )}

              {counterFor === b._id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                    onClick={() => {
                      setCounterFor(null);
                      setCounterValue("");
                    }}
                  />
                  <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border p-6">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Counter Offer
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Set a counter price for this bid.
                    </p>
                    <div className="mt-4">
                      <label className="text-sm text-gray-600">
                        Counter Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#88B04B] focus:border-transparent"
                        value={counterValue}
                        onChange={(e) =>
                          setCounterValue(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        placeholder={`e.g., ${b.offeredPrice.toFixed(2)}`}
                      />
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setCounterFor(null);
                          setCounterValue("");
                        }}
                        className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={
                          counterValue === "" || Number(counterValue) <= 0
                        }
                        onClick={() => {
                          if (counterValue !== "" && Number(counterValue) > 0) {
                            onCounter(b._id, Number(counterValue));
                            setCounterFor(null);
                            setCounterValue("");
                          }
                        }}
                        className="rounded-lg bg-[#88B04B] px-4 py-2 text-white hover:bg-[#7a9e44] "
                      >
                        Send Counter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

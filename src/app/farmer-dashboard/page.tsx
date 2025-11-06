"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/ui/FarmersDashboard/Sidebar";
import AddProductForm from "../../components/ui/FarmersDashboard/AddProductForm";
import ProductsTable from "../../components/ui/FarmersDashboard/ProductsTable";
import BiddingSection from "../../components/ui/FarmersDashboard/BiddingSection";
import BidHistory from "./../../components/ui/FarmersDashboard/BiddingHistory";
import type { Bid, Product } from "../../lib/types/type";
import { Leaf, Plus } from "lucide-react";

// Hooks
import { useAddProduct } from "@/hooks/api/FarmersDashboard/useAddProducts";
import type { AddProductFormData } from "@/lib/validation/addProductSchema";
import {
  useGetFarmersProducts,
  type MyProductsParams,
} from "@/hooks/api/FarmersDashboard/useGetFarmersProducts";

// New: hook to fetch authenticated user's bids
import { useGetMyBids } from "@/hooks/api/Bidding/useGetMyBids";

type Tab = "products" | "add-product" | "bidding" | "history";

// Helper for demo IDs (still used for demo bids)
const uid = (p = "id") =>
  `${p}_${Math.random().toString(36).slice(2, 8)}${Date.now()}`;

/**
 * Convert a possibly-populated productId into a stable string id.
 * productId from the backend may be either a string or a populated object.
 */
const getProductIdString = (productId: any) => {
  if (!productId) return uid("prod");
  if (typeof productId === "string") return productId;
  if (typeof productId === "object") {
    return String(productId._id ?? productId.id ?? JSON.stringify(productId));
  }
  return String(productId);
};

/**
 * Safely derive a full name string from a possibly-populated user object
 * or a plain string id.
 */
const getUserDisplayName = (userOrId: any) => {
  if (!userOrId) return "";
  if (typeof userOrId === "string") return userOrId;
  if (typeof userOrId === "object") {
    const first = userOrId.firstName ?? userOrId.first_name ?? "";
    const last = userOrId.lastName ?? userOrId.last_name ?? "";
    const email = userOrId.email ?? "";
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (email) return email;
    if (userOrId._id) return String(userOrId._id);
    try {
      return JSON.stringify(userOrId);
    } catch {
      return String(userOrId);
    }
  }
  return String(userOrId);
};

export default function FarmerDashboardPage() {
  const [tab, setTab] = useState<Tab>("products");

  // Fetch farmer's products from API
  const params: MyProductsParams = { page: 1, limit: 50, sort: "newest" };
  const {
    data: myProducts,
    isPending: isProductsPending,
    error: productsError,
    refetch: refetchProducts,
  } = useGetFarmersProducts(params);

  const products: Product[] = myProducts?.products ?? [];

  // Bids grouped by productId
  // Previously this was purely local/demo; now we will populate it from useGetMyBids
  const [bidsByProduct, setBidsByProduct] = useState<Record<string, Bid[]>>({});

  const [selectedProductId, setSelectedProductId] = useState<string>("all");

  // Fetch bids for authenticated user (farmer role)
  const {
    data: bidsData,
    isLoading: isBidsLoading,
    isError: isBidsError,
    error: bidsError,
    refetch: refetchBids,
  } = useGetMyBids(
    {
      role: "farmer",
      page: 1,
      limit: 200,
      sort: "-createdAt",
    },
    {
      staleTime: 5_000,
    }
  );

  // Normalize and group incoming bids by product id when the hook returns.
  useEffect(() => {
    if (!bidsData?.bids || !Array.isArray(bidsData.bids)) return;

    const next: Record<string, Bid[]> = {};

    for (const raw of bidsData.bids) {
      // Defensive normalisation for numeric fields and dates:
      const normalized: Bid = {
        ...raw,
        initialPrice:
          typeof raw.initialPrice === "number"
            ? raw.initialPrice
            : Number(raw.initialPrice ?? 0),
        offeredPrice:
          typeof raw.offeredPrice === "number"
            ? raw.offeredPrice
            : Number(raw.offeredPrice ?? 0),
        createdAt: raw.createdAt
          ? String(raw.createdAt)
          : new Date().toISOString(),
        // Ensure productName isn't an object (some components rely on productName)
        productName:
          raw.productName ??
          (raw.productId && typeof raw.productId === "object"
            ? typeof (raw.productId as any).name === "string"
              ? (raw.productId as any).name
              : String((raw.productId as any)._id ?? "")
            : undefined),
        // New: ensure buyerName/farmerName are strings so components don't render objects
        buyerName:
          raw.buyerName ??
          (raw.buyerId ? getUserDisplayName(raw.buyerId) : undefined),
        farmerName:
          raw.farmerName ??
          (raw.farmerId ? getUserDisplayName(raw.farmerId) : undefined),
        // Also coerce buyerId/farmerId to stable string ids if needed for lookups
        buyerId:
          raw.buyerId && typeof raw.buyerId === "object"
            ? String((raw.buyerId as any)._id ?? (raw.buyerId as any).id ?? "")
            : raw.buyerId,
        farmerId:
          raw.farmerId && typeof raw.farmerId === "object"
            ? String(
                (raw.farmerId as any)._id ?? (raw.farmerId as any).id ?? ""
              )
            : raw.farmerId,
      } as Bid;

      const pid = getProductIdString(raw.productId);
      next[pid] = next[pid] || [];
      next[pid].push(normalized);
    }

    setBidsByProduct(next);
  }, [bidsData?.bids]);

  const flatBids = useMemo(() => {
    const ids =
      selectedProductId === "all"
        ? products.map((p) => p._id)
        : [selectedProductId];
    let all: Bid[] = [];
    for (const pid of ids) all = all.concat(bidsByProduct[pid] || []);
    return all.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  }, [bidsByProduct, products, selectedProductId]);

  const bidHistory = useMemo(
    () =>
      flatBids.filter(
        (b) => b.status === "accepted" || b.status === "rejected"
      ),
    [flatBids]
  );

  // Add product mutation
  const {
    mutateAsync: addProduct,
    isPending, // v5; if using v4 this is isLoading
    error,
  } = useAddProduct();

  // On submit, create then refetch list
  async function handleAddProduct(data: AddProductFormData) {
    try {
      await addProduct(data);
      await refetchProducts(); // ensure list is fresh
      setTab("products");
    } catch (e) {
      console.error(e);
    }
  }

  // Local-only toggle for UI (not persisted yet)
  function toggleBiddable(p: Product) {
    void refetchProducts();
  }

  // Farmer actions (optimistic local updates)
  function acceptBid(bidId: string) {
    setBidsByProduct((prev) => {
      const next = { ...prev };
      for (const pid of Object.keys(next)) {
        next[pid] = next[pid].map((b) =>
          b._id === bidId ? { ...b, status: "accepted" } : b
        );
      }
      return next;
    });

    // TODO: call backend endpoint (e.g., PUT /bids/:id/accept) and refetchBids() on success
  }

  function rejectBid(bidId: string) {
    setBidsByProduct((prev) => {
      const next = { ...prev };
      for (const pid of Object.keys(next)) {
        next[pid] = next[pid].map((b) =>
          b._id === bidId ? { ...b, status: "rejected" } : b
        );
      }
      return next;
    });

    // TODO: call backend endpoint (e.g., PUT /bids/:id/reject) and refetchBids() on success
  }

  function counterBid(bidId: string, price: number) {
    setBidsByProduct((prev) => {
      const next = { ...prev };
      for (const pid of Object.keys(next)) {
        next[pid] = next[pid].map((b) =>
          b._id === bidId
            ? { ...b, offeredPrice: price, status: "countered" }
            : b
        );
      }
      return next;
    });

    // TODO: call backend endpoint (e.g., PUT /bids/:id/counter) and refetchBids() on success
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <header className="relative  h-full border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6a8c3a] via-[#88b048] to-[#a5c66b] opacity-90" />
        <div className="relative mx-auto max-w-7xl px-6 py-10 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Leaf className="h-7 w-7" />
                <h1 className="text-2xl md:text-3xl font-semibold">
                  Farmers Dashboard
                </h1>
              </div>
              <p className="mt-1 text-white">
                Manage products and negotiations in one place.
              </p>
            </div>
            <div>
              <button
                onClick={() => setTab("add-product")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[#88B04B] shadow hover:bg-emerald-50"
              >
                <Plus className="h-5 w-5" /> Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <Sidebar active={tab} onSelect={(k) => setTab(k)} />

          <div className="space-y-6">
            {tab === "products" && (
              <>
                {productsError && (
                  <div className="rounded-md bg-red-50 text-red-700 p-3 text-sm">
                    {(productsError as Error).message}
                  </div>
                )}
                {isProductsPending ? (
                  <div className="rounded-xl border bg-white shadow-sm p-6 text-sm text-gray-600">
                    Loading your products...
                  </div>
                ) : (
                  <ProductsTable
                    products={products}
                    onToggleBiddable={toggleBiddable}
                  />
                )}
              </>
            )}

            {tab === "add-product" && (
              <div className="space-y-3">
                {/* Optional error/loading UI from the add hook */}
                {error && (
                  <p className="text-sm text-red-600">
                    {(error as Error).message}
                  </p>
                )}
                {isPending && (
                  <p className="text-sm text-gray-600">Adding product...</p>
                )}
                <AddProductForm onSubmit={handleAddProduct} />
              </div>
            )}

            {tab === "bidding" && (
              <>
                {/* Simple bids loading/error UIs */}
                {isBidsLoading && (
                  <div className="rounded-md bg-amber-50 text-amber-800 p-3 text-sm">
                    Loading bids...
                  </div>
                )}
                {isBidsError && (
                  <div className="rounded-md bg-red-50 text-red-700 p-3 text-sm">
                    {(bidsError as Error)?.message}
                    <div className="mt-2">
                      <button
                        onClick={() => void refetchBids()}
                        className="rounded-md border px-3 py-1 text-sm"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                <BiddingSection
                  products={products}
                  bidsByProduct={bidsByProduct}
                  selectedProductId={selectedProductId}
                  setSelectedProductId={setSelectedProductId}
                  onAccept={acceptBid}
                  onReject={rejectBid}
                  onCounter={counterBid}
                />
              </>
            )}

            {tab === "history" && <BidHistory bids={bidHistory} />}
          </div>
        </div>
      </main>
    </div>
  );
}

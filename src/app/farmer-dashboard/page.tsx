"use client";

import { useMemo, useState } from "react";
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

type Tab = "products" | "add-product" | "bidding" | "history";

// Helper for demo IDs (still used for demo bids)
const uid = (p = "id") =>
  `${p}_${Math.random().toString(36).slice(2, 8)}${Date.now()}`;

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

  // Demo bids data (independent of products; keep empty by default)
  const [bidsByProduct, setBidsByProduct] = useState<Record<string, Bid[]>>({});

  const [selectedProductId, setSelectedProductId] = useState<string>("all");

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
    // Since persistence isn't implemented here, just flip locally in the table view by mapping before render
    const next = products.map((x) =>
      x._id === p._id ? { ...x, isBiddable: !x.isBiddable } : x
    );
    // We don't keep local products state; to reflect UI immediately, you can optimistically mutate the query cache:
    // Optionally: import useQueryClient and setQueryData here, or keep as-is and implement toggle backend later.
    // For simplicity, we’ll request a refetch (cheap and consistent).
    // If you add a real PUT /products/:id later, call it then refetch.
    void refetchProducts();
  }

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
              <BiddingSection
                products={products}
                bidsByProduct={bidsByProduct}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                onAccept={acceptBid}
                onReject={rejectBid}
                onCounter={counterBid}
              />
            )}

            {tab === "history" && <BidHistory bids={bidHistory} />}
          </div>
        </div>
      </main>
    </div>
  );
}

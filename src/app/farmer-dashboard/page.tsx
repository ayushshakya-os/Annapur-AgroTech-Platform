"use client";

import { useMemo, useState } from "react";
import Sidebar from "../../components/ui/FarmersDashboard/Sidebar";
import AddProductForm from "../../components/ui/FarmersDashboard/AddProductForm";
import ProductsTable from "../../components/ui/FarmersDashboard/ProductsTable";
import BiddingSection from "../../components/ui/FarmersDashboard/BiddingSection";
import BidHistory from "./../../components/ui/FarmersDashboard/BiddingHistory";
import type { Bid, Product } from "../../lib/types/type";
import { Leaf, Plus } from "lucide-react";

type Tab = "products" | "add-product" | "bidding" | "history";

// Helper for demo IDs
const uid = (p = "id") =>
  `${p}_${Math.random().toString(36).slice(2, 8)}${Date.now()}`;

export default function FarmerDashboardPage() {
  const [tab, setTab] = useState<Tab>("products");

  // Demo data (UI-only)
  const [products, setProducts] = useState<Product[]>([
    {
      _id: uid("prod"),
      name: "Organic Tomatoes",
      category: "Vegetables",
      price: 120,
      short_description: "Fresh, vine-ripened, pesticide-free",
      image:
        "https://images.unsplash.com/photo-1546470427-0fd57e450d2b?q=80&w=1200&auto=format&fit=crop",
      isBiddable: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: uid("prod"),
      name: "Golden Wheat",
      category: "Grains",
      price: 55,
      short_description: "High-yield, premium quality wheat",
      image:
        "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?q=80&w=1200&auto=format&fit=crop",
      isBiddable: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [bidsByProduct, setBidsByProduct] = useState<Record<string, Bid[]>>(
    () => {
      const p1 = (products[0] && products[0]._id) || uid("prod");
      const p2 = (products[1] && products[1]._id) || uid("prod");
      const now = new Date().toISOString();

      return {
        [p1]: [
          {
            _id: uid("bid"),
            productId: p1,
            productName: "Organic Tomatoes",
            buyerId: "buyer_1",
            buyerName: "GreenGrocer Co.",
            initialPrice: 120,
            offeredPrice: 115,
            negotiationId: uid("neg"),
            status: "pending",
            createdAt: now,
          },
        ],
        [p2]: [
          {
            _id: uid("bid"),
            productId: p2,
            productName: "Golden Wheat",
            buyerId: "buyer_2",
            buyerName: "Bakers Hub",
            initialPrice: 55,
            offeredPrice: 50,
            negotiationId: uid("neg"),
            status: "pending",
            createdAt: now,
          },
        ],
      };
    }
  );

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

  // Placeholder handlers — replace with your API wiring easily.
  function handleAddProduct(data: {
    name: string;
    price: number;
    category?: string;
    short_description?: string;
    description?: string;
    imageFile?: File | null;
  }) {
    // For UI only: create a local URL for preview if image selected
    let image: string | undefined = undefined;
    if (data.imageFile) {
      image = URL.createObjectURL(data.imageFile);
      // NOTE: In real integration, upload to server/CDN and use the returned URL.
    }
    const newProduct: Product = {
      _id: uid("prod"),
      name: data.name,
      category: data.category,
      price: data.price,
      short_description: data.short_description,
      description: data.description,
      image,
      isBiddable: true,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    setTab("products");
  }

  function toggleBiddable(p: Product) {
    setProducts((prev) =>
      prev.map((x) =>
        x._id === p._id ? { ...x, isBiddable: !x.isBiddable } : x
      )
    );
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
              <ProductsTable
                products={products}
                onToggleBiddable={toggleBiddable}
              />
            )}

            {tab === "add-product" && (
              <AddProductForm onSubmit={handleAddProduct} />
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

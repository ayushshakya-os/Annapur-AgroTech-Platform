"use client";

import { Package, PlusCircle, Gavel, History } from "lucide-react";

type Key = "products" | "add-product" | "bidding" | "history";

export default function Sidebar({
  active,
  onSelect,
}: {
  active: Key;
  onSelect: (key: Key) => void;
}) {
  const items: { key: Key; label: string; icon: any }[] = [
    { key: "products", label: "Products", icon: Package },
    { key: "add-product", label: "Add Product", icon: PlusCircle },
    { key: "bidding", label: "Bidding", icon: Gavel },
    { key: "history", label: "Bid History", icon: History },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 font-semibold text-gray-800">
          Farmer's Dashboard
        </div>
        <nav className="p-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 mb-1 text-left transition ${
                  isActive
                    ? "bg-[#88B04B] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

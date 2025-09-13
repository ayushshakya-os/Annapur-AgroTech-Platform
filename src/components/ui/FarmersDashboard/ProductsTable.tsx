"use client";

import type { Product } from "../../../lib/types/type";

export default function ProductsTable({
  products,
  onToggleBiddable,
}: {
  products: Product[];
  onToggleBiddable: (p: Product) => void;
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-800">Your Products</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Biddable</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 rounded-md overflow-hidden bg-gray-100">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          —
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{p.name}</div>
                      {p.short_description && (
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {p.short_description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{p.category || "—"}</td>
                <td className="px-4 py-3 text-gray-700">
                  Rs. {p.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={!!p.isBiddable}
                      onChange={() => onToggleBiddable(p)}
                    />
                    <span className="w-10 h-5 bg-gray-200 peer-checked:bg-emerald-600 rounded-full relative transition">
                      <span className="absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition peer-checked:left-5 shadow" />
                    </span>
                  </label>
                </td>
                <td className="px-4 py-3 text-right text-gray-500">—</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                  You have no products yet. Use “Add Product” to create your
                  first product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

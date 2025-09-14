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
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!p.isBiddable}
                      onChange={() => onToggleBiddable(p)}
                    />

                    {/* track */}
                    <div className="w-12 h-7 bg-gray-200 rounded-full peer-checked:bg-[#88B04B] transition-colors duration-200" />

                    {/* knob (absolute so translate works reliably) */}
                    <span
                      className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200
               peer-checked:translate-x-5"
                      aria-hidden
                    />
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

"use client";

import { useEffect, useRef, useState } from "react";

export default function AddProductForm({
  onSubmit,
}: {
  onSubmit: (data: {
    name: string;
    price: number;
    category?: string;
    short_description?: string;
    description?: string;
    imageFile?: File | null;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return;
    onSubmit({
      name,
      price: Number(price),
      category: category || undefined,
      short_description: shortDescription || undefined,
      description: description || undefined,
      imageFile: file || undefined,
    });
    setName("");
    setPrice("");
    setCategory("");
    setShortDescription("");
    setDescription("");
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b bg-gradient-to-r from-emerald-50 to-emerald-100">
        <h3 className="font-semibold text-gray-800">Add a New Product</h3>
        <p className="text-sm text-gray-600">
          Upload an image, set price, and publish instantly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Product Name</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Premium Organic Tomatoes"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Category</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Vegetables, Grains, Fruits..."
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Price</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="e.g., 120.00"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Short Description</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A short punchy line about your product"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="More details, quality notes, harvesting info..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Product Image</label>
          <div className="mt-1 flex items-start gap-4">
            <div className="w-40 h-28 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">No image selected</span>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white hover:file:bg-emerald-700"
              />
              <p className="mt-2 text-xs text-gray-500">
                Max 5MB. Formats: JPG, PNG, WEBP. Replace with your uploader
                later.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2 text-white shadow hover:bg-emerald-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

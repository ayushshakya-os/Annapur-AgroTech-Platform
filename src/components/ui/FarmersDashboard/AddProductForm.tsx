"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddProductSchema,
  AddProductFormData,
} from "@/lib/validation/addProductSchema";

export default function AddProductForm({
  onSubmit,
}: {
  onSubmit: (data: AddProductFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      name: "",
      price: undefined,
      category: "",
      short_description: "",
      description: "",
      imageFile: null,
    },
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");

  const file = watch("imageFile");

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onValid(data: AddProductFormData) {
    onSubmit(data);
    reset();
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
        onSubmit={handleSubmit(onValid)}
        className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Product Name</label>
          <input
            {...register("name")}
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Premium Organic Tomatoes"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="text-sm text-gray-600">Category</label>
          <input
            {...register("category")}
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Vegetables, Grains, Fruits..."
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm text-gray-600">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., 120.00"
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Short Description</label>
          <input
            {...register("short_description")}
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="A short punchy line about your product"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            {...register("description")}
            className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={4}
            placeholder="More details, quality notes, harvesting info..."
          />
        </div>

        {/* Product Image */}
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
                type="file"
                accept="image/*"
                {...register("imageFile", {
                  onChange: (e) =>
                    e.target.files?.[0] ? e.target.files[0] : null,
                })}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#88B04B] file:px-4 file:py-2 file:text-white hover:file:bg-emerald-600"
              />
              {errors.imageFile && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.imageFile.message as string}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Max 5MB. Formats: JPG, PNG, WEBP. Replace with your uploader
                later.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-[#88B04B] px-5 py-2 text-white shadow hover:bg-emerald-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

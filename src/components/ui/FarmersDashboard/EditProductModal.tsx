"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "@/lib/types/type";
import {
  useUpdateProduct,
  type UpdateProductPayload,
} from "@/hooks/api/FarmersDashboard/useEditProducts";

type Props = {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
};

type FormValues = {
  name: string;
  price: number;
  category: string;
  short_description: string;
  description?: string;
  imageFile?: File | null;
};

export default function EditProductModal({ isOpen, product, onClose }: Props) {
  const { mutateAsync: updateProduct, isPending, error } = useUpdateProduct();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>("");

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      category: product?.category || "",
      short_description: product?.short_description || "",
      description: product?.description || "",
      imageFile: null,
    },
  });

  const imageFile = watch("imageFile");

  // Sync form when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        category: product.category || "",
        short_description: product.short_description || "",
        description: product.description || "",
        imageFile: null,
      });
      setPreview(product.image || "");
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [product, reset]);

  // Handle preview for new file
  useEffect(() => {
    if (!imageFile || !(imageFile instanceof File)) {
      setPreview(product?.image || "");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile, product?.image]);

  if (!isOpen || !product) return null;

  async function onSubmit(values: FormValues) {
    if (!product) return;
    const payload: UpdateProductPayload = {
      id: product._id,
      name: values.name,
      price: values.price,
      category: values.category,
      short_description: values.short_description,
      description: values.description,
      imageFile: values.imageFile || undefined,
    };
    await updateProduct(payload);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-product-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        style={{ height: "100dvh" }}
        onClick={onClose}
        aria-hidden
      />

      {/* Modal container (uses its own scroll for very small screens) */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 overscroll-contain">
        {/* IMPORTANT: make card a flex column and give it a max height */}
        <div className="w-full max-w-lg max-h-[85vh] rounded-xl bg-white shadow-lg flex flex-col">
          {/* Header (fixed inside the card) */}
          <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
            <h3 id="edit-product-title" className="font-semibold text-gray-800">
              Edit Product
            </h3>
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Form must be flex-1 with min-h-0 to allow interior scroll */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 min-h-0 flex flex-col"
          >
            {/* Scrollable content: flex-1 min-h-0 overflow-y-auto */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  {...register("name", { required: true })}
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <input
                    {...register("category")}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-sm text-gray-600">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", {
                      valueAsNumber: true,
                      required: true,
                    })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="text-sm text-gray-600">
                  Short Description
                </label>
                <input
                  {...register("short_description")}
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Image */}
              <div>
                <label className="text-sm text-gray-600">Product Image</label>
                <div className="mt-1 flex items-start gap-4">
                  <div className="w-40 h-28 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        (register("imageFile").onChange as any)({
                          target: { value: f, files: f ? [f] : [] },
                        });
                      }}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#88B04B] file:px-4 file:py-2 file:text-white hover:file:bg-emerald-600"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Leave empty to keep the existing image.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer (fixed inside the card, not part of scroll) */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t bg-white shrink-0">
              {error && (
                <span className="text-sm text-red-600">
                  {(error as Error).message}
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 border bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-[#88B04B] px-5 py-2 text-white shadow hover:bg-emerald-600 disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

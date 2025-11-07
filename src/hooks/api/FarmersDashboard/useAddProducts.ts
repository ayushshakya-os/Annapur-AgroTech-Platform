"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type { AddProductFormData } from "@/lib/validation/addProductSchema";
import { fileToDataUrl } from "@/lib/utils/utils";

type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
  short_description?: string;
  description?: string;
  category?: string;
  isBiddable: boolean;
  farmerId: string;
  createdAt?: string;
  updatedAt?: string;
};

type AddProductResponse =
  | {
      success: true;
      message: string;
      product: Product;
    }
  | {
      success: false;
      message?: string;
      error?: string;
    };

/**
 * Adds a new product as a farmer/admin.
 * - Endpoint assumed to be mounted at /products/addproduct via your router.
 * - Sends JSON with an "image" string (data URL) if imageFile is provided.
 * - On success, invalidates the "products" list (adjust keys to your app).
 */
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, AddProductFormData>({
    mutationFn: async (formData: AddProductFormData) => {
      const { imageFile, ...rest } = formData;

      let image: string | undefined;
      if (imageFile) {
        image = await fileToDataUrl(imageFile);
      }

      const payload = {
        ...rest,
        image, // backend expects "image" string
      };

      const { data } = await AxiosWrapper.post<AddProductResponse>(
        "/api/products/addproduct",
        payload
      );

      if (!data?.success) {
        const msg = data?.message || data?.error || "Failed to add product";
        throw new Error(msg);
      }

      return data.product;
    },
    onSuccess: () => {
      // Invalidate product queries so lists are refetched
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Add/adjust any specific product lists you use, e.g.:
      // queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};

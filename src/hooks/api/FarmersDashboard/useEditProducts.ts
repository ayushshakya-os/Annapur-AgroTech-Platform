"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Product } from "@/lib/types/type";

export type UpdateProductPayload = {
  id: string;
  name?: string;
  price?: number;
  category?: string;
  short_description?: string;
  description?: string;
  imageFile?: File | null; // optional; if provided, will be converted to data URL and sent as "image"
};

// Helper to convert a File into a data URL string
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

type ApiResponse =
  | { success: true; message?: string; product: Product }
  | { success: false; message?: string; error?: string };

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateProductPayload>({
    mutationFn: async ({ id, imageFile, ...rest }) => {
      const body: Record<string, any> = { ...rest };

      // Only include "image" if a new file is provided
      if (imageFile instanceof File) {
        body.image = await fileToDataUrl(imageFile);
      }

      const { data } = await AxiosWrapper.put<ApiResponse>(
        `/products/${id}`,
        body
      );

      if (!data || data.success !== true) {
        const msg =
          (data as any)?.message ||
          (data as any)?.error ||
          "Failed to update product";
        throw new Error(msg);
      }

      return data.product;
    },
    onSuccess: () => {
      // Refresh farmer products list
      queryClient.invalidateQueries({ queryKey: ["farmersProducts"] });
      // If you also cache single product queries, invalidate them too
      // queryClient.invalidateQueries({ queryKey: ["productById"] });
    },
  });
};

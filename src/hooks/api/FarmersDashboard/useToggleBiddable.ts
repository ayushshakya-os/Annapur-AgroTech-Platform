"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Product } from "@/lib/types/type";
import { any } from "zod";

type ToggleVars = { id: string; isBiddable: boolean };

type MyProductsCache = {
  success: true;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    sort: string;
  };
  products: Product[];
};

type ApiResponse =
  | { success: true; message?: string; product: Product }
  | { success: false; message?: string; error?: string };

export function useToggleBiddable() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, ToggleVars, { prev?: MyProductsCache }>({
    mutationFn: async ({ id, isBiddable }) => {
      const { data } = await AxiosWrapper.put<ApiResponse>(
        `/api/products/${id}`,
        {
          isBiddable,
        }
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
    onMutate: async ({ id, isBiddable }) => {
      await queryClient.cancelQueries({ queryKey: ["farmersProducts"] });

      const prev = queryClient.getQueryData<MyProductsCache>([
        "farmersProducts",
      ]);
      if (prev) {
        const next: MyProductsCache = {
          ...prev,
          products: prev.products.map((p) =>
            p._id === id ? { ...p, isBiddable } : p
          ),
        };
        queryClient.setQueryData(["farmersProducts"], next);
      }

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["farmersProducts"], ctx.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["farmersProducts"] });
    },
  });
}

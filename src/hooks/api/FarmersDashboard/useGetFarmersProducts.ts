"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Product } from "@/lib/types/type";

export type MyProductsParams = {
  page?: number;
  limit?: number;
  sort?:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isBiddable?: boolean;
};

type MyProductsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sort: string;
};

type ApiSuccess = {
  success: true;
  meta: MyProductsMeta;
  products: Product[];
};

type ApiError = {
  success: false;
  message?: string;
  error?: string;
};

type ApiResponse = ApiSuccess | ApiError;

export function useGetFarmersProducts(
  params: MyProductsParams = { page: 1, limit: 20, sort: "newest" },
  options?: Omit<
    UseQueryOptions<ApiSuccess, Error, ApiSuccess, any[]>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<ApiSuccess, Error, ApiSuccess, any[]>({
    queryKey: ["farmersProducts", params],
    queryFn: async () => {
      const { data } = await AxiosWrapper.get<ApiResponse>(
        "/products/myproducts",
        {
          params,
        }
      );

      if (!data || data.success !== true) {
        const msg =
          (data as ApiError)?.message ||
          (data as ApiError)?.error ||
          "Failed to load products";
        throw new Error(msg);
      }

      // Ensure isBiddable exists for UI (backend default is true)
      const normalized = (data.products || []).map((p) => ({
        ...p,
        isBiddable: typeof p.isBiddable === "boolean" ? p.isBiddable : true,
      }));

      return {
        ...data,
        products: normalized,
      };
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    ...options,
  });
}

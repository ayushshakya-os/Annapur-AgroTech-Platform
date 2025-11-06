"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type { GetBidsResponse } from "@/lib/types/Bidding";

export type GetMyBidsParams = {
  role?: "buyer" | "farmer";
  status?: string;
  productId?: string | number;
  negotiationId?: string | number;
  page?: number;
  limit?: number;
  sort?: string; // e.g. "-createdAt"
};

/**
 * Hook: useGetMyBids
 * - Fetches bids for the authenticated user via GET /bids/me
 * - Accepts optional filter/pagination params that map to query string
 */
export const useGetMyBids = (
  params?: GetMyBidsParams,
  options?: Omit<
    UseQueryOptions<GetBidsResponse, Error, GetBidsResponse, any[]>,
    "queryKey" | "queryFn"
  >
) => {
  const queryKey = [
    "bids",
    "me",
    params?.role ?? null,
    params?.status ?? null,
    params?.productId ?? null,
    params?.negotiationId ?? null,
    params?.page ?? null,
    params?.limit ?? null,
    params?.sort ?? null,
  ];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.role) search.set("role", params.role);
      if (params?.status) search.set("status", params.status);
      if (params?.productId) search.set("productId", String(params.productId));
      if (params?.negotiationId)
        search.set("negotiationId", String(params.negotiationId));
      if (params?.page) search.set("page", String(params.page));
      if (params?.limit) search.set("limit", String(params.limit));
      if (params?.sort) search.set("sort", params.sort);

      const queryString = search.toString();
      const url = `/bids/me${queryString ? `?${queryString}` : ""}`;

      const { data } = await AxiosWrapper.get<GetBidsResponse>(url);
      return data;
    },
    staleTime: 5_000,
    ...options,
  });
};

export default useGetMyBids;

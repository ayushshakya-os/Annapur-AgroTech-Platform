"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type { GetBidsResponse } from "@/lib/types/Bidding";

export const useGetBidsForProduct = (
  productId: string | number,
  options?: Omit<
    UseQueryOptions<GetBidsResponse, Error, GetBidsResponse, any[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["bids", String(productId)],
    queryFn: async () => {
      const { data } = await AxiosWrapper.get<GetBidsResponse>(
        `/bids/product/${productId}`
      );
      return data;
    },
    staleTime: 5_000,
    ...options,
  });
};

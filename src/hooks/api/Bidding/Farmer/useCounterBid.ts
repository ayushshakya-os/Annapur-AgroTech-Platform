"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Bid } from "@/lib/types/type";

type CounterBidPayload = {
  bidId: string;
  offeredPrice: number;
};

export function useCounterBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bidId, offeredPrice }: CounterBidPayload) => {
      const res = await axiosWrapper.put(`/api/bids/${bidId}/counter`, {
        offeredPrice,
      });
      return res.data as { success: boolean; bid: Bid };
    },
    onSuccess: (data) => {
      if (data.success && data.bid?.productId) {
        queryClient.invalidateQueries({
          queryKey: ["bids", data.bid.productId],
        });
      }
    },
  });
}

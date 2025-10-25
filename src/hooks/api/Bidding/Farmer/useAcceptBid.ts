"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Bid } from "@/lib/types/type";

export function useAcceptBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bidId: string) => {
      const res = await axiosWrapper.put(`/bids/${bidId}/accept`);
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

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type {
  PlaceBidPayload,
  PlaceBidResponse,
  Bid,
} from "@/lib/types/Bidding";

/**
 * Sends { negotiationId, offeredPrice, productId } to satisfy server-side validation.
 */
export const usePlaceBid = (options?: { productId?: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PlaceBidPayload) => {
      const { data } = await AxiosWrapper.post<PlaceBidResponse>(
        `/bids/place`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      if (data?.success && data.bid && options?.productId) {
        // Optimistically update cached bids for this product
        queryClient.setQueryData<{ success: boolean; bids: Bid[] }>(
          ["bids", options.productId],
          (old) => {
            const existing = old?.bids ?? [];
            const exists = existing.some((b) => b._id === data.bid!._id);
            return {
              success: true,
              bids: exists ? existing : [data.bid!, ...existing],
            };
          }
        );
        // Ensure full consistency
        queryClient.invalidateQueries({
          queryKey: ["bids", options.productId],
        });
      }
    },
  });
};

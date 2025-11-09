"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Bid } from "@/lib/types/type";

/**
 * Hook: useCounterBidBuyer
 * - Buyer sends a counter (updates offeredPrice and moves bid back to "pending")
 * - mutation variables: { bidId: string, offeredPrice: number }
 */
export function useCounterBidBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { bidId: string; offeredPrice: number }) => {
      const { bidId, offeredPrice } = vars;
      const res = await axiosWrapper.put(`/api/bids/${bidId}/counter-buyer`, {
        offeredPrice,
      });
      return res.data as { success: boolean; bid: Bid };
    },

    onMutate: async (vars) => {
      const { bidId, offeredPrice } = vars;

      await queryClient.cancelQueries({ queryKey: ["bids"] });

      const previousData = queryClient.getQueryData<Record<string, Bid[]>>([
        "bids",
      ]);

      // Optimistically update bid: set offeredPrice and status -> "pending"
      queryClient.setQueryData<Record<string, Bid[]>>(["bids"], (oldData) => {
        if (!oldData) return oldData;
        const newData: Record<string, Bid[]> = {};
        for (const pid in oldData) {
          newData[pid] = oldData[pid].map((b) =>
            b._id === bidId ? { ...b, offeredPrice, status: "pending" } : b
          );
        }
        return newData;
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      // rollback
      if (context?.previousData) {
        queryClient.setQueryData(["bids"], context.previousData);
      }
    },

    onSettled: () => {
      // ensure consistency
      queryClient.invalidateQueries({ queryKey: ["bids"] });
    },
  });
}

/**
 * Hook: useRejectBidBuyer
 * - Buyer rejects an offer (sets status -> "rejected")
 * - mutation variables: bidId: string
 */
export function useRejectBidBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bidId: string) => {
      const res = await axiosWrapper.put(`/api/bids/${bidId}/reject-buyer`);
      return res.data as { success: boolean; bid: Bid };
    },

    onMutate: async (bidId: string) => {
      await queryClient.cancelQueries({ queryKey: ["bids"] });

      const previousData = queryClient.getQueryData<Record<string, Bid[]>>([
        "bids",
      ]);

      // Optimistically update bid: set status -> "rejected"
      queryClient.setQueryData<Record<string, Bid[]>>(["bids"], (oldData) => {
        if (!oldData) return oldData;
        const newData: Record<string, Bid[]> = {};
        for (const pid in oldData) {
          newData[pid] = oldData[pid].map((b) =>
            b._id === bidId ? { ...b, status: "rejected" } : b
          );
        }
        return newData;
      });

      return { previousData };
    },

    onError: (_err, _bidId, context) => {
      // rollback
      if (context?.previousData) {
        queryClient.setQueryData(["bids"], context.previousData);
      }
    },

    onSettled: () => {
      // ensure consistency
      queryClient.invalidateQueries({ queryKey: ["bids"] });
    },
  });
}

export default useCounterBidBuyer;

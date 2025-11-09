"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Bid } from "@/lib/types/type";

export function useAcceptBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bidId: string) => {
      const res = await axiosWrapper.put(`/api/bids/${bidId}/accept`);
      return res.data as { success: boolean; bid: Bid };
    },

    // ✅ Optimistic update
    onMutate: async (bidId) => {
      await queryClient.cancelQueries({ queryKey: ["bids"] });

      const previousData = queryClient.getQueryData<Record<string, Bid[]>>([
        "bids",
      ]);

      // Update bid status immediately in cache
      queryClient.setQueryData<Record<string, Bid[]>>(["bids"], (oldData) => {
        if (!oldData) return oldData;
        const newData = { ...oldData };
        for (const pid in newData) {
          newData[pid] = newData[pid].map((b) =>
            b._id === bidId ? { ...b, status: "accepted" } : b
          );
        }
        return newData;
      });

      return { previousData };
    },

    onError: (_err, _bidId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["bids"], context.previousData);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
    },
  });
}

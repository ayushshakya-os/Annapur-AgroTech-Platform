"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";
import type { Bid } from "@/lib/types/type";

export function useRejectBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bidId: string) => {
      const res = await axiosWrapper.put(`/bids/${bidId}/reject`);
      return res.data as { success: boolean; bid: Bid };
    },

    // ✅ Optimistic update
    onMutate: async (bidId) => {
      await queryClient.cancelQueries({ queryKey: ["bids"] });

      const previousData = queryClient.getQueryData<Record<string, Bid[]>>([
        "bids",
      ]);

      queryClient.setQueryData<Record<string, Bid[]>>(["bids"], (oldData) => {
        if (!oldData) return oldData;
        const newData = { ...oldData };
        for (const pid in newData) {
          newData[pid] = newData[pid].map((b) =>
            b._id === bidId ? { ...b, status: "rejected" } : b
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

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
    },
  });
}

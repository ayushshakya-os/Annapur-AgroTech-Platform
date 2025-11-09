"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";
import { showToast } from "@/components/ui/Toasts/toast";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosWrapper.put("/api/notifications/read");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showToast("success", "All notifications marked as read");
    },
  });
}

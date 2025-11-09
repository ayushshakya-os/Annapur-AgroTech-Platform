"use client";
import { useQuery } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/api/notifications");
      return res.data.notifications;
    },
  });
}

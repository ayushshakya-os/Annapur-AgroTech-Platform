"use client";
import { useQuery } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

export const useGetSearchHistory = (userId: string) => {
  return useQuery({
    queryKey: ["searchHistory", userId],
    queryFn: async () => {
      const { data } = await AxiosWrapper.get(`/user/${userId}/search-history`);
      return data;
    },
    enabled: !!userId, // Only run if userId is present
  });
};

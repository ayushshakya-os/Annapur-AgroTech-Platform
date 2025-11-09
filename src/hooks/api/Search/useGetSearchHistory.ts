"use client";
import { useQuery } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

export const useGetSearchHistory = () => {
  return useQuery({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      const { data } = await AxiosWrapper.get(`/api/searches`);
      return data;
    },
  });
};

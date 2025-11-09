"use client";

import { useQuery } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

export const useGetAddresses = (userId: string) => {
  return useQuery({
    queryKey: ["userAddresses", userId],
    queryFn: async () => {
      const { data } = await AxiosWrapper.get(`/api/users/${userId}/addresses`);
      return data.addresses;
    },
    enabled: !!userId,
  });
};

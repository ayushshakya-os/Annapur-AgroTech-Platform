"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

export type DeleteAddressPayload = {
  userId: string;
  addressId: string;
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, addressId }: DeleteAddressPayload) => {
      const { data } = await AxiosWrapper.delete(
        `/users/${userId}/addresses/${addressId}`
      );
      return data.addresses;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userAddresses", variables.userId],
      });
    },
  });
};

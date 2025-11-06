"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

export type AddAddressPayload = {
  userId: string;
  label: string;
  address: string;
  city: string;
  state: string;
  isDefault?: boolean;
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddAddressPayload) => {
      const { userId, ...addressFields } = payload;
      const { data } = await AxiosWrapper.post(
        `/users/${userId}/addresses`,
        addressFields
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

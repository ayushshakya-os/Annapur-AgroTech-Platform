"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

export type UpdateAddressPayload = {
  userId: string;
  addressId: string;
  label?: string;
  address?: string;
  city?: string;
  state?: string;
  isDefault?: boolean;
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      addressId,
      ...fields
    }: UpdateAddressPayload) => {
      const { data } = await AxiosWrapper.put(
        `/api/users/${userId}/addresses/${addressId}`,
        fields
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

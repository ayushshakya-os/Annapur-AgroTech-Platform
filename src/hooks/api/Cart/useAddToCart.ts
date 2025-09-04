// hooks/api/cart/useAddToCart.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import { useAuth } from "@/hooks/auth/useAuth";

type AddToCartPayload = {
  userId: string;
  productId: number;
  quantity: number;
};

export const useAddToCart = () => {
  return useMutation({
    mutationFn: async (payload: AddToCartPayload) => {
      const { data } = await AxiosWrapper.post(
        `/cart/${payload.userId}/add`,
        payload
      );
      return data;
    },
  });
};

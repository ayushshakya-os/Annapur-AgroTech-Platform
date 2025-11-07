// hooks/api/cart/useCart.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "../AxiosWrapper";

export const useGetCart = (userId: string) => {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await AxiosWrapper.get(`/cart/${userId}`);
      return data.cart;
    },
    enabled: !!userId, // only fetch if logged in
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      productId,
      quantity,
    }: {
      userId: string;
      productId: string;
      quantity: number;
    }) => {
      const { data } = await AxiosWrapper.post(`/api/cart/${userId}/add`, {
        productId,
        quantity,
      });
      return data.cart;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      productId,
      quantity,
    }: {
      userId: string;
      productId: string;
      quantity: number;
    }) => {
      const { data } = await AxiosWrapper.put(
        `/cart/${userId}/update/${productId}`,
        { quantity }
      );
      return data.cart;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      productId,
    }: {
      userId: string;
      productId: string;
    }) => {
      const { data } = await AxiosWrapper.delete(
        `/cart/${userId}/remove/${productId}`
      );
      return data.cart;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await AxiosWrapper.delete(`/cart/${userId}/clear`);
      return data.cart;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
};

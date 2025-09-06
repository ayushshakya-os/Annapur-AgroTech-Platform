"use client";
import { useMutation } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

type AddSearchHistoryPayload = {
  userId: string;
  query: string;
};

export const useAddSearchHistory = () => {
  return useMutation({
    mutationFn: async (payload: AddSearchHistoryPayload) => {
      const { data } = await AxiosWrapper.post(
        `/user/${payload.userId}/search-history`,
        { query: payload.query }
      );
      return data;
    },
  });
};

"use client";
import { useMutation } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

type AddSearchHistoryPayload = {
  query: string;
};

export const useAddSearchHistory = () => {
  return useMutation({
    mutationFn: async (payload: AddSearchHistoryPayload) => {
      const { data } = await AxiosWrapper.post(`/searches/search`, {
        query: payload.query,
      });
      return data;
    },
  });
};

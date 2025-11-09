"use client";

import { useMutation } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";
import type {
  CreateNegotiationPayload,
  CreateNegotiationResponse,
} from "@/lib/types/Bidding";

export const useCreateNegotiation = () => {
  return useMutation({
    mutationFn: async (payload: CreateNegotiationPayload) => {
      // Adjust path if mounted differently (e.g., /api/negotiations)
      const { data } = await AxiosWrapper.post<CreateNegotiationResponse>(
        `/api/negotiations`,
        payload
      );
      return data;
    },
  });
};

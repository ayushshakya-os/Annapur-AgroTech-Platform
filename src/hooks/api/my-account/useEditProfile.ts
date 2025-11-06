"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

// Only allow these fields to be updated, as per the Express whitelist
type EditProfilePayload = {
  id: string; // user id
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EditProfilePayload) => {
      const { id, ...body } = payload;
      const { data } = await AxiosWrapper.put(`/users/${id}`, body);
      return data.user; // Updated user
    },
    onSuccess: () => {
      // Invalidate profile query so it's refetched
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

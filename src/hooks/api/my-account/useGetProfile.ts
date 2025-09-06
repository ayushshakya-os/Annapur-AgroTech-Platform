"use client";

import { useQuery } from "@tanstack/react-query";
import AxiosWrapper from "@/hooks/api/AxiosWrapper";

// Gets the currently authenticated user's profile
export const useGetProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await AxiosWrapper.get("/users/profile");
      return data.user; // { ...user fields }
    },
  });
};

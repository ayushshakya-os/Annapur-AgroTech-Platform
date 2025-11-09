// hooks/api/Market/useGetProductById.ts
import { useQuery } from "@tanstack/react-query";
import AxiosWrapper from "../AxiosWrapper";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await AxiosWrapper.get(
        `${API_BASE}/api/products/product/${id}`
      );
      return res.data.product; // adjust if API returns differently
    },
    enabled: !!id, // don’t run until id exists
  });
};

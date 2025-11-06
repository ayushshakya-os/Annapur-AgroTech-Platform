import { useQuery } from "@tanstack/react-query";
import axiosWrapper from "@/hooks/api/AxiosWrapper";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axiosWrapper.get(`${API_BASE}/products/allproducts`);
      return res.data.products; // adjust based on backend response
    },
  });
};

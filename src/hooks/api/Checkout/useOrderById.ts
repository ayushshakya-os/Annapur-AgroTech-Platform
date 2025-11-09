import { useQuery } from "@tanstack/react-query";
import AxiosWrapper from "../AxiosWrapper";

export function useOrderById(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await AxiosWrapper.get(`/api/orders/${orderId}`);
      return res.data.order;
    },
    enabled: !!orderId,
  });
}

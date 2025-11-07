import { useQuery } from "@tanstack/react-query";
import AxiosWrapper from "../AxiosWrapper";
export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const res = await AxiosWrapper.get(`/orders/user/${userId}`);
      return res.data.orders;
    },
    enabled: !!userId,
  });
}

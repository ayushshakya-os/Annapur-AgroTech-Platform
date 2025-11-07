import { useMutation } from "@tanstack/react-query";
import AxiosWrapper from "../AxiosWrapper";
import { CheckoutFormData } from "@/lib/validation/CheckoutForm/CheckoutFormSchema";

interface CreateOrderPayload {
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
  };
  paymentMethod: string;
}

export function useCreateOrder(userId: string) {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await AxiosWrapper.post(
        `/api/orders/${userId}/create`,
        payload
      );
      return res.data;
    },
  });
}

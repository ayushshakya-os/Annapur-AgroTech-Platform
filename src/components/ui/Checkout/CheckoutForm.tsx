"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckoutFormSchema,
  CheckoutFormData,
} from "@/lib/validation/CheckoutForm/CheckoutFormSchema";
import ContactInfo from "@/components/ui/Checkout/ContactInfo";
import ShippingAddress from "@/components/ui/Checkout/ShippingAddress";
import Payment from "@/components/ui/Checkout/Payment";
import { LoginButton } from "../Buttons/LoginButton";
import { showAuthToast } from "../Toasts/ToastMessage";
import { useGetCart } from "@/hooks/api/Cart/useCart";
import { useClearCart } from "@/hooks/api/Cart/useCart";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useCreateOrder } from "@/hooks/api/Checkout/useCreateOrder";
import { showToast } from "../Toasts/toast";

export default function CheckoutForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutFormSchema),
  });
  const { user } = useAuth();
  const userId = user?.id || "current";
  const { data: cart = [], refetch } = useGetCart(userId);
  const clearCart = useClearCart();
  const createOrder = useCreateOrder(userId);
  const router = useRouter();

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      showToast("error", "Please log in to place an order.");
      return;
    }
    if (cart.length === 0) {
      showToast("error", "Your cart is empty.");
      return;
    }

    const orderPayload = {
      customer: {
        fullName: data.fullName || "",
        email: data.email,
        phone: data.phone,
      },
      shippingAddress: {
        address: data.address,
        city: data.city,
        state: data.state,
      },
      paymentMethod: data.paymentMethod,
    };

    try {
      const result = await createOrder.mutateAsync(orderPayload);
      clearCart.mutate(userId);
      showAuthToast("order-success");
      router.push(`/order-success?orderId=${result.order.orderId}`);
    } catch (err: any) {
      showToast("error", "Failed to create order.");
    }
  };

  return (
    <section className="w-full md:w-1/2 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ContactInfo register={register} errors={errors} />
        <ShippingAddress register={register} errors={errors} />
        <Payment
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />
        <LoginButton label="Place Order" variant="primary" type="submit" />
      </form>
    </section>
  );
}

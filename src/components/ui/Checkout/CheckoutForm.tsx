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
  const { data: cart = [], refetch } = useGetCart("current");
  const clearCart = useClearCart();
  const router = useRouter();

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Form submitted:", data);
    if (cart.length === 0) {
      showAuthToast("empty-cart");
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce(
        (acc: any, item: any) => acc + item.price * item.quantity,
        0
      ),
      customer: {
        name: data.fullName || "",
        email: data.email,
        phone: data.phone,
      },
      shipping: {
        address: data.address,
        city: data.city,
        state: data.state,
      },
      paymentMethod: data.paymentMethod,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem(
      "orders",
      JSON.stringify([newOrder, ...existingOrders])
    );

    const clearCartResponse = clearCart.mutate(userId);

    showAuthToast("order-success");
    router.push(`/order-success?orderId=${newOrder.id}`);
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

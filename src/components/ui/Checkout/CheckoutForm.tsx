"use client";

import React, { useEffect, useState } from "react";
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
import { useGetAddresses } from "@/hooks/api/my-account/Address/useGetAddress";
import { useGetProfile } from "@/hooks/api/my-account/useGetProfile";
import UserAddressSelector from "./UserAddressSelector";

export default function CheckoutForm() {
  const { user } = useAuth();
  const userId = user?.id || "current";
  const { data: profile } = useGetProfile();
  const { data: addresses = [] } = useGetAddresses(userId);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const { data: cart = [], refetch } = useGetCart(userId);
  const clearCart = useClearCart();
  const createOrder = useCreateOrder(userId);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      selectedAddressId, // keep track of choice
    },
  });
  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      showToast("error", "Please log in to place an order.");
      return;
    }
    if (cart.length === 0) {
      showToast("error", "Your cart is empty.");
      return;
    }

    let shippingAddress;
    if (selectedAddressId !== "new") {
      // Use the address the user selected from their saved addresses
      const selected = addresses.find(
        (a: any) => String(a._id) === selectedAddressId
      );
      if (!selected) {
        showToast("error", "Selected address not found.");
        return;
      }
      shippingAddress = {
        address: selected.address,
        city: selected.city,
        state: selected.state,
      };
    } else {
      // Use the data entered in the form
      shippingAddress = {
        address: data.address,
        city: data.city,
        state: data.state,
      };
    }

    const orderPayload = {
      customer: {
        fullName: data.fullName || profile?.fullName,
        email: data.email || profile?.email,
        phone: data.phone || profile?.phone,
      },
      shippingAddress,
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

  useEffect(() => {
    setValue("selectedAddressId", selectedAddressId);
  }, [selectedAddressId, setValue]);

  return (
    <section className="w-full md:w-1/2 p-6">
      {user && addresses.length > 0 && (
        <UserAddressSelector
          user={profile}
          addresses={addresses.map((a: any) => ({ ...a, id: String(a._id) }))} // normalize
          selectedAddressId={selectedAddressId}
          onSelectAddress={(id) => setSelectedAddressId(String(id))}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Only show form if "new" is selected or no addresses */}
        {(selectedAddressId === "new" || addresses.length === 0) && (
          <>
            <ContactInfo register={register} errors={errors} />
            <ShippingAddress register={register} errors={errors} />
          </>
        )}
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

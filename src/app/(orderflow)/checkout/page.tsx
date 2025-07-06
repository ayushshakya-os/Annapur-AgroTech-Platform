import React from "react";
import HeaderText from "@/components/HeaderText";
import CheckoutForm from "@/components/ui/Checkout/CheckoutForm";
import Summary from "@/components/ui/Checkout/Summary";

export default function () {
  return (
    <div className="flex flex-col items-center justify-center pb-10 mt-[116px]">
      <HeaderText text="Process your details securely." text2="Checkout" />
      <CheckoutForm />
      <Summary />
    </div>
  );
}

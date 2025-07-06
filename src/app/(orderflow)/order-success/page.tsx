import React from "react";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import HeaderText from "@/components/HeaderText";
import CheckoutForm from "@/components/ui/Checkout/CheckoutForm";
import Summary from "@/components/ui/Checkout/Summary";

export default function () {
  return (
    <>
      <div className="flex flex-col items-center justify-center pb-10">
        <HeaderText
          text="Your order has been placed successfully!"
          text2="Order Created Successfully"
        />
      </div>
    </>
  );
}

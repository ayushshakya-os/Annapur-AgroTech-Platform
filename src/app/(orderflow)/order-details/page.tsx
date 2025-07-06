import React from "react";
import HeaderText from "@/components/HeaderText";
import CheckoutForm from "@/components/ui/Checkout/CheckoutForm";
import Summary from "@/components/ui/Checkout/Summary";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";

export default function () {
  return (
    <>
      <Breadcrumb />
      <div className="flex flex-col items-center justify-center pb-10">
        <HeaderText text="Checkout your order details." text2="Order Details" />
      </div>
    </>
  );
}

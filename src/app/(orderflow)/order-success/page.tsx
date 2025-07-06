import React from "react";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import HeaderText from "@/components/HeaderText";
import CheckoutForm from "@/components/ui/Checkout/CheckoutForm";
import Summary from "@/components/ui/Checkout/Summary";
import OrderSucess from "@/components/ui/Order/OrderSuccess";

export default function () {
  return (
    <>
      <div className="flex flex-col items-center justify-center pb-10 mt-[116px]">
        {/* <HeaderText
          text="Your order has been placed successfully!"
          text2="Order Created Successfully"
        /> */}
        <OrderSucess />
      </div>
    </>
  );
}

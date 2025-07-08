"use client";

import React from "react";
import HeaderText from "@/components/HeaderText";
import Summary from "@/components/ui/Checkout/Summary";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import OrderDetails from "@/components/ui/Order/OrderDetails";

export default function () {
  return (
    <>
      <div className="mt-[116px]">
        <Breadcrumb />
      </div>
      <div className="flex flex-col items-center justify-center pb-10">
        <HeaderText text="Checkout your order details." text2="Order Details" />
        <OrderDetails />
      </div>
    </>
  );
}

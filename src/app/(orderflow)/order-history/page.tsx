import React from "react";
import HeaderText from "@/components/HeaderText";
import Summary from "@/components/ui/Checkout/Summary";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import OrderHistoryPage from "@/components/ui/Order/OrderHistory";

export default function () {
  return (
    <>
      <div className="mt-[116px]">
        <Breadcrumb />
        <div className="flex flex-col items-center justify-center pb-10 ">
          <HeaderText text="Check your order history." text2="Order History" />
          <OrderHistoryPage />
        </div>
      </div>
    </>
  );
}

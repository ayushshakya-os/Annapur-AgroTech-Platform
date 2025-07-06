import React from "react";
import HeaderText from "@/components/HeaderText";
import Summary from "@/components/ui/Checkout/Summary";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";

export default function () {
  return (
    <>
      <Breadcrumb />
      <div className="flex flex-col items-center justify-center pb-10 mt-[116px]">
        <HeaderText text="Check your order history." text2="Order History" />
      </div>
    </>
  );
}

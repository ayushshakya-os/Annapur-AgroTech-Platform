import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import ContactUs from "@/components/ui/Contact-Us/ContactUs";
import Details from "@/components/ui/Contact-Us/Details";
import React from "react";

export default function ContactUsPage() {
  return (
    <div className="mt-[116px]">

      <Breadcrumb />
      <div className="flex flex-row  mx-20 h-full">
        <Details />
        <ContactUs />
      </div>
    </div>
  );
}

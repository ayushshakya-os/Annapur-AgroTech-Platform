import CreateAccount from "@/components/ui/Accounts/Sign-up/CreateAccount";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import React from "react";

export default function CreateAccountPage() {
  return (
    <div className="mt-[116px]">
      <Breadcrumb />
      <CreateAccount />
    </div>
  );
}

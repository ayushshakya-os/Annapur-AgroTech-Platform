"use client";
import React from "react";

import ChangePasswordForm from "../../../components/ui/My-accounts/Forms/ChangePassowrdForm";
import HeaderText from "@/components/HeaderText";

const PasswordReset = () => {
  return (
    <>
      <HeaderText text="Change Password" className="text-left" />
      <div className="flex justify-start items-center mb-4">
        <div className="w-full md:w-3/4 bg-white shadow rounded-none p-6">
          <p>Set your new password below.</p>
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
};

export default PasswordReset;

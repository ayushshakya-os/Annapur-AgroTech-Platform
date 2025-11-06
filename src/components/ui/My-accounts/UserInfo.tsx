"use client";

import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useGetProfile } from "@/hooks/api/my-account/useGetProfile";
import Button from "@/components/ui/Buttons/Button";
import { ChevronLast, ChevronLeft } from "lucide-react";
import UserDetailEdit from "./Forms/UserDetailEdit";
import HeaderText from "@/components/HeaderText";

const UserInfo = () => {
  const [activeForm, setActiveForm] = useState("myAccount");
  const handleEditUser = () => setActiveForm("editUser");
  const handleBack = () => setActiveForm("myAccount");
  const { data: user } = useGetProfile();

  return (
    <>
      {activeForm === "myAccount" && (
        <div className="space-y-2">
          <HeaderText text="My Account" className="text-left" />

          <p className="text-gray-700 font-semibold">Contact Information</p>
          <p className="text-gray-800">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-gray-800">{user?.email}</p>
          <p className="text-gray-800">{user?.phone}</p>

          <Button
            text="Edit"
            onClick={handleEditUser}
            className="w-[200px] mt-4 cursor-pointer bg-[#88B04B] text-white rounded-md hover:bg-green-600 transform ease-in-out duration-300"
          />
        </div>
      )}

      {activeForm === "editUser" && (
        <div className="relative">
          <UserDetailEdit />
          <Button
            text="Back"
            onClick={handleBack}
            className="w-[200px] mt-4 cursor-pointer flex items-center gap-2 bg-[#343434] text-white rounded-md hover:bg-gray-800 transform ease-in-out duration-300"
          />
        </div>
      )}
    </>
  );
};

export default UserInfo;

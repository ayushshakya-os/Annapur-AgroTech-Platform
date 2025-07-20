"use client";

import React, { useState, useEffect } from "react";
import HeaderText from "@/components/HeaderText";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import Sidebar from "@/components/ui/My-accounts/Sidebar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const router = useRouter();
  const { handleGuestAccess } = useAuth();
  //   const { data: user } = useGetUserProfile();
  const [activeTab, setActiveTab] = useState("account");

  // useEffect(() => {
  //   handleGuestAccess("/login");
  // }, [role]);

  //   if (!user) return <p>Loading...</p>;
  //   if (user?.is_guest) return <h1>Please log in</h1>;
  return (
    <section className="h-fit mt-30 mb-10">
      <Breadcrumb />
      <div className="flex flex-col justify-center gap-2 mx-20">
        <HeaderText text="Manage your account." text2="My Account" />
        <div className="flex flex-col md:flex-row gap-4">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* <UserDetails activeTab={activeTab} /> */}
        </div>
      </div>
    </section>
  );
}

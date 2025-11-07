"use client";

import React, { useState, useEffect } from "react";
import HeaderText from "@/components/HeaderText";
import Breadcrumb from "@/components/BreadCrumbs/BreadCrumb";
import Sidebar from "@/components/ui/My-accounts/Sidebar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import UserDetails from "@/components/ui/My-accounts/UserDetails";

export default function MyAccountPage() {
  const router = useRouter();
  const { isGuest, role, handleGuestAccess, user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    handleGuestAccess("/login");
  }, [role]);

  if (isGuest) return <h1>Please log in</h1>;
  return (
    <section className="h-fit mt-30 mb-10">
      <Breadcrumb />
      <div className="flex flex-col justify-center gap-2 mx-20">
        <HeaderText text="Manage your account." text2="My Account" />
        <div className="flex flex-col md:flex-row gap-4">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user ?? { email: "", fullName: "", role: "" }}
          />
          <UserDetails activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
}

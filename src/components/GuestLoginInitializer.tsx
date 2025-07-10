"use client";

import { useEffect } from "react";
import { simulateGuestLogin } from "@/hooks/api/Account/simulateGuestLogin";
import { showAuthToast } from "@/components/ui/Toasts/ToastMessage";

export default function GuestAuthInitializer() {
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      const guest = simulateGuestLogin();
      console.log("Simulated Guest Login:", guest);
      showAuthToast("guestLogin");
    }
  }, []);

  return null; // no UI, just side effect
}

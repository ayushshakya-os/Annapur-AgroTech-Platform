import { useState } from "react";
import AxiosWrapper from "../../api/AxiosWrapper";

interface AuthUser {
  email: string;
  fullName: string;
  role: string;
}

export function useGuestLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosWrapper.post("/auth/guest-login");
      const user: AuthUser = {
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        role: res.data.user.role,
      };
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: res.data.token, user })
      );
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Guest login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { guestLogin, loading, error };
}

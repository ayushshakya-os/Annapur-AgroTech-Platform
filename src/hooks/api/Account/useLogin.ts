"use client";

import { useState } from "react";
import AxiosWrapper from "../../api/AxiosWrapper";
import { emitAuthUpdate } from "@/lib/utils/authEvent";

interface AuthUser {
  id?: string;
  email: string;
  fullName: string;
  role?: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosWrapper.post("/api/auth/login", {
        email,
        password,
      });

      const user: AuthUser = {
        id: res.data.user.id,
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        role: res.data.user.role,
      };

      // Write to localStorage as before
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: res.data.token, user })
      );

      // NEW: notify same-tab listeners (Header via useAuth) to re-render immediately
      emitAuthUpdate({ token: res.data.token, user });

      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

"use client";

import { useEffect, useState } from "react";
import AxiosWrapper from "../api/AxiosWrapper";
import {
  AUTH_UPDATE_EVENT,
  emitAuthUpdate,
  getStoredAuth,
} from "@/lib/utils/authEvent";

interface AuthUser {
  id?: string;
  email: string;
  fullName: string;
  role?: string;
  phone?: string;
}

interface AuthStorage {
  token: string;
  user: AuthUser;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  termsChecked: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthStorage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    setAuth(getStoredAuth<AuthUser>());
  }, []);

  // Subscribe to same-tab custom auth updates and cross-tab storage updates
  useEffect(() => {
    const handleAuthUpdate = () => {
      setAuth(getStoredAuth<AuthUser>());
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "auth") {
        handleAuthUpdate();
      }
    };

    window.addEventListener(
      AUTH_UPDATE_EVENT,
      handleAuthUpdate as EventListener
    );
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        AUTH_UPDATE_EVENT,
        handleAuthUpdate as EventListener
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Save auth object to localStorage and state
  const saveAuth = (token: string, user: AuthUser) => {
    const authObj: AuthStorage = { token, user };
    localStorage.setItem("auth", JSON.stringify(authObj));
    setAuth(authObj);
    emitAuthUpdate({ token, user });
  };

  // Register user (kept as-is)
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosWrapper.post("/auth/register", data);
      const user: AuthUser = {
        id: res.data.user.id,
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        phone: res.data.user.phone,
        role: res.data.user.role,
      };
      saveAuth(res.data.token, user);
      return { ...res.data };
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user (kept; may not be used if you use the separate useLogin)
  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosWrapper.post("/auth/login", data);
      const user: AuthUser = {
        id: res.data.user.id,
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        role: res.data.user.role,
      };
      saveAuth(res.data.token, user);
      return { ...res.data, isGuest: false };
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Guest login (kept)
  const guestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosWrapper.post("/auth/guest-login");
      const user: AuthUser = {
        id: res.data.user.id,
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        role: res.data.user.role,
      };
      saveAuth(res.data.token, user);
      return { ...res.data };
    } catch (err: any) {
      setError(err.response?.data?.error || "Guest login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    emitAuthUpdate({ token: null, user: null });
  };

  const handleGuestAccess = (redirectUrl: string) => {
    const current = getStoredAuth<AuthUser>();
    if (!current || current.user.role === "guest") {
      if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
      }
    }
  };

  return {
    user: auth?.user,
    token: auth?.token,
    loading,
    error,
    login,
    register,
    guestLogin,
    logout,
    handleGuestAccess,
    role: auth?.user.role || "guest",
    isGuest: auth?.user.role === "guest",
    isAuthenticated: !!auth,
  };
}

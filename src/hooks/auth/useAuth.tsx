import { useState } from "react";
import AxiosWrapper from "../api/AxiosWrapper";

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

const getStoredAuth = (): AuthStorage | null => {
  if (typeof window === "undefined") return null; // Ensure this runs only on client

  const auth = localStorage.getItem("auth");
  if (auth) {
    try {
      return JSON.parse(auth);
    } catch {
      return null;
    }
  }
  return null;
};

export function useAuth() {
  const [auth, setAuth] = useState<AuthStorage | null>(getStoredAuth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save auth object to localStorage and state
  const saveAuth = (token: string, user: AuthUser) => {
    const authObj: AuthStorage = { token, user };
    localStorage.setItem("auth", JSON.stringify(authObj));
    setAuth(authObj);
  };

  // Register user (optionally with guest token)
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const guestAuth = getStoredAuth();
      const res = await AxiosWrapper.post(
        "/auth/register",
        data,
        guestAuth?.token
          ? { headers: { Authorization: `Bearer ${guestAuth.token}` } }
          : undefined
      );
      // Backend may not send phone in response, so use input value
      const user: AuthUser = {
        id: res.data.user.id,
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        phone: res.data.user.phone,
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

  // Login user
  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosWrapper.post("/auth/login", data);
      const user: AuthUser = {
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

  // Guest login
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
  };

  const handleGuestAccess = (redirectUrl: string) => {
    if (!auth || auth.user.role === "guest") {
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

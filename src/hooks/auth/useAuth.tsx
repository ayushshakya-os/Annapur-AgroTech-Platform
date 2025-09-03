import { useState } from "react";
import AxiosWrapper from "../api/AxiosWrapper";

interface AuthUser {
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
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        phone: data.phone,
      };
      saveAuth(res.data.token, user);
      return { ...res.data, isGuest: true };
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
      return { ...res.data, isGuest: true };
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

  return {
    user: auth?.user,
    token: auth?.token,
    loading,
    error,
    login,
    register,
    guestLogin,
    logout,
    isAuthenticated: !!auth,
  };
}

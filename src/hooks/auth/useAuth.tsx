"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { simulateUserLogin } from "@/hooks/api/Account/simulateUserLogin";
import { simulateGuestLogin } from "@/hooks/api/Account/simulateGuestLogin";

interface AuthData {
  token: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isGuest?: boolean;
  role?: string; // Optional, can be used to determine user roles
}

interface AuthContextType {
  user: AuthData | null;
  setUser: (user: AuthData | null) => void;
  login: (
    email: string,
    password: string
  ) => { success: boolean; message?: string };
  guestLogin: () => void;
  handleGuestAccess?: (redirectUrl: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (email: string, password: string) => {
    const result = simulateUserLogin({ email, password });

    if (result.success && result.data) {
      localStorage.setItem("auth", JSON.stringify(result.data));
      setUser(result.data);
    }

    return result;
  };

  const guestLogin = () => {
    const guest = simulateGuestLogin();
    setUser(guest);
  };

  // Optional: Handle guest access by redirecting to a specific URL
  const handleGuestAccess = (redirectUrl: string) => {
    if (user?.isGuest) {
      // Redirect to the specified URL
      window.location.href = redirectUrl ? redirectUrl : "/login"; // Fallback to login if no URL is provided
    }
  };
  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        guestLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};

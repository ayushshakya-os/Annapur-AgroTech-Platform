import { useState } from "react";
import AxiosWrapper from "../../api/AxiosWrapper";

interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  termsChecked: boolean;
}

interface AuthUser {
  email: string;
  fullName: string;
  phone: string;
}

const getStoredAuth = () => {
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

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const guestAuth = getStoredAuth();
      const res = await AxiosWrapper.post(
        "/api/auth/register",
        data,
        guestAuth?.token
          ? { headers: { Authorization: `Bearer ${guestAuth.token}` } }
          : undefined
      );
      const user: AuthUser = {
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        phone: data.phone,
      };
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: res.data.token, user })
      );
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}

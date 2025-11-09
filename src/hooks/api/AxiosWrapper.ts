import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Helper to extract token from localStorage "auth" object
const getToken = () => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    try {
      return JSON.parse(auth).token;
    } catch {
      return null;
    }
  }
  return null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AxiosWrapper: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Correct typing for Axios v1.x+
AxiosWrapper.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosWrapper;

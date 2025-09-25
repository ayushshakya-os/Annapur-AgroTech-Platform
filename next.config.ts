import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Option 1: simple domains list
    // domains: ["example.com", "api.yourdomain.com"],

    // Option 2: remotePatterns for finer control (protocol + pathname)
    remotePatterns: [
      // Your current failing host (HTTP in your error)
      {
        protocol: "http",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      // If you also use HTTPS on the same host
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      // Local dev backend
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // or your API/media server port
        pathname: "/uploads/**",
      },
      // Your production API/media host (replace with your real domain)
      {
        protocol: "https",
        hostname: "api.yourdomain.com",
        port: "",
        pathname: "/uploads/**",
      },
      // Add other CDNs (Cloudinary, S3, etc.) if you use them
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      //   port: "",
      //   pathname: "/**",
      // },
    ],
  },
};

export default nextConfig;

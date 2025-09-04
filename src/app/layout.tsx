"use client";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Manrope } from "next/font/google";
import { Covered_By_Your_Grace } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { useGuestLogin } from "@/hooks/api/Account/useGuestLogin";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  style: "normal",
});

const coveredByYourGrace = Covered_By_Your_Grace({
  subsets: ["latin"],
  variable: "--font-covered",
  weight: "400", // only one weight available
  display: "swap",
  style: "normal",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { guestLogin, loading, error } = useGuestLogin();

  useEffect(() => {
    // Only login as guest if no auth token is set
    const auth = localStorage.getItem("auth");
    if (!auth) {
      guestLogin();
    }
  }, [guestLogin]);

  return (
    <html
      lang="en"
      className={`${manrope.className} ${coveredByYourGrace.className} ${manrope.variable} ${coveredByYourGrace.variable}`}
    >
      <body style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
        {/* AuthProvider wraps the entire application to provide authentication context */}
        <QueryClientProvider client={queryClient}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            closeButton={true}
            theme="light"
            icon={({ type }) => {
              return type === "success" ? (
                <svg
                  className="w-10 h-10"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="12" className="fill-[#88B04B]" />
                  <path
                    d="M7 12L10.5 15.5L17 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : undefined;
            }}
          />

          {/* Header */}
          <Header />

          {/* Main Content */}
          {children}

          {/* Footer */}
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}

"use client";
import React from "react";
import clsx from "clsx";

interface NotificationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  loading?: boolean;
}

export default function NotificationButton({
  children,
  variant = "primary",
  loading = false,
  className,
  ...props
}: NotificationButtonProps) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={clsx(
        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center justify-center gap-2",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
          : "border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50",
        className
      )}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

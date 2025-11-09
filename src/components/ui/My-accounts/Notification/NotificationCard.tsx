"use client";
import React from "react";
import clsx from "clsx";

interface NotificationCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function NotificationCard({
  children,
  className,
}: NotificationCardProps) {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-xl shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

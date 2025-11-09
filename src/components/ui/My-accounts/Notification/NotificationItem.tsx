"use client";
import React from "react";
import { Bell } from "lucide-react";

interface NotificationItemProps {
  message: string;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(dateString: string): string {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function NotificationItem({
  message,
  isRead,
  createdAt,
}: NotificationItemProps) {
  return (
    <div
      className={`flex items-start justify-between p-4 transition ${
        isRead
          ? "bg-gray-50 hover:bg-gray-100"
          : "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-gray-500 mt-1" />
        <div>
          <p className="text-sm text-gray-800">{message}</p>
          <span className="text-xs text-gray-400">{timeAgo(createdAt)}</span>
        </div>
      </div>
      {!isRead && (
        <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
          Unread
        </span>
      )}
    </div>
  );
}

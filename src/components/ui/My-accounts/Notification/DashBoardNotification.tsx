"use client";

import React from "react";
import { useGetNotifications } from "@/hooks/api/Notification/useGetNotifications";
import { useMarkAllAsRead } from "@/hooks/api/Notification/useMarkAllAsRead";
import NotificationCard from "./NotificationCard";
import NotificationButton from "./NotificationButton";
import NotificationItem from "./NotificationItem";
import { CheckCircle, Loader2 } from "lucide-react";

const DashboardNotifications = () => {
  const { data: notifications, isLoading } = useGetNotifications();
  const { mutate: markAllAsRead, isPending } = useMarkAllAsRead();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <NotificationCard className="p-6 text-center text-gray-500">
        No notifications yet.
      </NotificationCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <NotificationButton
          variant="outline"
          onClick={() => markAllAsRead()}
          loading={isPending}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          {isPending ? "Marking..." : "Mark All as Read"}
        </NotificationButton>
      </div>

      <NotificationCard>
        {notifications.map((notif: any) => (
          <NotificationItem
            key={notif._id}
            message={notif.message}
            isRead={notif.isRead}
            createdAt={notif.createdAt}
          />
        ))}
      </NotificationCard>
    </div>
  );
};

export default DashboardNotifications;

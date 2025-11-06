"use client";
import { useEffect, useRef } from "react";
import { app } from "@/lib/firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default function PushNotificationButton() {
  const messagingRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Only initialize messaging in the browser
      const messaging = getMessaging(app);
      messagingRef.current = messaging;
      onMessage(messaging, (payload) => {
        alert("Push notification received:\n" + payload.notification?.title);
      });
    }
  }, []);

  const subscribe = async () => {
    try {
      if (!messagingRef.current) return;
      const registration = await navigator.serviceWorker.getRegistration();
      const token = await getToken(messagingRef.current, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
        serviceWorkerRegistration: registration!,
      });
      if (token) {
        alert("Push token:\n" + token);
        // Send this token to your backend to send notifications later!
      } else {
        alert(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      alert(
        "An error occurred while retrieving token. " + (err as any).message
      );
    }
  };

  return (
    <button
      className="px-4 py-2 bg-[#88B04B] text-white rounded"
      onClick={subscribe}
    >
      Enable Push Notifications
    </button>
  );
}

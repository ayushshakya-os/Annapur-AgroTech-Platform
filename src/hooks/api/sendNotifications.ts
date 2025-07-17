import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      });
      console.log("FCM Token:", token);

      // Send token to your backend to store with user info
      return token;
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (err) {
    console.error("Error getting notification permission or token", err);
  }
};

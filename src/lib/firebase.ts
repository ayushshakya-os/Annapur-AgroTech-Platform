import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCCpRwd8bIPgiVR-tgfxPr3iiacgDSI6g8",
  authDomain: "intro-to-firebase-befe6.firebaseapp.com",
  projectId: "intro-to-firebase-befe6",
  storageBucket: "intro-to-firebase-befe6.firebasestorage.app",
  messagingSenderId: "611821178079",
  appId: "1:611821178079:web:63ccbea5e1b5c71f4aed6a",
  measurementId: "G-Z90SMXWVW8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const messaging = getMessaging(app);
export default app;

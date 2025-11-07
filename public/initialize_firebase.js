// [START initialize_firebase_in_sw]
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAMIBcVGuwyw15G_oWzR3WrJflyRZ0BVZw",
  authDomain: "loopscartlogin.firebaseapp.com",
  projectId: "loopscartlogin",
  storageBucket: "loopscartlogin.firebasestorage.app",
  messagingSenderId: "58041316998",
  appId: "1:58041316998:web:e8249829ba20d75e3a8307",
  measurementId: "G-50GVMM7Y2B",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// [END initialize_firebase_in_sw]

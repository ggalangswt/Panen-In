import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function GET() {
  const config = {
    apiKey: requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: requireEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: requireEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  };

  const script = `
    importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging-compat.js');

    firebase.initializeApp(${JSON.stringify(config)});

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function(payload) {
      const title = payload?.notification?.title || 'PanenIn';
      const options = {
        body: payload?.notification?.body || 'Ada pembaruan notifikasi baru untukmu.',
        icon: '/panenin-logo.png',
        data: payload?.data || {},
      };

      self.registration.showNotification(title, options);
    });

    self.addEventListener('notificationclick', function(event) {
      event.notification.close();

      const path = event.notification?.data?.path || '/weather';
      event.waitUntil(clients.openWindow(path));
    });
  `;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

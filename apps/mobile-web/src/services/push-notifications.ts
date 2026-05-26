"use client";

import { getMessaging, getToken, isSupported } from "firebase/messaging";

import { getFirebaseWebApp, getFirebaseWebVapidKey } from "@/services/firebase";

export async function isPushNotificationSupported() {
  if (typeof window === "undefined") {
    return false;
  }

  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return false;
  }

  return isSupported();
}

async function getMessagingServiceWorkerRegistration() {
  const existingRegistration = await navigator.serviceWorker.getRegistration(
    "/firebase-messaging-sw.js",
  );

  if (existingRegistration) {
    return existingRegistration;
  }

  return navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

export async function requestPushNotificationToken() {
  const supported = await isPushNotificationSupported();

  if (!supported) {
    throw new Error("Browser ini belum mendukung push notification.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Izin notifikasi browser ditolak.");
  }

  const registration = await getMessagingServiceWorkerRegistration();
  const messaging = getMessaging(getFirebaseWebApp());
  const token = await getToken(messaging, {
    vapidKey: getFirebaseWebVapidKey(),
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Gagal mendapatkan token notifikasi dari browser.");
  }

  return token;
}

"use client";

const LOCATION_OPT_IN_KEY = "panenin.location-opt-in";

export type BrowserLocationPermissionState =
  | "granted"
  | "denied"
  | "prompt"
  | "unsupported";

type ReverseLocationPayload = {
  status: string;
  data: {
    kabupaten: string;
    matched_label: string;
    source_name: string;
  };
};

function canUseBrowser() {
  return typeof window !== "undefined";
}

export function getStoredLocationOptIn() {
  if (!canUseBrowser()) {
    return false;
  }

  return window.localStorage.getItem(LOCATION_OPT_IN_KEY) === "true";
}

export function setStoredLocationOptIn(value: boolean) {
  if (!canUseBrowser()) {
    return;
  }

  window.localStorage.setItem(LOCATION_OPT_IN_KEY, String(value));
}

export async function getBrowserLocationPermissionState(): Promise<BrowserLocationPermissionState> {
  if (
    !canUseBrowser() ||
    !("geolocation" in navigator)
  ) {
    return "unsupported";
  }

  if (!("permissions" in navigator) || typeof navigator.permissions.query !== "function") {
    return "prompt";
  }

  try {
    const result = await navigator.permissions.query({
      name: "geolocation",
    } as PermissionDescriptor);

    if (result.state === "granted" || result.state === "denied" || result.state === "prompt") {
      return result.state;
    }
  } catch {
    return "prompt";
  }

  return "prompt";
}

export async function requestCurrentCoordinates() {
  if (!canUseBrowser() || !("geolocation" in navigator)) {
    throw new Error("Browser ini tidak mendukung akses lokasi.");
  }

  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("Izin lokasi ditolak di browser."));
          return;
        }

        reject(new Error("Lokasi tidak bisa dibaca dari perangkat ini."));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });
}

export async function resolveKabupatenFromCurrentLocation() {
  const coordinates = await requestCurrentCoordinates();
  const response = await fetch(
    `/api/lokasi/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}`,
  );

  const payload = (await response.json().catch(() => null)) as ReverseLocationPayload | null;

  if (!response.ok) {
    throw new Error(
      payload && "error" in payload && typeof (payload as { error?: unknown }).error === "string"
        ? String((payload as { error: string }).error)
        : "Gagal memetakan lokasi perangkat.",
    );
  }

  if (!payload) {
    throw new Error("Gagal memetakan lokasi perangkat.");
  }

  return payload.data;
}

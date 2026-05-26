"use client";

import { getSupabaseBrowserClient } from "@/services/supabase";

async function getAccessToken() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Sesi login tidak ditemukan. Silakan masuk ulang.");
  }

  return session.access_token;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const accessToken = await getAccessToken();
  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${accessToken}`);

  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error || payload?.message || "Terjadi kesalahan saat memanggil API PanenIn.",
    );
  }

  return payload as T;
}

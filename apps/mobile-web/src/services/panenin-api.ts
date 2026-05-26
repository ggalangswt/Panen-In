"use client";

import { apiRequest } from "@/services/api";

export type Profile = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  kabupaten: string | null;
  preferred_plants: string[];
};

export type NotificationSettings = {
  notifications_enabled: boolean;
  weather_morning: boolean;
  weather_alert: boolean;
  planting_reminder: boolean;
  fertilizer_reminder: boolean;
  harvest_reminder: boolean;
  weekly_ai_tips: boolean;
  morning_hour: number;
  timezone: string;
};

export type ConsultationAiResult = {
  penyebab: string[];
  rekomendasi: string[];
  pencegahan: string[];
};

export type CalculatorItem = {
  nama: string;
  nilai: number;
};

export type CalculatorRecord = {
  id: string;
  user_id: string;
  musim_tanam: string;
  jenis_tanaman: string;
  item_modal: CalculatorItem[];
  total_modal?: number | null;
  hasil_kg: number;
  harga_per_kg: number;
  pendapatan?: number | null;
  total_pendapatan?: number | null;
  keuntungan?: number | null;
  keuntungan_bersih?: number | null;
  margin_persen?: number | null;
  created_at?: string;
};

export type HarvestNoteRecord = {
  id: string;
  user_id: string;
  kalkulator_id: string | null;
  jenis_tanaman: string;
  tanggal_tanam: string;
  estimasi_panen?: string | null;
  tanggal_panen_aktual?: string | null;
  hasil_aktual_kg?: number | null;
  harga_jual?: number | null;
  masalah?: string | null;
  ringkasan_ai?: string | null;
  synced?: boolean;
  kalkulator_usaha?: CalculatorRecord | CalculatorRecord[] | null;
  created_at?: string;
  updated_at?: string;
};

export type WeatherForecastItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
};

export type WeatherApiResponse = {
  status: string;
  source: "cache" | "fresh";
  data: {
    kabupaten: string;
    rekomendasi_ai: string;
    fetched_at: string;
    data_cuaca: {
      list: WeatherForecastItem[];
    };
  };
};

export type HarvestSummaryResponse = {
  status: string;
  total_musim?: number;
  ringkasan: string;
};

export type HarvestTimelineResponse = {
  status: string;
  meta: {
    id: string;
    jenis_tanaman: string;
    status_sinkronisasi: string;
  };
  timeline: Array<{
    id: string;
    tanggal: string;
    tipe: string;
    judul: string;
    deskripsi: string;
    status: string;
  }>;
};

export async function getMyProfile() {
  const payload = await apiRequest<{ status: string; data: Profile }>("/api/me/profile");
  return payload.data;
}

export async function updateMyProfile(
  updates: Partial<Pick<Profile, "display_name" | "kabupaten" | "preferred_plants">>,
) {
  const payload = await apiRequest<{ status: string; data: Profile }>("/api/me/profile", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return payload.data;
}

export async function getNotificationSettings() {
  const payload = await apiRequest<{ status: string; data: NotificationSettings }>(
    "/api/me/settings/notifications",
  );
  return payload.data;
}

export async function updateNotificationSettings(
  updates: Partial<NotificationSettings>,
) {
  const payload = await apiRequest<{ status: string; data: NotificationSettings }>(
    "/api/me/settings/notifications",
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
  );
  return payload.data;
}

export async function getWeather(kabupaten: string) {
  return apiRequest<WeatherApiResponse>(
    `/api/cuaca?kabupaten=${encodeURIComponent(kabupaten)}`,
  );
}

export async function createConsultation(payload: {
  jenis_tanaman: string;
  metode_input?: string;
  pertanyaan: string;
}) {
  const response = await apiRequest<{ status: string; data: { hasil_ai: ConsultationAiResult } }>(
    "/api/konsultasi",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function createCalculator(payload: {
  musim_tanam: string;
  jenis_tanaman: string;
  item_modal: CalculatorItem[];
  hasil_kg: number;
  harga_per_kg: number;
}) {
  const response = await apiRequest<{ status: string; data: CalculatorRecord }>(
    "/api/kalkulator",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function listCalculators() {
  const response = await apiRequest<{ status: string; data: CalculatorRecord[] }>(
    "/api/kalkulator",
  );

  return response.data;
}

export async function listHarvestNotes() {
  const response = await apiRequest<{ status: string; data: HarvestNoteRecord[] }>(
    "/api/catatan-panen",
  );

  return response.data;
}

export async function getHarvestSummary() {
  return apiRequest<HarvestSummaryResponse>("/api/catatan-panen/ringkasan");
}

export async function getHarvestTimeline(noteId: string) {
  return apiRequest<HarvestTimelineResponse>(
    `/api/komoditas/timeline?id=${encodeURIComponent(noteId)}`,
  );
}

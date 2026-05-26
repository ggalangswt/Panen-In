"use client";

import type {
  CalculatorRecord,
  HarvestNoteRecord,
  WeatherForecastItem,
} from "@/services/panenin-api";

export function formatCurrency(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(Math.round(value))}`;
}

export function formatCompactCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1).replace(".0", "")}jt`;
  }

  return formatCurrency(value);
}

export function formatDateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function formatForecastDay(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
  }).format(date);
}

export function getWeatherIconSrc(condition: string) {
  const normalized = condition.toLowerCase();

  if (normalized.includes("hujan") || normalized.includes("rain")) {
    return "/icons/hujan.svg";
  }

  if (normalized.includes("cerah") || normalized.includes("clear")) {
    return "/icons/cerah.svg";
  }

  return "/icons/berawan.png";
}

export function getCalculatorMetrics(record: CalculatorRecord | null | undefined) {
  if (!record) {
    return {
      totalModal: 0,
      revenue: 0,
      profit: 0,
      marginPercent: 0,
    };
  }

  const totalModal =
    record.total_modal ??
    record.item_modal.reduce((sum, item) => sum + Number(item.nilai || 0), 0);
  const revenue =
    record.total_pendapatan ??
    record.pendapatan ??
    Number(record.hasil_kg || 0) * Number(record.harga_per_kg || 0);
  const profit = record.keuntungan_bersih ?? record.keuntungan ?? revenue - totalModal;
  const marginPercent =
    record.margin_persen ??
    (revenue > 0 ? Math.round((profit / revenue) * 100) : 0);

  return {
    totalModal,
    revenue,
    profit,
    marginPercent,
  };
}

export function getRelatedCalculator(note: HarvestNoteRecord) {
  if (Array.isArray(note.kalkulator_usaha)) {
    return note.kalkulator_usaha[0] ?? null;
  }

  return note.kalkulator_usaha ?? null;
}

export function getWeatherMetrics(item: WeatherForecastItem) {
  return [
    { iconSrc: "/icons/humidity.png", iconAlt: "Kelembapan", value: `${item.main.humidity}%` },
    {
      iconSrc: "/icons/wind.png",
      iconAlt: "Kecepatan angin",
      value: `${Math.round(item.wind.speed * 3.6)} km/h`,
    },
    { iconSrc: "/icons/temperature.png", iconAlt: "Suhu", value: `${Math.round(item.main.temp)}°C` },
  ];
}

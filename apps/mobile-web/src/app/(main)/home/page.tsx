"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AppRoutes } from "@/constants/routes";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FeatureShortcutCard } from "@/features/home/components/FeatureShortcutCard";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { SeasonSummaryCard } from "@/features/home/components/SeasonSummaryCard";
import { WeatherTodayCard } from "@/features/home/components/WeatherTodayCard";
import { getMyProfile, getWeather, listCalculators, type CalculatorRecord, type Profile } from "@/services/panenin-api";
import {
  formatCompactCurrency,
  getCalculatorMetrics,
  getWeatherIconSrc,
  getWeatherMetrics,
} from "@/services/display";

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestCalculator, setLatestCalculator] = useState<CalculatorRecord | null>(null);
  const [weatherState, setWeatherState] = useState<{
    temperature: string;
    condition: string;
    iconSrc: string;
    metrics: Array<{ iconSrc: string; iconAlt: string; value: string }>;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHome() {
      try {
        const nextProfile = await getMyProfile();

        if (cancelled) return;

        setProfile(nextProfile);

        const [calculators, weatherResponse] = await Promise.all([
          listCalculators().catch(() => []),
          nextProfile.kabupaten ? getWeather(nextProfile.kabupaten).catch(() => null) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        setLatestCalculator(calculators[0] ?? null);

        const firstWeather = weatherResponse?.data.data_cuaca.list[0];

        if (firstWeather) {
          setWeatherState({
            temperature: `${Math.round(firstWeather.main.temp)}°C`,
            condition: `${firstWeather.weather[0]?.description ?? "Tidak diketahui"} - ${weatherResponse.data.kabupaten}`,
            iconSrc: getWeatherIconSrc(firstWeather.weather[0]?.description ?? ""),
            metrics: getWeatherMetrics(firstWeather),
          });
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      }
    }

    void loadHome();

    return () => {
      cancelled = true;
    };
  }, []);

  const summaryMetrics = useMemo(() => getCalculatorMetrics(latestCalculator), [latestCalculator]);
  const displayName = profile?.display_name || profile?.email?.split("@")[0] || "Petani";
  const greetingInitial = displayName.charAt(0).toUpperCase() || "P";
  const subtitle = profile?.kabupaten
    ? `${new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date())} - ${profile.kabupaten}`
    : "Lengkapi profil untuk melihat cuaca daerahmu";

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <HomeHeader
        greeting={`Selamat datang, ${displayName}!`}
        subtitle={subtitle}
        initial={greetingInitial}
      />

      <section className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-[27px] px-[14px] pb-[27px] pt-4">
          <div className="flex flex-col gap-[15px] px-[10px]">
            <div className="flex flex-col gap-[10px]">
              <p className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
                CUACA HARI INI
              </p>
              <WeatherTodayCard
                temperature={weatherState?.temperature ?? "--"}
                condition={weatherState?.condition ?? "Belum ada data cuaca"}
                iconSrc={weatherState?.iconSrc ?? "/icons/berawan.png"}
                iconAlt="Cuaca hari ini"
                metrics={
                  weatherState?.metrics ?? [
                    { iconSrc: "/icons/humidity.png", iconAlt: "Kelembapan", value: "--" },
                    { iconSrc: "/icons/wind.png", iconAlt: "Kecepatan angin", value: "--" },
                    { iconSrc: "/icons/temperature.png", iconAlt: "Suhu", value: "--" },
                  ]
                }
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <p className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">FITUR</p>
              <div className="grid grid-cols-2 gap-[10px]">
                <FeatureShortcutCard
                  icon={<Image src="/icons/ai.svg" alt="Ikon Konsultasi AI" width={35} height={35} className="size-[35px]" />}
                  title="Konsultasi AI"
                  description="Tanya masalah tanaman"
                  href={AppRoutes.consultation}
                />
                <FeatureShortcutCard
                  icon={<Image src="/icons/weather.svg" alt="Ikon cuaca" width={35} height={35} className="size-[35px]" />}
                  title="Cuaca"
                  description="Prakiraan cuaca"
                  href={AppRoutes.weather}
                />
                <FeatureShortcutCard
                  icon={<Image src="/icons/calc.svg" alt="Ikon kalkulator" width={35} height={35} className="size-[35px]" />}
                  title="Kalkulator"
                  description="Hitung untung-rugi"
                  href={AppRoutes.calculator}
                />
                <FeatureShortcutCard
                  icon={<Image src="/icons/guide.svg" alt="Ikon panduan tanam" width={35} height={35} className="size-[35px]" />}
                  title="Panduan Tanam"
                  description="8 komoditas"
                  href={AppRoutes.plantingGuide}
                />
              </div>
            </div>

            <SeasonSummaryCard
              seasonLabel={
                latestCalculator
                  ? `Musim ini - ${latestCalculator.jenis_tanaman}`
                  : "Musim ini - belum ada data"
              }
              status={
                summaryMetrics.profit > 0
                  ? "Untung"
                  : summaryMetrics.profit < 0
                    ? "Rugi"
                    : "Netral"
              }
              metrics={[
                { label: "Modal", value: formatCompactCurrency(summaryMetrics.totalModal) },
                { label: "Pendapatan", value: formatCompactCurrency(summaryMetrics.revenue) },
                {
                  label: "Untung",
                  value: `${summaryMetrics.profit >= 0 ? "+ " : "- "}${formatCompactCurrency(Math.abs(summaryMetrics.profit))}`,
                  valueColor: summaryMetrics.profit >= 0 ? "#2d6a2d" : "#b82c2c",
                },
              ]}
            />
          </div>
        </div>

        <BottomNav activeTab="home" />
      </section>
    </main>
  );
}

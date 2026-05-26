"use client";

import { useEffect, useMemo, useState } from "react";

import { WeatherAdviceCard } from "@/features/weather/components/WeatherAdviceCard";
import { ForecastDayCard } from "@/features/weather/components/ForecastDayCard";
import { WeatherOverviewCard } from "@/features/weather/components/WeatherOverviewCard";
import { WeatherTopBar } from "@/features/weather/components/WeatherTopBar";
import {
  getMyProfile,
  getWeather,
  type Profile,
  type WeatherApiResponse,
  type WeatherForecastItem,
} from "@/services/panenin-api";
import {
  formatForecastDay,
  getWeatherIconSrc,
  getWeatherMetrics,
} from "@/services/display";

export default function WeatherPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [weatherResponse, setWeatherResponse] = useState<WeatherApiResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        const nextProfile = await getMyProfile();

        if (cancelled) return;

        setProfile(nextProfile);

        if (!nextProfile.kabupaten) {
          setErrorMessage("Kabupaten belum diisi. Lengkapi profil dulu ya.");
          return;
        }

        const nextWeather = await getWeather(nextProfile.kabupaten);

        if (cancelled) return;

        setWeatherResponse(nextWeather);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Gagal memuat data cuaca.",
          );
        }
      }
    }

    void loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  const forecastItems = weatherResponse?.data.data_cuaca.list ?? [];
  const selectedDay: WeatherForecastItem | null = forecastItems[selectedIndex] ?? forecastItems[0] ?? null;
  const adviceItems = weatherResponse?.data.rekomendasi_ai ? [weatherResponse.data.rekomendasi_ai] : [];

  const forecastCards = useMemo(
    () =>
      forecastItems.map((item, index) => ({
        id: `${item.dt}-${index}`,
        day: index === 0 ? "Hari ini" : formatForecastDay(item.dt_txt),
        temp: `${Math.round(item.main.temp)}°C`,
        iconSrc: getWeatherIconSrc(item.weather[0]?.description ?? ""),
        iconAlt: item.weather[0]?.description ?? "Cuaca",
      })),
    [forecastItems],
  );

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <WeatherTopBar title="Cuaca & Rekomendasi" />

      <section className="mx-auto flex w-full max-w-[393px] flex-col px-3 pb-10 pt-4">
        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-[10px]">
            <p className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
              CUACA HARI INI
            </p>

            <div className="flex flex-col gap-[15px]">
              <WeatherOverviewCard
                temperature={selectedDay ? `${Math.round(selectedDay.main.temp)}°C` : "--"}
                condition={
                  selectedDay
                    ? `${selectedDay.weather[0]?.description ?? "Tidak diketahui"} - ${profile?.kabupaten ?? ""}`
                    : errorMessage || "Belum ada data cuaca"
                }
                iconSrc={selectedDay ? getWeatherIconSrc(selectedDay.weather[0]?.description ?? "") : "/icons/berawan.png"}
                iconAlt={selectedDay?.weather[0]?.description ?? "Cuaca"}
                metrics={
                  selectedDay
                    ? getWeatherMetrics(selectedDay)
                    : [
                        { iconSrc: "/icons/humidity.png", iconAlt: "Kelembapan", value: "--" },
                        { iconSrc: "/icons/wind.png", iconAlt: "Kecepatan angin", value: "--" },
                        { iconSrc: "/icons/temperature.png", iconAlt: "Suhu", value: "--" },
                      ]
                }
              />

              <div className="flex gap-2">
                {forecastCards.length > 0 ? (
                  forecastCards.map((day, index) => (
                    <ForecastDayCard
                      key={day.id}
                      day={day.day}
                      iconSrc={day.iconSrc}
                      iconAlt={day.iconAlt}
                      temp={day.temp}
                      selected={index === selectedIndex}
                      onClick={() => setSelectedIndex(index)}
                    />
                  ))
                ) : (
                  <div className="rounded-[10px] border border-[#e0e0de] bg-white px-4 py-5 text-[14px] leading-[21px] text-[#6b6b68]">
                    {errorMessage || "Belum ada data prakiraan cuaca."}
                  </div>
                )}
              </div>
            </div>
          </div>

          <WeatherAdviceCard
            title="Saran dari PanenIn"
            items={adviceItems.length > 0 ? adviceItems : ["Saran cuaca belum tersedia saat ini."]}
          />
        </div>
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";

import { WeatherAdviceCard } from "@/features/weather/components/WeatherAdviceCard";
import { ForecastDayCard } from "@/features/weather/components/ForecastDayCard";
import { WeatherOverviewCard } from "@/features/weather/components/WeatherOverviewCard";
import { WeatherTopBar } from "@/features/weather/components/WeatherTopBar";

const forecastDays = [
  {
    id: "today",
    day: "Hari ini",
    iconSrc: "/icons/berawan.png",
    iconAlt: "Cuaca berawan",
    temp: "28°C",
    condition: "Berawan - Yogyakarta",
    advice: [
      "Waktu bagus untuk menyiram - lakukan pagi ini sebelum panas",
      "Kelembaban tinggi — waspadai penyakit jamur seperti blas dan hawar daun",
      "Tunda penyemprotan — diperkirakan hujan sore hari",
    ],
  },
  {
    id: "sat",
    day: "Sab",
    iconSrc: "/icons/cerah.svg",
    iconAlt: "Cuaca cerah",
    temp: "31°C",
    condition: "Cerah - Yogyakarta",
    advice: [
      "Manfaatkan cuaca cerah untuk pengeringan hasil panen setelah pukul 09.00",
      "Pantau kebutuhan air karena suhu naik lebih tinggi dari hari ini",
      "Penyemprotan preventif lebih aman dilakukan pagi hari sebelum matahari terik",
    ],
  },
  {
    id: "sun",
    day: "Min",
    iconSrc: "/icons/hujan.svg",
    iconAlt: "Cuaca hujan",
    temp: "25°C",
    condition: "Hujan - Yogyakarta",
    advice: [
      "Kurangi jadwal penyiraman karena tanah diperkirakan tetap lembap sepanjang hari",
      "Cek saluran air agar tidak terjadi genangan di area tanam",
      "Tunda aplikasi pupuk daun sampai hujan mereda agar tidak terbuang",
    ],
  },
  {
    id: "mon",
    day: "Sen",
    iconSrc: "/icons/berawan.png",
    iconAlt: "Cuaca berawan",
    temp: "29°C",
    condition: "Berawan - Yogyakarta",
    advice: [
      "Cuaca cukup aman untuk inspeksi daun dan batang di pagi hari",
      "Jaga sirkulasi udara area tanam untuk mengurangi risiko penyakit lembap",
      "Bisa mulai persiapan penyemprotan jika prakiraan hujan tetap rendah",
    ],
  },
  {
    id: "tue",
    day: "Sel",
    iconSrc: "/icons/cerah.svg",
    iconAlt: "Cuaca cerah",
    temp: "32°C",
    condition: "Cerah - Yogyakarta",
    advice: [
      "Naungan sementara bisa dipertimbangkan untuk bibit muda saat siang",
      "Pastikan jadwal penyiraman maju lebih pagi agar penguapan tidak terlalu tinggi",
      "Hindari pemupukan siang hari supaya akar tidak stres oleh panas",
    ],
  },
] as const;

export default function WeatherPage() {
  const [selectedDayId, setSelectedDayId] = useState<(typeof forecastDays)[number]["id"]>("today");

  const selectedDay = useMemo(
    () => forecastDays.find((item) => item.id === selectedDayId) ?? forecastDays[0],
    [selectedDayId],
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
                temperature={selectedDay.temp}
                condition={selectedDay.condition}
                iconSrc={selectedDay.iconSrc}
                iconAlt={selectedDay.iconAlt}
                metrics={[
                  { iconSrc: "/icons/humidity.png", iconAlt: "Kelembapan", value: "72%" },
                  { iconSrc: "/icons/wind.png", iconAlt: "Kecepatan angin", value: "12 km/h" },
                  { iconSrc: "/icons/temperature.png", iconAlt: "Suhu", value: "28°C" },
                ]}
              />

              <div className="flex gap-2">
                {forecastDays.map((day) => (
                  <ForecastDayCard
                    key={day.id}
                    day={day.day}
                    iconSrc={day.iconSrc}
                    iconAlt={day.iconAlt}
                    temp={day.temp}
                    selected={day.id === selectedDayId}
                    onClick={() => setSelectedDayId(day.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <WeatherAdviceCard title="Saran dari PanenIn" items={selectedDay.advice} />
        </div>
      </section>
    </main>
  );
}

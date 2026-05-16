import Image from "next/image";
import { AppRoutes } from "@/constants/routes";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FeatureShortcutCard } from "@/features/home/components/FeatureShortcutCard";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { SeasonSummaryCard } from "@/features/home/components/SeasonSummaryCard";
import { WeatherTodayCard } from "@/features/home/components/WeatherTodayCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <HomeHeader
        greeting="Selamat pagi, Doni!"
        subtitle="Kamis, 1 Mei - Yogyakarta"
        initial="S"
      />

      <section className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-[27px] px-[14px] pb-[27px] pt-4">
          <div className="flex flex-col gap-[15px] px-[10px]">
            <div className="flex flex-col gap-[10px]">
              <p className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
                CUACA HARI INI
              </p>
              <WeatherTodayCard
                temperature="28°C"
                condition="Berawan"
                iconSrc="/icons/berawan.png"
                iconAlt="Cuaca berawan"
                metrics={[
                  { iconSrc: "/icons/humidity.png", iconAlt: "Kelembapan", value: "72%" },
                  { iconSrc: "/icons/wind.png", iconAlt: "Kecepatan angin", value: "12 km/h" },
                  { iconSrc: "/icons/temperature.png", iconAlt: "Suhu", value: "28°C" },
                ]}
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
              seasonLabel="Musim ini - Padi"
              status="Untung"
              metrics={[
                { label: "Modal", value: "Rp 4,2jt" },
                { label: "Pendapatan", value: "Rp 6,8jt" },
                { label: "Untung", value: "+ Rp 2,6jt", valueColor: "#2d6a2d" },
              ]}
            />
          </div>
        </div>

        <BottomNav activeTab="home" />
      </section>
    </main>
  );
}

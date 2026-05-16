"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { AppIcon } from "@/components/ui/AppIcon";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { AppRoutes } from "@/constants/routes";
import { ProfileMenuRow } from "@/features/profile/components/ProfileMenuRow";

export default function ProfileNotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    weatherMorning: true,
    weatherAlert: false,
    plantingReminder: true,
    fertilizerReminder: true,
    harvestReminder: false,
    weeklyAiTips: true,
  });
  const [morningHour, setMorningHour] = useState(6);

  const updateSetting = (key: keyof typeof settings, checked: boolean) => {
    setSettings((current) => ({ ...current, [key]: checked }));
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader
        title="Pengaturan Notifikasi"
        onBack={() => router.push(AppRoutes.profile)}
      />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-[15px]">
          <div>
            <p className="pb-2 text-[14px] font-bold leading-[21px] text-[#6b6b68]">
              NOTIFIKASI HARIAN
            </p>
            <ProfileMenuRow
              icon={<AppIcon src="/icons/cuaca-pagi.svg" alt="Ikon cuaca pagi" size={20} />}
              label="Ringkasan Cuaca Pagi"
              rightSlot={
                <ToggleSwitch
                  checked={settings.weatherMorning}
                  onChange={(checked) => updateSetting("weatherMorning", checked)}
                  ariaLabel="Ringkasan cuaca pagi"
                />
              }
            />
            <ProfileMenuRow
              icon={<AppIcon src="/icons/alert.svg" alt="Ikon alert" size={20} />}
              label="Alert Cuaca Ekstrem"
              rightSlot={
                <ToggleSwitch
                  checked={settings.weatherAlert}
                  onChange={(checked) => updateSetting("weatherAlert", checked)}
                  ariaLabel="Alert cuaca ekstrem"
                />
              }
            />
            <ProfileMenuRow
              icon={<AppIcon src="/icons/pengingat-jadwal.svg" alt="Ikon pengingat jadwal tanam" size={20} />}
              label="Pengingat Jadwal Tanam"
              rightSlot={
                <ToggleSwitch
                  checked={settings.plantingReminder}
                  onChange={(checked) => updateSetting("plantingReminder", checked)}
                  ariaLabel="Pengingat jadwal tanam"
                />
              }
            />
          </div>

          <div>
            <p className="pb-2 text-[14px] font-bold leading-[21px] text-[#6b6b68]">
              NOTIFIKASI LAINNYA
            </p>
            <ProfileMenuRow
              icon={<AppIcon src="/icons/pengingat-pupuk.svg" alt="Ikon pengingat pupuk" size={20} />}
              label="Pengingat Jadwal Pupuk"
              rightSlot={
                <ToggleSwitch
                  checked={settings.fertilizerReminder}
                  onChange={(checked) => updateSetting("fertilizerReminder", checked)}
                  ariaLabel="Pengingat jadwal pupuk"
                />
              }
            />
            <ProfileMenuRow
              icon={<AppIcon src="/icons/pengingat-panen.svg" alt="Ikon pengingat panen" size={20} />}
              label="Pengingat Catat Panen"
              rightSlot={
                <ToggleSwitch
                  checked={settings.harvestReminder}
                  onChange={(checked) => updateSetting("harvestReminder", checked)}
                  ariaLabel="Pengingat catat panen"
                />
              }
            />
            <ProfileMenuRow
              icon={<AppIcon src="/icons/ai.svg" alt="Ikon AI" size={20} />}
              label="Tips AI Mingguan"
              rightSlot={
                <ToggleSwitch
                  checked={settings.weeklyAiTips}
                  onChange={(checked) => updateSetting("weeklyAiTips", checked)}
                  ariaLabel="Tips AI mingguan"
                />
              }
            />
          </div>

          <article className="rounded-[10px] border border-[#e0e0de] bg-[#ebf5eb] p-5">
            <div>
              <p className="text-[14px] font-bold leading-[21px] text-[#1a1a18]">
                Jam Notifikasi Pagi
              </p>
              <p className="text-[14px] font-normal leading-[21px] text-[#6b6b68]">
                Ringkasan cuaca dikirim setipa pagi
              </p>
            </div>

            <div className="mt-[15px] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMorningHour((current) => Math.max(4, current - 1))}
                className="flex size-[30px] items-center justify-center rounded-full border border-[#e0e0de] bg-white text-[18px] text-[#2d6a2d]"
              >
                +
              </button>
              <p className="text-[18px] font-bold leading-[27px] text-[#2d6a2d]">
                {String(morningHour).padStart(2, "0")}.00
              </p>
              <button
                type="button"
                onClick={() => setMorningHour((current) => Math.min(9, current + 1))}
                className="flex size-[30px] items-center justify-center rounded-full border border-[#e0e0de] bg-white text-[18px] text-[#6b6b68]"
              >
                −
              </button>
            </div>
          </article>
        </div>

        <StickyActionBar>
          <PrimaryButton fullWidth>Simpan Pengaturan</PrimaryButton>
        </StickyActionBar>
      </section>
    </main>
  );
}

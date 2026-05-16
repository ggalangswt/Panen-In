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

export default function ProfilePrivacySecurityPage() {
  const router = useRouter();
  const [activeDeviceMonitoring, setActiveDeviceMonitoring] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader
        title="Privasi & Keamanan"
        onBack={() => router.push(AppRoutes.profile)}
      />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-5 px-5 pb-6 pt-[15px]">
          <div>
            <p className="pb-2 text-[14px] font-bold leading-[21px] text-[#6b6b68]">
              KEAMANAN AKUN
            </p>
            <ProfileMenuRow
              icon={<AppIcon src="/icons/perangkat.svg" alt="Ikon perangkat" size={25} />}
              label="Perangkat Aktif"
              description="1 perangkat tersambung"
              rightSlot={
                <ToggleSwitch
                  checked={activeDeviceMonitoring}
                  onChange={setActiveDeviceMonitoring}
                  ariaLabel="Perangkat aktif"
                />
              }
            />
            <div className="py-[15px]">
              <div className="flex items-center gap-[10px]">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#fff0f0]">
                  <AppIcon src="/icons/logout.svg" alt="Ikon keluar" size={18} />
                </span>
                <span className="text-[14px] font-bold leading-[21px] text-[#b82c2c]">
                  Keluar dari Semua Perangkat
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="pb-2 text-[14px] font-bold leading-[21px] text-[#6b6b68]">
              DATA & PRIVASI
            </p>
            <ProfileMenuRow
              icon={<AppIcon src="/icons/privacy.svg" alt="Ikon privasi lokasi" size={20} />}
              label="Izinkan Lokasi"
              rightSlot={
                <ToggleSwitch
                  checked={locationAllowed}
                  onChange={setLocationAllowed}
                  ariaLabel="Izinkan lokasi"
                />
              }
            />
          </div>
        </div>

        <StickyActionBar>
          <PrimaryButton fullWidth>Simpan Pengaturan</PrimaryButton>
        </StickyActionBar>
      </section>
    </main>
  );
}

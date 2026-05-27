"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { AppIcon } from "@/components/ui/AppIcon";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { AppRoutes } from "@/constants/routes";
import { ProfileMenuRow } from "@/features/profile/components/ProfileMenuRow";
import {
  getBrowserLocationPermissionState,
  getStoredLocationOptIn,
  resolveKabupatenFromCurrentLocation,
  setStoredLocationOptIn,
} from "@/services/location";
import { getMyProfile, updateMyProfile } from "@/services/panenin-api";

export default function ProfilePrivacySecurityPage() {
  const router = useRouter();
  const [activeDeviceMonitoring, setActiveDeviceMonitoring] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentKabupaten, setCurrentKabupaten] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLocationState() {
      const [permissionState, profile] = await Promise.all([
        getBrowserLocationPermissionState(),
        getMyProfile().catch(() => null),
      ]);

      if (cancelled) return;

      const enabled = permissionState !== "denied" && getStoredLocationOptIn();
      setLocationAllowed(enabled);
      setCurrentKabupaten(profile?.kabupaten || "");
    }

    void loadLocationState();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLocationToggle = async (checked: boolean) => {
    setLocationMessage("");

    if (!checked) {
      setStoredLocationOptIn(false);
      setLocationAllowed(false);
      setLocationMessage(
        "Akses lokasi dimatikan di aplikasi. Untuk mencabut izin browser sepenuhnya, ubah di pengaturan browser.",
      );
      return;
    }

    setLocationLoading(true);

    try {
      const result = await resolveKabupatenFromCurrentLocation();
      await updateMyProfile({ kabupaten: result.kabupaten });
      setStoredLocationOptIn(true);
      setLocationAllowed(true);
      setCurrentKabupaten(result.kabupaten);
      setLocationMessage(`Lokasi aktif. Kabupaten terisi ke ${result.kabupaten}.`);
    } catch (error) {
      setStoredLocationOptIn(false);
      setLocationAllowed(false);
      setLocationMessage(
        error instanceof Error ? error.message : "Gagal mengaktifkan akses lokasi.",
      );
    } finally {
      setLocationLoading(false);
    }
  };

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
              description={currentKabupaten || "Belum ada kabupaten dari lokasi perangkat"}
              rightSlot={
                <ToggleSwitch
                  checked={locationAllowed}
                  onChange={handleLocationToggle}
                  ariaLabel="Izinkan lokasi"
                />
              }
            />
            {locationMessage ? (
              <p className="pt-2 text-[12px] leading-[18px] text-[#6b6b68]">
                {locationMessage}
              </p>
            ) : null}
          </div>
        </div>

        <StickyActionBar>
          <PrimaryButton
            fullWidth
            disabled={locationLoading}
            onClick={() => router.push(AppRoutes.profile)}
          >
            {locationLoading ? "Menyimpan..." : "Simpan Pengaturan"}
          </PrimaryButton>
        </StickyActionBar>
      </section>
    </main>
  );
}

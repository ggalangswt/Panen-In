"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppIcon } from "@/components/ui/AppIcon";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useAuth } from "@/components/providers/AuthProvider";
import { plantOptions } from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";
import { ProfileMenuRow } from "@/features/profile/components/ProfileMenuRow";
import {
  getMyProfile,
  getNotificationSettings,
  listCalculators,
  registerNotificationToken,
  updateNotificationSettings,
  type NotificationSettings,
  type Profile,
} from "@/services/panenin-api";
import { requestPushNotificationToken } from "@/services/push-notifications";
import { formatCompactCurrency, getCalculatorMetrics } from "@/services/display";

function BellIcon() {
  return <AppIcon src="/icons/notif.svg" alt="Ikon notifikasi" size={20} />;
}

function OfflineIcon() {
  return <AppIcon src="/icons/offline.svg" alt="Ikon mode offline" size={20} />;
}

function PersonIcon() {
  return <AppIcon src="/icons/profile.svg" alt="Ikon profil" size={20} />;
}

function ShieldIcon() {
  return <AppIcon src="/icons/privacy.svg" alt="Ikon privasi" size={20} />;
}

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState("");

  const browserTimezone =
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta"
      : "Asia/Jakarta";

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const [nextProfile, nextSettings, calculators] = await Promise.all([
          getMyProfile(),
          getNotificationSettings(),
          listCalculators().catch(() => []),
        ]);

        if (cancelled) return;

        setProfile(nextProfile);
        setSettings(nextSettings);
        setTotalProfit(
          calculators.reduce((sum, item) => sum + getCalculatorMetrics(item).profit, 0),
        );
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const userPlants = useMemo(
    () =>
      plantOptions.filter((plant) =>
        profile?.preferred_plants.includes(plant.id) ||
        profile?.preferred_plants.includes(plant.label),
      ),
    [profile?.preferred_plants],
  );

  const handleNotificationsToggle = async (checked: boolean) => {
    setNotificationMessage("");
    setSettings((current) =>
      current ? { ...current, notifications_enabled: checked } : current,
    );

    try {
      if (checked) {
        const token = await requestPushNotificationToken();

        await registerNotificationToken({
          token,
          device_type: "web",
        });
      }

      const nextSettings = await updateNotificationSettings({
        notifications_enabled: checked,
        timezone: browserTimezone,
      });
      setSettings(nextSettings);
      setNotificationMessage(
        checked
          ? "Notifikasi browser berhasil diaktifkan."
          : "Notifikasi browser dinonaktifkan.",
      );
    } catch (error) {
      setSettings((current) =>
        current ? { ...current, notifications_enabled: !checked } : current,
      );
      setNotificationMessage(
        error instanceof Error
          ? error.message
          : checked
            ? "Izin atau registrasi notifikasi browser gagal."
            : "Gagal memperbarui pengaturan notifikasi.",
      );
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace(AppRoutes.login);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <section className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col">
        <div className="rounded-b-[20px] bg-[#2d6a2d] px-5 py-[15px]">
          <div className="flex h-[163px] flex-col items-center justify-center gap-2">
            <Image
              src="/profile.jpg"
              alt="Foto profil pengguna"
              width={80}
              height={80}
              className="size-20 rounded-full object-cover"
            />
            <div className="text-center">
              <p className="text-[15px] font-medium leading-[22.5px] text-white">
                {profile?.display_name || profile?.email?.split("@")[0] || "Petani"}
              </p>
              <p className="text-[12px] font-normal leading-[18px] text-[#e0e0de]">
                {profile?.kabupaten || "Kabupaten belum diisi"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-[#e0e0de] bg-white py-[15px] text-center">
          <p className="text-[12px] font-normal leading-[18px] text-[#6b6b68]">Total Untung</p>
          <p className="text-[15px] font-medium leading-[22.5px] text-[#1a1a18]">
            {formatCompactCurrency(totalProfit)}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-[15px] px-5 py-[15px]">
          <div className="flex flex-col gap-[10px]">
            <p className="text-[14px] font-bold leading-[21px] text-[#6b6b68]">TANAMAN KAMU</p>
            <div className="rounded-[10px] border border-[#e0e0de] bg-[#f7f7f5] px-5 py-[10px]">
              <div className="flex flex-wrap items-center gap-2">
                {userPlants.length > 0 ? (
                  userPlants.map((plant) => (
                    <div key={plant.id} className="flex items-center gap-2">
                      <span className="text-[25px] leading-none">{plant.emoji}</span>
                      <span className="text-[15px] font-medium leading-[22.5px] text-[#1a1a18]">
                        {plant.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[14px] leading-[21px] text-[#6b6b68]">
                    Belum ada tanaman dipilih.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-0">
            <p className="pb-2 text-[14px] font-bold leading-[21px] text-[#6b6b68]">
              PENGATURAN APLIKASI
            </p>
            <div>
              <div
                role={settings?.notifications_enabled ? "button" : undefined}
                tabIndex={settings?.notifications_enabled ? 0 : -1}
                onClick={() => {
                  if (settings?.notifications_enabled) {
                    router.push(AppRoutes.profileNotifications);
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    settings?.notifications_enabled &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    router.push(AppRoutes.profileNotifications);
                  }
                }}
                className="border-b border-[#e0e0de]"
              >
                <div className="flex items-center justify-between py-[15px]">
                  <div className="flex items-center gap-[10px]">
                    <span className="shrink-0">
                      <BellIcon />
                    </span>
                    <span className="text-[14px] font-medium leading-[21px] text-[#1a1a18]">
                      Notifikasi
                    </span>
                  </div>
                  <div onClick={(event) => event.stopPropagation()}>
                    <ToggleSwitch
                      checked={settings?.notifications_enabled ?? true}
                      onChange={handleNotificationsToggle}
                      ariaLabel="Aktifkan notifikasi"
                    />
                  </div>
                </div>
              </div>
              <ProfileMenuRow
                icon={<OfflineIcon />}
                label="Mode Offline"
                rightSlot={
                  <ToggleSwitch
                    checked={offlineEnabled}
                    onChange={setOfflineEnabled}
                    ariaLabel="Aktifkan mode offline"
                  />
                }
              />
            </div>
            {notificationMessage ? (
              <p className="pt-2 text-[12px] leading-[18px] text-[#6b6b68]">
                {notificationMessage}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-0">
            <p className="pb-2 text-[14px] font-bold leading-[21px] text-[#6b6b68]">
              PENGATURAN AKUN
            </p>
            <div>
              <ProfileMenuRow
                icon={<PersonIcon />}
                label="Informasi Pribadi"
                href={AppRoutes.profilePersonalInfo}
              />
              <ProfileMenuRow
                icon={<ShieldIcon />}
                label="Privasi & Keamanan"
                href={AppRoutes.profilePrivacySecurity}
              />
            </div>
          </div>

          <div className="mt-auto bg-white py-5 text-center">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-[10px] text-[15px] font-bold leading-[22.5px] text-[#b82c2c]"
            >
              <AppIcon src="/icons/logout.svg" alt="Ikon keluar" size={20} />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>

        <BottomNav activeTab="profile" />
      </section>
    </main>
  );
}

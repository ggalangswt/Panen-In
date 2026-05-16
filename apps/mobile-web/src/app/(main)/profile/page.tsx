"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppIcon } from "@/components/ui/AppIcon";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { plantOptions } from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";
import { ProfileMenuRow } from "@/features/profile/components/ProfileMenuRow";

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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineEnabled, setOfflineEnabled] = useState(false);

  const userPlants = plantOptions.filter((plant) =>
    ["padi", "jagung"].includes(plant.id),
  );

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <section className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col">
        <div className="rounded-b-[20px] bg-[#2d6a2d] px-5 py-[15px]">
          <div className="flex h-[163px] flex-col items-center justify-center gap-2">
            <Image
              src="/profile.jpg"
              alt="Foto profil Suparman"
              width={80}
              height={80}
              className="size-20 rounded-full object-cover"
            />
            <div className="text-center">
              <p className="text-[15px] font-medium leading-[22.5px] text-white">Suparman</p>
              <p className="text-[12px] font-normal leading-[18px] text-[#e0e0de]">
                Yogyakarta
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-[#e0e0de] bg-white py-[15px] text-center">
          <p className="text-[12px] font-normal leading-[18px] text-[#6b6b68]">Total Untung</p>
          <p className="text-[15px] font-medium leading-[22.5px] text-[#1a1a18]">Rp 2,6jt</p>
        </div>

        <div className="flex flex-1 flex-col gap-[15px] px-5 py-[15px]">
          <div className="flex flex-col gap-[10px]">
            <p className="text-[14px] font-bold leading-[21px] text-[#6b6b68]">TANAMAN KAMU</p>
            <div className="rounded-[10px] border border-[#e0e0de] bg-[#f7f7f5] px-5 py-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-[25px] leading-none">{userPlants[0]?.emoji ?? "🌾"}</span>
                <span className="text-[15px] font-medium leading-[22.5px] text-[#1a1a18]">
                  {userPlants[0]?.label ?? "Padi"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-0">
            <p className="pb-2 text-[14px] font-bold leading-[21px] text-[#6b6b68]">
              PENGATURAN APLIKASI
            </p>
            <div>
              <div
                role={notificationsEnabled ? "button" : undefined}
                tabIndex={notificationsEnabled ? 0 : -1}
                onClick={() => {
                  if (notificationsEnabled) {
                    router.push(AppRoutes.profileNotifications);
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    notificationsEnabled &&
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
                      checked={notificationsEnabled}
                      onChange={setNotificationsEnabled}
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
            <Link href={AppRoutes.login} className="inline-flex items-center gap-[10px] text-[15px] font-bold leading-[22.5px] text-[#b82c2c]">
              <AppIcon src="/icons/logout.svg" alt="Ikon keluar" size={20} />
              <span>Keluar dari Akun</span>
            </Link>
          </div>
        </div>

        <BottomNav activeTab="profile" />
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FeatureTextInput } from "@/components/ui/FeatureTextInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { plantOptions } from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";

export default function PersonalInfoPage() {
  const router = useRouter();
  const selectedPlants = ["padi", "jagung"];

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader
        title="Informasi Pribadi"
        onBack={() => router.push(AppRoutes.profile)}
      />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-[15px] px-5 pb-6 pt-[15px]">
          <div className="flex flex-col items-center gap-2 py-[10px]">
            <Image
              src="/profile.jpg"
              alt="Foto profil Suparman"
              width={80}
              height={80}
              className="size-20 rounded-full object-cover"
            />
            <div className="text-center text-[#1a1a18]">
              <p className="text-[15px] font-medium leading-[22.5px]">Suparman</p>
              <p className="text-[12px] font-normal leading-[18px]">Yogyakarta</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <SectionTitle>Nama</SectionTitle>
            <FeatureTextInput value="Suparman" readOnly />
          </div>

          <div className="flex flex-col gap-1">
            <SectionTitle>Kabupaten / Kota</SectionTitle>
            <FeatureTextInput value="Magelang" readOnly />
          </div>

          <div className="flex flex-col gap-1">
            <SectionTitle>Email</SectionTitle>
            <FeatureTextInput value="suparman@mail.com" readOnly />
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className="text-[14px] font-bold leading-[21px] text-[#6b6b68]">TANAMAN KAMU</p>
            <div className="grid grid-cols-4 gap-[10px]">
              {plantOptions.map((plant) => {
                const isSelected = selectedPlants.includes(plant.id);

                return (
                  <div
                    key={plant.id}
                    className={`flex flex-col items-center justify-center gap-1 rounded-[10px] border p-5 ${
                      isSelected
                        ? "border-[#2d6a2d] bg-[#ebf5eb]"
                        : "border-[#e0e0de] bg-white"
                    }`}
                  >
                    <span className="text-[18px] leading-none">{plant.emoji}</span>
                    <span className="text-[12px] font-medium leading-[18px] text-[#1a1a18] text-center">
                      {plant.label === "Sayuran Hijau" ? "Sayuran" : plant.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <StickyActionBar>
          <PrimaryButton fullWidth>Simpan Perubahan</PrimaryButton>
        </StickyActionBar>
      </section>
    </main>
  );
}

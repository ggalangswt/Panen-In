"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FeatureTextInput } from "@/components/ui/FeatureTextInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { plantOptions } from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";
import { getMyProfile, updateMyProfile, type Profile } from "@/services/panenin-api";

export default function PersonalInfoPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const nextProfile = await getMyProfile();

        if (cancelled) return;

        setProfile(nextProfile);
        setName(nextProfile.display_name || "");
        setKabupaten(nextProfile.kabupaten || "");
        setSelectedPlants(nextProfile.preferred_plants);
      } catch {
        if (!cancelled) {
          setMessage("Gagal memuat profil.");
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayPlants = useMemo(
    () =>
      plantOptions.map((plant) => ({
        ...plant,
        selected:
          selectedPlants.includes(plant.id) || selectedPlants.includes(plant.label),
      })),
    [selectedPlants],
  );

  const togglePlant = (plantId: string) => {
    setSelectedPlants((current) =>
      current.includes(plantId)
        ? current.filter((item) => item !== plantId)
        : [...current, plantId],
    );
  };

  const handleSave = async () => {
    setSubmitting(true);
    setMessage("");

    try {
      const updatedProfile = await updateMyProfile({
        display_name: name.trim(),
        kabupaten: kabupaten.trim(),
        preferred_plants: selectedPlants,
      });

      setProfile(updatedProfile);
      setSelectedPlants(updatedProfile.preferred_plants);
      setMessage("Perubahan profil berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan profil.");
    } finally {
      setSubmitting(false);
    }
  };

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
              alt="Foto profil pengguna"
              width={80}
              height={80}
              className="size-20 rounded-full object-cover"
            />
            <div className="text-center text-[#1a1a18]">
              <p className="text-[15px] font-medium leading-[22.5px]">
                {name || profile?.email?.split("@")[0] || "Petani"}
              </p>
              <p className="text-[12px] font-normal leading-[18px]">
                {kabupaten || "Kabupaten belum diisi"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <SectionTitle>Nama</SectionTitle>
            <FeatureTextInput value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <SectionTitle>Kabupaten / Kota</SectionTitle>
            <FeatureTextInput value={kabupaten} onChange={(event) => setKabupaten(event.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <SectionTitle>Email</SectionTitle>
            <FeatureTextInput value={profile?.email || ""} readOnly />
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className="text-[14px] font-bold leading-[21px] text-[#6b6b68]">TANAMAN KAMU</p>
            <div className="grid grid-cols-4 gap-[10px]">
              {displayPlants.map((plant) => (
                <button
                  type="button"
                  key={plant.id}
                  onClick={() => togglePlant(plant.id)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-[10px] border p-5 ${
                    plant.selected
                      ? "border-[#2d6a2d] bg-[#ebf5eb]"
                      : "border-[#e0e0de] bg-white"
                  }`}
                >
                  <span className="text-[18px] leading-none">{plant.emoji}</span>
                  <span className="text-center text-[12px] font-medium leading-[18px] text-[#1a1a18]">
                    {plant.label === "Sayuran Hijau" ? "Sayuran" : plant.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {message ? (
            <p className={`text-[12px] leading-[18px] ${message.includes("berhasil") ? "text-[#2d6a2d]" : "text-[#b82c2c]"}`}>
              {message}
            </p>
          ) : null}
        </div>

        <StickyActionBar>
          <PrimaryButton fullWidth disabled={submitting} onClick={handleSave}>
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </PrimaryButton>
        </StickyActionBar>
      </section>
    </main>
  );
}

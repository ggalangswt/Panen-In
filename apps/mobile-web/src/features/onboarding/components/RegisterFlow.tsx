"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppRoutes } from "@/constants/routes";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import { useAuth } from "@/components/providers/AuthProvider";
import { AuthInputField } from "@/features/onboarding/components/AuthInputField";
import { OnboardingHero } from "@/features/onboarding/components/OnboardingHero";
import { OnboardingHeader } from "@/features/onboarding/components/OnboardingHeader";
import { OnboardingProgress } from "@/features/onboarding/components/OnboardingProgress";
import { PlantSelector } from "@/features/onboarding/components/PlantSelector";
import {
  savePendingOnboardingDraft,
  signUpWithEmailPassword,
  syncPendingOnboardingDraft,
} from "@/services/auth";
import { resolveKabupatenFromCurrentLocation } from "@/services/location";

const totalSteps = 4;
const vineyardImage = "/login-hero.png";
const locationImage = "/register-location.png";

export function RegisterFlow() {
  const router = useRouter();
  const { loading, session } = useAuth();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nextStep = () => setStep((current) => Math.min(current + 1, totalSteps - 1));
  const togglePlant = (id: string) => {
    setSelectedPlants((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  useEffect(() => {
    if (!loading && session) {
      router.replace(AppRoutes.home);
    }
  }, [loading, router, session]);

  const handleUseCurrentLocation = async () => {
    setDetectingLocation(true);
    setErrorMessage("");

    try {
      const result = await resolveKabupatenFromCurrentLocation();
      setKabupaten(result.kabupaten);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal membaca lokasi perangkat.",
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      savePendingOnboardingDraft({
        display_name: name.trim(),
        kabupaten: kabupaten.trim(),
        preferred_plants: selectedPlants,
      });

      const signUpResult = await signUpWithEmailPassword(email.trim(), password);

      if (signUpResult.session) {
        await syncPendingOnboardingDraft(signUpResult.session);
        router.replace(AppRoutes.home);
        return;
      }

      router.replace(`${AppRoutes.login}?registered=1`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal membuat akun. Coba lagi.",
      );
      setSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] text-[#1a1a18]">
        <OnboardingHeader activeStep={step} />

        <section className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-[393px] flex-col px-[17px] pt-[26px]">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="flex flex-col gap-[5px]">
                <h1 className="text-[22px] font-medium leading-[29px] text-[#1a1a18]">
                  Kamu biasanya tanam apa?
                </h1>
                <p className="text-[12px] font-normal leading-[18px] text-[#6b6b68]">
                  Kamu biasanya tanam apa?
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pb-6">
                <PlantSelector selectedIds={selectedPlants} onToggle={togglePlant} />
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 -mx-[17px] mt-auto bg-[#f7f7f5] px-[17px] pb-8 pt-4">
              <div className="flex flex-col gap-6">
                {selectedPlants.length > 0 ? (
                  <div className="rounded-[10px] border border-[#c6dfc6] bg-[#ebf5eb] px-[10px] py-[15px]">
                    <p className="text-[14px] font-normal leading-[21px] text-[#1a4d1a]">
                      Pilihanmu akan membantuku memberi saran pupuk yang tepat.
                    </p>
                  </div>
                ) : null}

                <PrimaryButton
                  variant="solid"
                  fullWidth
                  disabled={submitting}
                  onClick={handleComplete}
                >
                  {submitting ? "Membuat akun..." : "Selesai Masuk"}
                </PrimaryButton>

                {errorMessage ? (
                  <p className="text-center text-[12px] leading-[18px] text-[#b82c2c]">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const slideContent = [
    {
      title: "Tuliskan email",
      description: "Supaya PanenIn selalu terhubung sama kamu",
      hero: <OnboardingHero imageUrl={vineyardImage} alt="Lanskap lahan pertanian" />,
      fields: (
        <div className="flex w-full flex-col gap-2.5">
          <AuthInputField
            icon="email"
            placeholder="Tulis emailmu di sini"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <AuthInputField
            icon="password"
            placeholder="Masukkan password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>
      ),
      footer: (
        <>
          <PrimaryButton variant="solid" fullWidth onClick={nextStep}>
            Lanjut
          </PrimaryButton>
          <p className="text-center text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]">
            Sudah punya akun?{" "}
            <Link href={AppRoutes.login} className="font-bold underline-offset-4 hover:underline">
              Masuk
            </Link>
          </p>
        </>
      ),
    },
    {
      title: "Siapa nama kamu?",
      description: "Supaya PanenIn bisa sapa kamu tiap hari",
      hero: <OnboardingHero imageUrl={vineyardImage} alt="Lanskap lahan pertanian" />,
      fields: (
        <AuthInputField
          placeholder="Tulis namamu di sini"
          type="text"
          value={name}
          onChange={setName}
        />
      ),
      footer: (
        <PrimaryButton variant="solid" fullWidth onClick={nextStep}>
          Lanjut
        </PrimaryButton>
      ),
    },
    {
      title: "Boleh tahu lokasimu?",
      description: "Biar PanenIn bisa kasih info cuaca dan saran yang pas buat daerahmu",
      hero: (
        <div className="flex justify-center">
          <OnboardingHero
            imageUrl={locationImage}
            alt="Ilustrasi peta lokasi"
            heightClassName="h-[288px] w-[332px]"
          />
        </div>
      ),
      fields: (
        <div className="flex flex-col gap-2">
          <LocationCombobox
            placeholder="Cari kabupaten atau kota kamu"
            value={kabupaten}
            onChange={setKabupaten}
          />
          <p className="text-[12px] leading-[18px] text-[#6b6b68]">
            Pilih manual atau pakai lokasi perangkat untuk mengisi otomatis.
          </p>
        </div>
      ),
      footer: (
        <>
          <PrimaryButton
            variant="solid"
            fullWidth
            disabled={detectingLocation}
            onClick={handleUseCurrentLocation}
          >
            {detectingLocation ? "Mendeteksi Lokasi..." : "Izinkan Lokasi"}
          </PrimaryButton>
          <button
            type="button"
            onClick={nextStep}
            className="text-center text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]"
          >
            Nanti Saja
          </button>
        </>
      ),
    },
  ][step];

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#1a1a18]">
      <section className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col items-center px-[6px] pt-16">
        <div className="flex w-full min-h-screen flex-col items-center gap-[10px]">
          <div className="flex w-full flex-col items-center gap-[15px]">
            <OnboardingProgress activeStep={step} />
            {slideContent.hero}
          </div>

          <div className="flex min-h-0 w-[380px] flex-1 flex-col px-2.5 py-2.5">
            <div className="flex w-full flex-col items-center gap-5 px-2.5 py-2.5">
              <div className="flex w-full flex-col items-center justify-center gap-2.5 px-2.5 py-2.5 text-center">
                <h1 className="text-[22px] font-medium leading-[29px] text-[#1a1a18]">
                  {slideContent.title}
                </h1>
                <p className="max-w-[300px] text-sm font-normal leading-[21px] text-[#6b6b68]">
                  {slideContent.description}
                </p>
              </div>

              {slideContent.fields ? (
                <div className="flex w-full flex-col gap-2.5">{slideContent.fields}</div>
              ) : null}
            </div>

            <div className="sticky bottom-0 left-0 right-0 -mx-[16px] mt-auto bg-[#f7f7f5] px-[16px] pb-6 pt-4">
              <div className="flex w-full flex-col items-center gap-[15px]">
                {slideContent.footer}
                {step === 2 ? (
                  <PrimaryButton variant="light" fullWidth onClick={nextStep}>
                    Lanjut
                  </PrimaryButton>
                ) : null}
                {errorMessage && step === 2 ? (
                  <p className="text-center text-[12px] leading-[18px] text-[#b82c2c]">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FeatureTextInput } from "@/components/ui/FeatureTextInput";
import { PlantChipSelector } from "@/components/ui/PlantChipSelector";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  consultationMockResults,
  consultationSymptoms,
  plantOptions,
  type PlantId,
} from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";
import { ConsultationResultCard } from "@/features/consultation/components/ConsultationResultCard";
import { ConsultationSymptomGrid } from "@/features/consultation/components/ConsultationSymptomGrid";

export default function ConsultationPage() {
  const router = useRouter();
  const [selectedPlant, setSelectedPlant] = useState<PlantId>("padi");
  const [selectedSymptom, setSelectedSymptom] = useState<string>("Daun menguning");
  const [customProblem, setCustomProblem] = useState("");
  const [showResult, setShowResult] = useState(false);

  const activeProblem = customProblem.trim() || selectedSymptom;
  const selectedPlantLabel =
    plantOptions.find((plant) => plant.id === selectedPlant)?.label ?? "Padi";
  const result = useMemo(
    () => consultationMockResults[selectedPlant],
    [selectedPlant],
  );

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }

    router.push(AppRoutes.home);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader
        title={showResult ? "Hasil Konsultasi AI" : "Konsultasi AI"}
        onBack={handleBack}
      />

      {!showResult ? (
        <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
          <div className="flex flex-1 flex-col gap-5 px-[14px] pb-6 pt-5">
            <div className="flex flex-col gap-[10px]">
              <SectionTitle>PILIH TANAMAN</SectionTitle>
              <PlantChipSelector
                selectedId={selectedPlant}
                onSelect={setSelectedPlant}
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <SectionTitle>FITUR</SectionTitle>
              <ConsultationSymptomGrid
                symptoms={consultationSymptoms}
                selectedSymptom={selectedSymptom}
                onSelect={setSelectedSymptom}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-[#e0e0de]" />
              <span className="text-[15px] font-medium leading-[22.5px] text-[#6b6b68]">
                atau
              </span>
              <div className="h-px flex-1 bg-[#e0e0de]" />
            </div>

            <FeatureTextInput
              multiline
              placeholder="Ketik masalah tanamanmu di sini..."
              value={customProblem}
              onChange={(event) => setCustomProblem(event.target.value)}
            />
          </div>

          <StickyActionBar>
            <PrimaryButton fullWidth onClick={() => setShowResult(true)}>
              Konsultasikan
            </PrimaryButton>
          </StickyActionBar>
        </section>
      ) : (
        <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
          <div className="flex flex-1 flex-col gap-[15px] px-[14px] pb-6 pt-[15px]">
            <div className="flex">
              <div className="rounded-full border border-[#c6dfc6] bg-[#ebf5eb] px-[30px] py-[10px] text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]">
                {selectedPlantLabel} - {activeProblem}
              </div>
            </div>

            <ConsultationResultCard
              title="Kemungkinan Penyebab"
              items={result.possibleCauses}
            />
            <ConsultationResultCard
              title="Rekomendasi Tindakan"
              items={result.recommendations}
              accent
            />
            <ConsultationResultCard
              title="Tips Pencegahan"
              items={result.preventionTips}
            />
          </div>

          <StickyActionBar>
            <div className="grid grid-cols-2 gap-[10px]">
              <PrimaryButton
                fullWidth
                variant="light"
                className="border border-[#c6dfc6] bg-[#ebf5eb] text-[15px] leading-[22.5px] text-[#2d6a2d]"
              >
                Simpan ke Catatan
              </PrimaryButton>
              <PrimaryButton
                fullWidth
                className="text-[15px] leading-[22.5px]"
                onClick={() => setShowResult(false)}
              >
                Tanya lagi
              </PrimaryButton>
            </div>
          </StickyActionBar>
        </section>
      )}
    </main>
  );
}

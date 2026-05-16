"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { guideContent, type PlantId, plantOptions } from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";
import { GuideStageCard } from "@/features/planting-guide/components/GuideStageCard";
import { PlantGuideGrid } from "@/features/planting-guide/components/PlantGuideGrid";

export default function PlantingGuidePage() {
  const router = useRouter();
  const [selectedPlant, setSelectedPlant] = useState<PlantId | null>(null);

  const selectedGuide = selectedPlant ? guideContent[selectedPlant] : null;
  const selectedEmoji =
    plantOptions.find((plant) => plant.id === selectedPlant)?.emoji ?? "🌾";

  const handleBack = () => {
    if (selectedPlant) {
      setSelectedPlant(null);
      return;
    }

    router.push(AppRoutes.home);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader title="Panduan Tanam" onBack={handleBack} />

      <section className="mx-auto w-full max-w-[393px] px-3 pb-8 pt-4">
        {!selectedGuide ? (
          <PlantGuideGrid onSelect={setSelectedPlant} />
        ) : (
          <div className="flex flex-col gap-[15px]">
            <article className="rounded-[10px] border border-[#c6dfc6] bg-[#ebf5eb] p-[15px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-bold leading-[27px] text-[#2d6a2d]">
                    {selectedGuide.title}
                  </h2>
                  <p className="text-[14px] font-normal leading-[21px] text-[#6b6b68]">
                    {selectedGuide.season}
                  </p>
                  <p className="text-[14px] font-normal leading-[21px] text-[#6b6b68]">
                    {selectedGuide.suitableFor}
                  </p>
                </div>
                <span className="text-[40px] leading-none">{selectedEmoji}</span>
              </div>

              <div className="mt-[10px] flex flex-wrap gap-[10px]">
                {selectedGuide.regions.map((region) => (
                  <span
                    key={region}
                    className="rounded-full border border-[#c6dfc6] bg-white px-[10px] py-1 text-[12px] font-medium leading-[18px] text-[#2d6a2d]"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </article>

            <button
              type="button"
              className="flex h-[53px] items-center justify-center gap-1 rounded-[10px] border border-[#2d6a2d] bg-white px-[15px] text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]"
            >
              <span className="text-[18px]">🔔</span>
              <span>Jadikan Pengingat Jadwal Tanam</span>
            </button>

            <div className="flex flex-col gap-[10px]">
              <SectionTitle>TAHAPAN MENANAM</SectionTitle>
              <div className="flex flex-col gap-2">
                {selectedGuide.stages.map((stage, index) => (
                  <GuideStageCard
                    key={stage.title}
                    index={index + 1}
                    title={stage.title}
                    badge={stage.badge}
                    items={stage.items}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

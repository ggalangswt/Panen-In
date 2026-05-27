"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { guideContent, type PlantId, plantOptions } from "@/constants/plants";
import { AppRoutes } from "@/constants/routes";
import { GuideStageCard } from "@/features/planting-guide/components/GuideStageCard";
import { PlantGuideGrid } from "@/features/planting-guide/components/PlantGuideGrid";
import { requestPushNotificationToken } from "@/services/push-notifications";
import {
  getNotificationSettings,
  getPlantingGuideReminder,
  registerNotificationToken,
  savePlantingGuideReminder,
  updateNotificationSettings,
} from "@/services/panenin-api";

function isPlantId(value: string | null): value is PlantId {
  return plantOptions.some((plant) => plant.id === value);
}

export default function PlantingGuidePage() {
  const router = useRouter();
  const [selectedPlant, setSelectedPlant] = useState<PlantId | null>(null);
  const [activeReminderPlantId, setActiveReminderPlantId] = useState<PlantId | null>(null);
  const [submittingReminder, setSubmittingReminder] = useState(false);
  const [message, setMessage] = useState("");

  const selectedGuide = selectedPlant ? guideContent[selectedPlant] : null;
  const selectedEmoji =
    plantOptions.find((plant) => plant.id === selectedPlant)?.emoji ?? "🌾";

  useEffect(() => {
    const queryPlant =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("plant")
        : null;

    if (isPlantId(queryPlant)) {
      setSelectedPlant(queryPlant);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadReminder() {
      try {
        const reminder = await getPlantingGuideReminder();

        if (cancelled || !reminder?.active || !isPlantId(reminder.plant_id)) {
          return;
        }

        setActiveReminderPlantId(reminder.plant_id);
      } catch {
        if (!cancelled) {
          setActiveReminderPlantId(null);
        }
      }
    }

    void loadReminder();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPlantLabel = useMemo(
    () => plantOptions.find((plant) => plant.id === selectedPlant)?.label ?? "",
    [selectedPlant],
  );

  const isReminderActiveForSelectedPlant =
    Boolean(selectedPlant) && activeReminderPlantId === selectedPlant;

  const handleBack = () => {
    if (selectedPlant) {
      setSelectedPlant(null);
      return;
    }

    router.push(AppRoutes.home);
  };

  const handleActivateReminder = async () => {
    if (!selectedPlant || !selectedPlantLabel) {
      return;
    }

    setSubmittingReminder(true);
    setMessage("");

    try {
      const token = await requestPushNotificationToken();
      await registerNotificationToken({
        token,
        device_type: "web",
      });

      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
      const settings = await getNotificationSettings();

      await updateNotificationSettings({
        notifications_enabled: true,
        planting_reminder: true,
        timezone,
        morning_hour: settings.morning_hour,
      });

      const reminder = await savePlantingGuideReminder({
        plant_id: selectedPlant,
        plant_label: selectedPlantLabel,
      });

      if (reminder?.active && isPlantId(reminder.plant_id)) {
        setActiveReminderPlantId(reminder.plant_id);
      }

      setMessage(`Pengingat jadwal tanam ${selectedPlantLabel} berhasil diaktifkan.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengaktifkan pengingat jadwal tanam.",
      );
    } finally {
      setSubmittingReminder(false);
    }
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
              disabled={submittingReminder}
              onClick={handleActivateReminder}
              className="flex h-[53px] items-center justify-center gap-1 rounded-[10px] border border-[#2d6a2d] bg-white px-[15px] text-[15px] font-medium leading-[22.5px] text-[#2d6a2d]"
            >
              <span className="text-[18px]">🔔</span>
              <span>
                {submittingReminder
                  ? "Mengaktifkan Pengingat..."
                  : isReminderActiveForSelectedPlant
                    ? "Pengingat Jadwal Tanam Aktif"
                    : "Jadikan Pengingat Jadwal Tanam"}
              </span>
            </button>

            {message ? (
              <p className={`text-[12px] leading-[18px] ${message.includes("berhasil") ? "text-[#2d6a2d]" : "text-[#b82c2c]"}`}>
                {message}
              </p>
            ) : null}

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

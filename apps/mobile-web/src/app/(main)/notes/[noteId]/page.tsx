"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AppRoutes } from "@/constants/routes";
import { ActivityTimeline } from "@/features/notes/components/ActivityTimeline";
import {
  getHarvestTimeline,
  listHarvestNotes,
  type HarvestNoteRecord,
  type HarvestTimelineResponse,
} from "@/services/panenin-api";
import {
  formatCompactCurrency,
  formatDateLabel,
  getCalculatorMetrics,
  getRelatedCalculator,
} from "@/services/display";

export default function NoteDetailPage() {
  const params = useParams<{ noteId: string }>();
  const router = useRouter();
  const [note, setNote] = useState<HarvestNoteRecord | null>(null);
  const [timeline, setTimeline] = useState<HarvestTimelineResponse["timeline"]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNoteDetail() {
      try {
        const [notes, timelineResponse] = await Promise.all([
          listHarvestNotes(),
          getHarvestTimeline(params.noteId),
        ]);

        if (cancelled) return;

        setNote(notes.find((item) => item.id === params.noteId) ?? null);
        setTimeline(timelineResponse.timeline);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Gagal memuat detail catatan panen.",
          );
        }
      }
    }

    void loadNoteDetail();

    return () => {
      cancelled = true;
    };
  }, [params.noteId]);

  const financialMetrics = useMemo(
    () => getCalculatorMetrics(note ? getRelatedCalculator(note) : null),
    [note],
  );

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader title="Catatan Panen" onBack={() => router.push(AppRoutes.notes)} />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-[15px] px-3 pb-6 pt-[15px]">
          <article className="rounded-[10px] border border-[#c6dfc6] bg-[#ebf5eb] p-[15px]">
            <p className="text-[14px] font-bold leading-[21px] text-[#2d6a2d]">
              RINGKASAN KEUANGAN
            </p>

            <div className="mt-[15px] flex flex-col items-center gap-2 text-[#2d6a2d]">
              <p className="text-[14px] font-medium leading-[21px]">Keuntungan Bersih</p>
              <p className="text-[22px] font-medium leading-[29px]">
                {formatCompactCurrency(financialMetrics.profit)}
              </p>
              <div className="rounded-full border border-[#c6dfc6] bg-white px-[10px] py-2 text-[14px] font-medium leading-[21px]">
                {financialMetrics.profit > 0 ? "Musim ini untung" : financialMetrics.profit < 0 ? "Musim ini rugi" : "Musim ini netral"}
              </div>
            </div>

            <div className="mt-[15px] grid grid-cols-3 gap-[10px]">
              {[
                { label: "Modal", value: formatCompactCurrency(financialMetrics.totalModal) },
                { label: "Pendapatan", value: formatCompactCurrency(financialMetrics.revenue) },
                { label: "Margin", value: `${financialMetrics.marginPercent}%` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[10px] border border-[#e0e0de] bg-white px-3 py-[10px] text-center"
                >
                  <p className="text-[12px] font-medium leading-[18px] text-[#6b6b68]">
                    {item.label}
                  </p>
                  <p className="text-[14px] font-medium leading-[21px] text-[#1a1a18]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <div className="flex flex-col gap-[10px]">
            <SectionTitle>AKTIVITAS TANAM</SectionTitle>
            {errorMessage ? (
              <p className="text-[12px] leading-[18px] text-[#b82c2c]">{errorMessage}</p>
            ) : (
              <ActivityTimeline
                items={timeline.map((item) => ({
                  date: formatDateLabel(item.tanggal),
                  title: item.judul,
                  description: item.deskripsi,
                }))}
              />
            )}
          </div>
        </div>

        <StickyActionBar>
          <PrimaryButton fullWidth onClick={() => router.push(AppRoutes.consultation)}>
            Konsultasi AI
          </PrimaryButton>
        </StickyActionBar>
      </section>
    </main>
  );
}

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
  getHarvestNote,
  getHarvestTimeline,
  type HarvestNoteRecord,
  type HarvestTimelineResponse,
} from "@/services/panenin-api";
import {
  formatCompactCurrency,
  formatDateLabel,
  getCalculatorMetrics,
  getHarvestNoteStatus,
  getHarvestNoteStatusLabel,
  getRelatedCalculator,
  getHarvestNoteSummary,
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
        const [noteResponse, timelineResponse] = await Promise.all([
          getHarvestNote(params.noteId),
          getHarvestTimeline(params.noteId),
        ]);

        if (cancelled) return;

        setNote(noteResponse);
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
  const statusLabel = note
    ? getHarvestNoteStatusLabel(getHarvestNoteStatus(note))
    : "Draft";

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader title="Catatan Panen" onBack={() => router.push(AppRoutes.notes)} />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-[15px] px-3 pb-6 pt-[15px]">
          {note ? (
            <article className="rounded-[10px] border border-[#e0e0de] bg-white p-[15px]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[18px] font-bold leading-[27px] text-[#1a1a18]">
                    {note.jenis_tanaman}
                  </p>
                  <p className="text-[14px] leading-[21px] text-[#6b6b68]">
                    {getHarvestNoteSummary(note)}
                  </p>
                </div>
                <span className="rounded-full border border-[#c6dfc6] bg-[#ebf5eb] px-[10px] py-1 text-[14px] font-medium leading-[21px] text-[#2d6a2d]">
                  {statusLabel}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-[10px]">
                <div className="rounded-[10px] bg-[#f7f7f5] px-3 py-[10px]">
                  <p className="text-[12px] font-medium leading-[18px] text-[#6b6b68]">
                    Tanggal Tanam
                  </p>
                  <p className="text-[14px] font-medium leading-[21px] text-[#1a1a18]">
                    {formatDateLabel(note.tanggal_tanam)}
                  </p>
                </div>
                <div className="rounded-[10px] bg-[#f7f7f5] px-3 py-[10px]">
                  <p className="text-[12px] font-medium leading-[18px] text-[#6b6b68]">
                    Estimasi Panen
                  </p>
                  <p className="text-[14px] font-medium leading-[21px] text-[#1a1a18]">
                    {note.estimasi_panen ? formatDateLabel(note.estimasi_panen) : "-"}
                  </p>
                </div>
              </div>

              {note.masalah ? (
                <div className="mt-4 rounded-[10px] bg-[#fff8e5] px-3 py-[10px]">
                  <p className="text-[12px] font-medium leading-[18px] text-[#6b6b68]">
                    Catatan Masalah
                  </p>
                  <p className="text-[14px] leading-[21px] text-[#1a1a18]">{note.masalah}</p>
                </div>
              ) : null}
            </article>
          ) : null}

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

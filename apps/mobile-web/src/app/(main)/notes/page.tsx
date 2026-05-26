"use client";

import { useEffect, useState } from "react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HarvestNoteCard } from "@/features/notes/components/HarvestNoteCard";
import {
  getHarvestSummary,
  listHarvestNotes,
  type HarvestNoteRecord,
} from "@/services/panenin-api";
import {
  formatCompactCurrency,
  getHarvestNoteStatus,
  getHarvestNoteStatusLabel,
  getHarvestNoteSummary,
} from "@/services/display";

export default function NotesPage() {
  const [notes, setNotes] = useState<HarvestNoteRecord[]>([]);
  const [summary, setSummary] = useState("Belum ada ringkasan panen.");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNotes() {
      try {
        const [summaryResponse, noteResponse] = await Promise.all([
          getHarvestSummary().catch(() => ({ ringkasan: "Belum ada ringkasan panen." })),
          listHarvestNotes(),
        ]);

        if (cancelled) return;

        setSummary(summaryResponse.ringkasan);
        setNotes(noteResponse);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Gagal memuat catatan panen.",
          );
        }
      }
    }

    void loadNotes();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader title="Catatan Panen" />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-[15px] px-3 pb-6 pt-[15px]">
          <article className="rounded-[10px] bg-[#2d6a2d] p-5 text-white">
            <p className="text-[14px] font-bold leading-[21px]">RINGKASAN AI</p>
            <p className="mt-[10px] text-[14px] font-medium leading-[21px]">
              {summary}
            </p>
          </article>

          <div className="flex flex-col gap-[10px]">
            <SectionTitle>RIWAYAT</SectionTitle>
            {errorMessage ? (
              <p className="text-[12px] leading-[18px] text-[#b82c2c]">{errorMessage}</p>
            ) : null}
            {notes.length > 0 ? (
              notes.map((note) => {
                const status = getHarvestNoteStatus(note);

                return (
                  <HarvestNoteCard
                    key={note.id}
                    href={`/notes/${note.id}`}
                    emoji="🌾"
                    plant={note.jenis_tanaman}
                    status={getHarvestNoteStatusLabel(status)}
                    summary={getHarvestNoteSummary(note)}
                  />
                );
              })
            ) : (
              <div className="rounded-[10px] border border-[#e0e0de] bg-white px-4 py-5 text-[14px] leading-[21px] text-[#6b6b68]">
                Belum ada catatan panen yang tersimpan.
              </div>
            )}
          </div>
        </div>

        <BottomNav activeTab="notes" />
      </section>
    </main>
  );
}

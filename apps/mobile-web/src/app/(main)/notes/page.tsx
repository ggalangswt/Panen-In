import { BottomNav } from "@/components/navigation/BottomNav";
import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { harvestNotes } from "@/constants/notes";
import { HarvestNoteCard } from "@/features/notes/components/HarvestNoteCard";

export default function NotesPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader title="Catatan Panen" />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-[15px] px-3 pb-6 pt-[15px]">
          <article className="rounded-[10px] bg-[#2d6a2d] p-5 text-white">
            <p className="text-[14px] font-bold leading-[21px]">RINGKASAN AI</p>
            <p className="mt-[10px] text-[14px] font-medium leading-[21px]">
              Dari 3 musim terakhir, padi memberikan margin terbaik untukmu
            </p>
          </article>

          <div className="flex flex-col gap-[10px]">
            <SectionTitle>RIWAYAT</SectionTitle>
            {harvestNotes.map((note) => (
              <HarvestNoteCard
                key={note.id}
                href={`/notes/${note.id}`}
                emoji={note.emoji}
                plant={note.plant}
                status={note.status}
                summary={note.summary}
              />
            ))}
          </div>
        </div>

        <BottomNav activeTab="notes" />
      </section>
    </main>
  );
}

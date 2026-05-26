"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { FeatureScreenHeader } from "@/components/layout/FeatureScreenHeader";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { FeatureTextInput } from "@/components/ui/FeatureTextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AppRoutes } from "@/constants/routes";
import {
  getHarvestNote,
  updateHarvestNote,
} from "@/services/panenin-api";

function parseNumberOrNull(value: string) {
  const cleaned = value.replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned) : null;
}

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams<{ noteId: string }>();
  const [jenisTanaman, setJenisTanaman] = useState("");
  const [tanggalTanam, setTanggalTanam] = useState("");
  const [estimasiPanen, setEstimasiPanen] = useState("");
  const [tanggalPanenAktual, setTanggalPanenAktual] = useState("");
  const [hasilAktualKg, setHasilAktualKg] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [masalah, setMasalah] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNote() {
      try {
        const note = await getHarvestNote(params.noteId);

        if (cancelled) return;

        setJenisTanaman(note.jenis_tanaman);
        setTanggalTanam(note.tanggal_tanam ?? "");
        setEstimasiPanen(note.estimasi_panen ?? "");
        setTanggalPanenAktual(note.tanggal_panen_aktual ?? "");
        setHasilAktualKg(note.hasil_aktual_kg != null ? String(note.hasil_aktual_kg) : "");
        setHargaJual(note.harga_jual != null ? String(note.harga_jual) : "");
        setMasalah(note.masalah ?? "");
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Gagal memuat catatan panen.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNote();

    return () => {
      cancelled = true;
    };
  }, [params.noteId]);

  const handleSave = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      await updateHarvestNote(params.noteId, {
        jenis_tanaman: jenisTanaman.trim(),
        tanggal_tanam: tanggalTanam,
        estimasi_panen: estimasiPanen || null,
        tanggal_panen_aktual: tanggalPanenAktual || null,
        hasil_aktual_kg: parseNumberOrNull(hasilAktualKg),
        harga_jual: parseNumberOrNull(hargaJual),
        masalah: masalah.trim() || null,
      });

      router.replace(AppRoutes.noteDetail(params.noteId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menyimpan catatan panen.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <FeatureScreenHeader
        title="Edit Catatan"
        onBack={() => router.push(AppRoutes.noteDetail(params.noteId))}
      />

      <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-[393px] flex-col">
        <div className="flex flex-1 flex-col gap-4 px-[14px] pb-6 pt-5">
          {loading ? (
            <div className="rounded-[10px] border border-[#e0e0de] bg-white px-4 py-5 text-[14px] leading-[21px] text-[#6b6b68]">
              Memuat catatan panen...
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-[10px]">
                <SectionTitle>Jenis Tanaman</SectionTitle>
                <FeatureTextInput
                  value={jenisTanaman}
                  onChange={(event) => setJenisTanaman(event.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div className="flex flex-col gap-[10px]">
                  <SectionTitle>Tanggal Tanam</SectionTitle>
                  <FeatureTextInput
                    type="date"
                    value={tanggalTanam}
                    onChange={(event) => setTanggalTanam(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <SectionTitle>Estimasi Panen</SectionTitle>
                  <FeatureTextInput
                    type="date"
                    value={estimasiPanen}
                    onChange={(event) => setEstimasiPanen(event.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div className="flex flex-col gap-[10px]">
                  <SectionTitle>Panen Aktual</SectionTitle>
                  <FeatureTextInput
                    type="date"
                    value={tanggalPanenAktual}
                    onChange={(event) => setTanggalPanenAktual(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <SectionTitle>Hasil Panen (kg)</SectionTitle>
                  <FeatureTextInput
                    inputMode="numeric"
                    value={hasilAktualKg}
                    onChange={(event) =>
                      setHasilAktualKg(event.target.value.replace(/[^\d]/g, ""))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <SectionTitle>Harga Jual per kg</SectionTitle>
                <FeatureTextInput
                  inputMode="numeric"
                  value={hargaJual}
                  onChange={(event) =>
                    setHargaJual(event.target.value.replace(/[^\d]/g, ""))
                  }
                />
              </div>

              <div className="flex flex-col gap-[10px]">
                <SectionTitle>Masalah / Catatan</SectionTitle>
                <FeatureTextInput
                  multiline
                  value={masalah}
                  onChange={(event) => setMasalah(event.target.value)}
                  placeholder="Tulis masalah lahan, hama, atau catatan panen di sini..."
                />
              </div>

              {errorMessage ? (
                <p className="text-[12px] leading-[18px] text-[#b82c2c]">{errorMessage}</p>
              ) : null}
            </>
          )}
        </div>

        <StickyActionBar>
          <PrimaryButton fullWidth disabled={loading || submitting} onClick={handleSave}>
            {submitting ? "Menyimpan..." : "Simpan Catatan"}
          </PrimaryButton>
        </StickyActionBar>
      </section>
    </main>
  );
}

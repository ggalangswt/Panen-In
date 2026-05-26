import { getGeminiModel } from '@/lib/gemini'

export const HARVEST_NOTE_SELECT = '*, kalkulator_usaha(*)'

export type HarvestNoteMutationInput = {
  kalkulator_id?: string | null
  jenis_tanaman: string
  tanggal_tanam: string
  estimasi_panen?: string | null
  tanggal_panen_aktual?: string | null
  hasil_aktual_kg?: number | null
  harga_jual?: number | null
  masalah?: string | null
}

function buildFallbackHarvestSummary(input: HarvestNoteMutationInput) {
  if (input.hasil_aktual_kg == null || input.harga_jual == null) {
    return null
  }

  const pendapatan = input.hasil_aktual_kg * input.harga_jual

  if (pendapatan > 0) {
    return `Musim panen ${input.jenis_tanaman} menghasilkan ${input.hasil_aktual_kg} kg dengan pendapatan kotor sekitar Rp ${pendapatan.toLocaleString('id-ID')}. Lanjutkan evaluasi pola tanam dan catat kendala yang muncul untuk musim berikutnya.`
  }

  return `Catatan panen ${input.jenis_tanaman} sudah tersimpan, tetapi hasil finansialnya belum bisa dievaluasi penuh. Lengkapi hasil panen dan harga jual agar musim berikutnya bisa dibandingkan.`
}

export async function generateHarvestSummary(input: HarvestNoteMutationInput) {
  if (input.hasil_aktual_kg == null || input.harga_jual == null) {
    return null
  }

  const totalPendapatan = input.hasil_aktual_kg * input.harga_jual
  const prompt = `
    Petani menanam ${input.jenis_tanaman}.
    Tanggal tanam: ${input.tanggal_tanam}
    Tanggal panen: ${input.tanggal_panen_aktual || input.estimasi_panen || '-'}
    Hasil panen: ${input.hasil_aktual_kg} kg
    Harga jual: Rp${input.harga_jual}/kg
    Total pendapatan: Rp${totalPendapatan}
    Masalah yang dialami: ${input.masalah || 'tidak ada'}

    Buat ringkasan singkat 2-3 kalimat dalam bahasa Indonesia yang sederhana.
    Sertakan apakah musim ini berhasil atau tidak dan saran untuk musim berikutnya.
  `

  try {
    const result = await getGeminiModel().generateContent(prompt)
    const summary = result.response.text().trim()

    return summary || buildFallbackHarvestSummary(input)
  } catch (error) {
    console.warn('Gemini fallback used for harvest summary:', error)
    return buildFallbackHarvestSummary(input)
  }
}

export function sanitizeHarvestNotePayload(
  input: Partial<HarvestNoteMutationInput> & Pick<HarvestNoteMutationInput, 'jenis_tanaman' | 'tanggal_tanam'>,
) {
  return {
    kalkulator_id: input.kalkulator_id ?? null,
    jenis_tanaman: input.jenis_tanaman.trim(),
    tanggal_tanam: input.tanggal_tanam,
    estimasi_panen: input.estimasi_panen ?? null,
    tanggal_panen_aktual: input.tanggal_panen_aktual ?? null,
    hasil_aktual_kg: input.hasil_aktual_kg ?? null,
    harga_jual: input.harga_jual ?? null,
    masalah: input.masalah?.trim() || null,
  }
}

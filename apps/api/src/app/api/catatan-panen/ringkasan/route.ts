import { requireAuthenticatedUser } from '@/lib/auth'
import { getGeminiModel } from '@/lib/gemini'
import { handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)

    // Ambil semua catatan panen user
    const supabaseAdmin = getSupabaseAdmin()
    const { data: catatan, error } = await supabaseAdmin
      .from('catatan_panen')
      .select('*, kalkulator_usaha(*)')
      .eq('user_id', user.id)
      .not('tanggal_panen_aktual', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    if (!catatan || catatan.length === 0) {
      return NextResponse.json({
        status: 'success',
        ringkasan: 'Belum ada data panen yang cukup untuk dirangkum.'
      })
    }

    // Format data untuk prompt Gemini
    const dataForPrompt = catatan.map((c: any) => ({
      tanaman: c.jenis_tanaman,
      tanggal_panen: c.tanggal_panen_aktual,
      hasil_kg: c.hasil_aktual_kg,
      harga_jual: c.harga_jual,
      pendapatan: c.hasil_aktual_kg * c.harga_jual,
      margin: c.kalkulator_usaha?.margin_persen || null,
      masalah: c.masalah || 'tidak ada'
    }))

    const prompt = `
      Berikut adalah riwayat panen petani dalam beberapa musim terakhir:
      ${JSON.stringify(dataForPrompt, null, 2)}

      Buat ringkasan dalam bahasa Indonesia yang sederhana dan mudah dipahami petani.
      Format jawaban:
      1. Kesimpulan umum (1-2 kalimat)
      2. Tanaman dengan performa terbaik
      3. Saran untuk musim berikutnya (2-3 poin singkat)

      Gunakan bahasa sehari-hari, hindari istilah teknis. Jangan gunakan format teks Markdown seperti tanda bintang () atau simbol penanda lainnya, berikan teks polos saja.
    `

    const result = await getGeminiModel().generateContent(prompt)
    const ringkasan = result.response.text().trim()

    return NextResponse.json({
      status: 'success',
      total_musim: catatan.length,
      ringkasan
    })

  } catch (error) {
    return handleRouteError(error)
  }
}

import { requireAuthenticatedUser } from '@/lib/auth'
import { getGeminiModel } from '@/lib/gemini'
import { badRequest, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const body = await request.json()
    const {
      kalkulator_id,
      jenis_tanaman,
      tanggal_tanam,
      estimasi_panen,
      tanggal_panen_aktual,
      hasil_aktual_kg,
      harga_jual,
      masalah
    } = body

    if (!jenis_tanaman || !tanggal_tanam) {
      return badRequest('jenis_tanaman dan tanggal_tanam wajib diisi')
    }

    const supabaseAdmin = getSupabaseAdmin()

    if (kalkulator_id) {
      const { data: kalkulator, error: kalkulatorError } = await supabaseAdmin
        .from('kalkulator_usaha')
        .select('id, user_id')
        .eq('id', kalkulator_id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (kalkulatorError) {
        throw kalkulatorError
      }

      if (!kalkulator) {
        return badRequest('kalkulator_id tidak valid untuk user ini')
      }
    }

    // Generate ringkasan AI kalau data panen sudah lengkap
    let ringkasan_ai = null
    if (hasil_aktual_kg != null && harga_jual != null) {
      const total_pendapatan = hasil_aktual_kg * harga_jual
      const prompt = `
        Petani menanam ${jenis_tanaman}.
        Tanggal tanam: ${tanggal_tanam}
        Tanggal panen: ${tanggal_panen_aktual || estimasi_panen}
        Hasil panen: ${hasil_aktual_kg} kg
        Harga jual: Rp${harga_jual}/kg
        Total pendapatan: Rp${total_pendapatan}
        Masalah yang dialami: ${masalah || 'tidak ada'}

        Buat ringkasan singkat 2-3 kalimat dalam bahasa Indonesia yang sederhana.
        Sertakan apakah musim ini berhasil atau tidak dan saran untuk musim berikutnya.
      `
      const result = await getGeminiModel().generateContent(prompt)
      ringkasan_ai = result.response.text().trim()
    }

    const { data, error } = await supabaseAdmin
      .from('catatan_panen')
      .insert({
        user_id: user.id,
        kalkulator_id: kalkulator_id || null,
        jenis_tanaman,
        tanggal_tanam,
        estimasi_panen: estimasi_panen || null,
        tanggal_panen_aktual: tanggal_panen_aktual || null,
        hasil_aktual_kg: hasil_aktual_kg || null,
        harga_jual: harga_jual || null,
        masalah: masalah || null,
        ringkasan_ai,
        synced: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ status: 'success', data })

  } catch (error) {
    return handleRouteError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('catatan_panen')
      .select('*, kalkulator_usaha(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ status: 'success', data })

  } catch (error) {
    return handleRouteError(error)
  }
}

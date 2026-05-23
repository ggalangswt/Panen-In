import { supabaseServer } from '@/lib/supabase-server'
import { geminiModel } from '@/lib/gemini'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      kalkulator_id,
      jenis_tanaman,
      tanggal_tanam,
      estimasi_panen,
      tanggal_panen_aktual,
      hasil_aktual_kg,
      harga_jual,
      masalah
    } = body

    if (!user_id || !jenis_tanaman || !tanggal_tanam) {
      return NextResponse.json(
        { error: 'user_id, jenis_tanaman, dan tanggal_tanam wajib diisi' },
        { status: 400 }
      )
    }

    // Generate ringkasan AI kalau data panen sudah lengkap
    let ringkasan_ai = null
    if (hasil_aktual_kg && harga_jual) {
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
      const result = await geminiModel.generateContent(prompt)
      ringkasan_ai = result.response.text().trim()
    }

    const { data, error } = await supabaseServer
      .from('catatan_panen')
      .insert({
        user_id,
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

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('catatan_panen')
      .select('*, kalkulator_usaha(*)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ status: 'success', data })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
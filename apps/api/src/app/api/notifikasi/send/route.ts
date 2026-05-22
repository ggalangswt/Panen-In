import { messaging } from '@/lib/firebase'
import { supabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // 1. Ambil token SEKALIGUS user_id dari database
    const { data: tokens, error: dbError } = await supabaseServer
      .from('fcm_tokens')
      .select('user_id, token')

    if (dbError) throw dbError

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ status: 'skipped', message: 'Tidak ada token aktif di database' })
    }

    const tokenList = tokens.map((t) => t.token)
    const pesanNotifikasi = 'Sugeng Enjang, Pak Tani! 🌾 Yuk cek rekomendasi cuaca dan jadwal perawatan komoditasmu hari ini di PanenIn.'

    // 2. Rancang template pesan harian untuk Firebase
    const message = {
      notification: {
        title: 'Sugeng Enjang, Pak Tani! 🌾',
        body: 'Yuk cek rekomendasi cuaca dan jadwal perawatan komoditasmu hari ini di PanenIn.',
      },
      tokens: tokenList,
    }

    // 3. Kirim massal lewat Firebase Admin SDK
    const response = await messaging.sendEachForMulticast(message)
    
    // 4. Sesuaikan dengan tabel kamu: buat array log untuk di-insert masal
    const logs = tokens.map((t) => ({
      user_id: t.user_id,
      tipe: 'cuaca_pagi', // Mengisi kolom 'tipe'
      pesan: pesanNotifikasi,    // Mengisi kolom 'pesan'
      sent_at: new Date().toISOString()
    }))

    // Insert semua log ke tabel notifikasi_log kamu
    const { error: logError } = await supabaseServer
      .from('notifikasi_log')
      .insert(logs)

    if (logError) console.error('⚠️ Gagal menyimpan log notifikasi:', logError.message)

    return NextResponse.json({
      status: 'success',
      summary: {
        total: tokenList.length,
        success: response.successCount,
        failed: response.failureCount,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
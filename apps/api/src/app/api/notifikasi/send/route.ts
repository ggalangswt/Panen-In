import { getMessaging } from '@/lib/firebase'
import { getNotificationCronSecret } from '@/lib/env'
import { forbidden, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const internalSecret = request.headers.get('x-internal-secret')

    if (!internalSecret || internalSecret !== getNotificationCronSecret()) {
      return forbidden('Invalid internal secret')
    }

    // 1. Ambil token SEKALIGUS user_id dari database
    const supabaseAdmin = getSupabaseAdmin()
    const { data: tokens, error: dbError } = await supabaseAdmin
      .from('fcm_tokens')
      .select('user_id, token')

    if (dbError) throw dbError

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ status: 'skipped', message: 'Tidak ada token aktif di database' })
    }

    const userIds = [...new Set(tokens?.map((entry: any) => entry.user_id) ?? [])]
    const { data: settingsRows, error: settingsError } = await supabaseAdmin
      .from('notification_settings')
      .select('user_id, notifications_enabled, weather_morning')
      .in('user_id', userIds)

    if (settingsError) throw settingsError

    const settingsByUserId = new Map<string, any>(
      (settingsRows ?? []).map((row: any) => [row.user_id, row]),
    )

    const activeTokens =
      tokens?.filter((entry: any) => {
        const settings = settingsByUserId.get(entry.user_id)

        return settings
          ? settings.notifications_enabled && settings.weather_morning
          : true
      }) ?? []

    if (activeTokens.length === 0) {
      return NextResponse.json({ status: 'skipped', message: 'Tidak ada token aktif di database' })
    }

    const tokenList = activeTokens.map((t: any) => t.token)
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
    const response = await getMessaging().sendEachForMulticast(message)
    
    // 4. Sesuaikan dengan tabel kamu: buat array log untuk di-insert masal
    const logs = activeTokens.map((t: any) => ({
      user_id: t.user_id,
      tipe: 'cuaca_pagi', // Mengisi kolom 'tipe'
      pesan: pesanNotifikasi,    // Mengisi kolom 'pesan'
      sent_at: new Date().toISOString()
    }))

    // Insert semua log ke tabel notifikasi_log kamu
    const { error: logError } = await supabaseAdmin
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
  } catch (error) {
    return handleRouteError(error)
  }
}

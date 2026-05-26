import { getNotificationCronSecret } from '@/lib/env'
import { getMessaging } from '@/lib/firebase'
import { forbidden, handleRouteError } from '@/lib/http'
import {
  hasSentWeatherMorningToday,
  shouldSendWeatherMorningNow,
  type NotificationLogRow,
  type NotificationSettingsRow,
} from '@/lib/notifications'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type TokenRow = {
  id: number
  user_id: string
  token: string
  device_type: string | null
}

const WEATHER_MORNING_TYPE = 'cuaca_pagi'
const WEATHER_MORNING_TITLE = 'Sugeng Enjang, Pak Tani! 🌾'
const WEATHER_MORNING_BODY =
  'Yuk cek rekomendasi cuaca dan jadwal perawatan komoditasmu hari ini di PanenIn.'

function buildWeatherMorningMessage(tokens: string[]) {
  return {
    notification: {
      title: WEATHER_MORNING_TITLE,
      body: WEATHER_MORNING_BODY,
    },
    data: {
      type: WEATHER_MORNING_TYPE,
      path: '/weather',
    },
    webpush: {
      fcmOptions: {
        link: '/weather',
      },
    },
    tokens,
  }
}

export async function POST(request: NextRequest) {
  try {
    const internalSecret = request.headers.get('x-internal-secret')

    if (!internalSecret || internalSecret !== getNotificationCronSecret()) {
      return forbidden('Invalid internal secret')
    }

    const supabaseAdmin = getSupabaseAdmin()
    const now = new Date()

    const { data: tokenRows, error: tokenError } = await supabaseAdmin
      .from('fcm_tokens')
      .select('id, user_id, token, device_type')

    if (tokenError) {
      throw tokenError
    }

    const tokens = (tokenRows ?? []) as TokenRow[]

    if (tokens.length === 0) {
      return NextResponse.json({
        status: 'skipped',
        summary: {
          total_tokens: 0,
          eligible_tokens: 0,
          sent: 0,
          failed: 0,
          removed_invalid_tokens: 0,
          skipped_users: 0,
        },
      })
    }

    const userIds = [...new Set(tokens.map((entry) => entry.user_id))]
    const { data: settingsRows, error: settingsError } = await supabaseAdmin
      .from('notification_settings')
      .select('user_id, notifications_enabled, weather_morning, morning_hour, timezone')
      .in('user_id', userIds)

    if (settingsError) {
      throw settingsError
    }

    const { data: logRows, error: logsError } = await supabaseAdmin
      .from('notifikasi_log')
      .select('user_id, sent_at')
      .eq('tipe', WEATHER_MORNING_TYPE)
      .gte('sent_at', new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString())

    if (logsError) {
      throw logsError
    }

    const settingsByUserId = new Map<string, NotificationSettingsRow>(
      (settingsRows ?? []).map((row: NotificationSettingsRow) => [row.user_id, row]),
    )
    const logs = (logRows ?? []) as NotificationLogRow[]
    const eligibleTokens: TokenRow[] = []
    let skippedUsers = 0

    for (const userId of userIds) {
      const settings = settingsByUserId.get(userId)

      if (!settings || !shouldSendWeatherMorningNow(settings, now)) {
        skippedUsers += 1
        continue
      }

      if (hasSentWeatherMorningToday(userId, settings, logs, now)) {
        skippedUsers += 1
        continue
      }

      eligibleTokens.push(...tokens.filter((entry: TokenRow) => entry.user_id === userId))
    }

    if (eligibleTokens.length === 0) {
      return NextResponse.json({
        status: 'skipped',
        summary: {
          total_tokens: tokens.length,
          eligible_tokens: 0,
          sent: 0,
          failed: 0,
          removed_invalid_tokens: 0,
          skipped_users: skippedUsers,
        },
      })
    }

    const response = await getMessaging().sendEachForMulticast(
      buildWeatherMorningMessage(eligibleTokens.map((entry) => entry.token)),
    )

    const invalidTokenIds: number[] = []
    let sentCount = 0
    const successfulUserIds = new Set<string>()

    response.responses.forEach((entry, index) => {
      const tokenRow = eligibleTokens[index]

      if (entry.success) {
        sentCount += 1
        successfulUserIds.add(tokenRow.user_id)
        return
      }

      const errorCode = entry.error?.code || ''
      if (
        errorCode.includes('registration-token-not-registered') ||
        errorCode.includes('invalid-registration-token')
      ) {
        invalidTokenIds.push(tokenRow.id)
      }
    })

    if (invalidTokenIds.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('fcm_tokens')
        .delete()
        .in('id', invalidTokenIds)

      if (deleteError) {
        console.error('Gagal menghapus token FCM invalid:', deleteError.message)
      }
    }

    if (successfulUserIds.size > 0) {
      const { error: logInsertError } = await supabaseAdmin.from('notifikasi_log').insert(
        [...successfulUserIds].map((userId) => ({
          user_id: userId,
          tipe: WEATHER_MORNING_TYPE,
          pesan: WEATHER_MORNING_BODY,
          sent_at: now.toISOString(),
        })),
      )

      if (logInsertError) {
        console.error('Gagal menyimpan log notifikasi:', logInsertError.message)
      }
    }

    return NextResponse.json({
      status: 'success',
      summary: {
        total_tokens: tokens.length,
        eligible_tokens: eligibleTokens.length,
        sent: sentCount,
        failed: response.failureCount,
        removed_invalid_tokens: invalidTokenIds.length,
        skipped_users: skippedUsers,
      },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

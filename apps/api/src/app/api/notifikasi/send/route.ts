import { getNotificationCronSecret } from '@/lib/env'
import { getMessaging } from '@/lib/firebase'
import { forbidden, handleRouteError } from '@/lib/http'
import {
  hasSentNotificationToday,
  hasSentWeatherMorningToday,
  shouldSendAtMorning,
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

type PlantingReminderRow = {
  user_id: string
  plant_id: string
  plant_label: string
  active: boolean
}

const WEATHER_MORNING_TYPE = 'cuaca_pagi'
const WEATHER_MORNING_TITLE = 'Sugeng Enjang, Pak Tani! 🌾'
const WEATHER_MORNING_BODY =
  'Yuk cek rekomendasi cuaca dan jadwal perawatan komoditasmu hari ini di PanenIn.'

const PLANTING_REMINDER_TYPE = 'pengingat_jadwal_tanam'
const PLANTING_REMINDER_TITLE = 'Pengingat Jadwal Tanam 🌱'

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

function buildPlantingReminderBody(plantLabel: string) {
  return `Saatnya cek panduan tanam ${plantLabel} dan lihat tahapan yang perlu kamu siapkan hari ini.`
}

function buildPlantingReminderMessage(tokens: string[], plantId: string, plantLabel: string) {
  return {
    notification: {
      title: PLANTING_REMINDER_TITLE,
      body: buildPlantingReminderBody(plantLabel),
    },
    data: {
      type: PLANTING_REMINDER_TYPE,
      path: `/planting-guide?plant=${plantId}`,
      plantId,
    },
    webpush: {
      fcmOptions: {
        link: `/planting-guide?plant=${plantId}`,
      },
    },
    tokens,
  }
}

function collectInvalidTokenIds(
  responses: Array<{ success: boolean; error?: { code?: string } }>,
  tokenRows: TokenRow[],
) {
  const invalidTokenIds: number[] = []
  let sentCount = 0
  let failedCount = 0
  const successfulUserIds = new Set<string>()

  responses.forEach((entry, index) => {
    const tokenRow = tokenRows[index]

    if (entry.success) {
      sentCount += 1
      successfulUserIds.add(tokenRow.user_id)
      return
    }

    failedCount += 1
    const errorCode = entry.error?.code || ''
    if (
      errorCode.includes('registration-token-not-registered') ||
      errorCode.includes('invalid-registration-token')
    ) {
      invalidTokenIds.push(tokenRow.id)
    }
  })

  return {
    invalidTokenIds,
    sentCount,
    failedCount,
    successfulUserIds,
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
      .select('user_id, notifications_enabled, weather_morning, planting_reminder, morning_hour, timezone')
      .in('user_id', userIds)

    if (settingsError) {
      throw settingsError
    }

    const { data: logRows, error: logsError } = await supabaseAdmin
      .from('notifikasi_log')
      .select('user_id, sent_at, tipe')
      .in('tipe', [WEATHER_MORNING_TYPE, PLANTING_REMINDER_TYPE])
      .gte('sent_at', new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString())

    if (logsError) {
      throw logsError
    }

    const { data: plantingReminderRows, error: plantingReminderError } = await supabaseAdmin
      .from('planting_guide_reminders')
      .select('user_id, plant_id, plant_label, active')
      .in('user_id', userIds)

    if (plantingReminderError) {
      throw plantingReminderError
    }

    const settingsByUserId = new Map<string, NotificationSettingsRow>(
      (settingsRows ?? []).map((row: NotificationSettingsRow) => [row.user_id, row]),
    )
    const logs = (logRows ?? []) as NotificationLogRow[]
    const plantingReminderByUserId = new Map<string, PlantingReminderRow>(
      ((plantingReminderRows ?? []) as PlantingReminderRow[]).map((row) => [row.user_id, row]),
    )

    const eligibleWeatherTokens: TokenRow[] = []
    const eligiblePlantingEntries: Array<{ reminder: PlantingReminderRow; tokens: TokenRow[] }> = []
    let skippedUsers = 0

    for (const userId of userIds) {
      const settings = settingsByUserId.get(userId)

      if (!settings) {
        skippedUsers += 1
        continue
      }

      if (!settings.notifications_enabled || !shouldSendAtMorning(settings, now)) {
        skippedUsers += 1
        continue
      }

      if (settings.weather_morning && !hasSentWeatherMorningToday(userId, settings, logs, now)) {
        eligibleWeatherTokens.push(...tokens.filter((entry) => entry.user_id === userId))
      }

      const plantingReminder = plantingReminderByUserId.get(userId)
      const plantingLogs = logs.filter((log) => log.tipe === PLANTING_REMINDER_TYPE)

      if (
        settings.notifications_enabled &&
        settings.planting_reminder &&
        plantingReminder?.active &&
        shouldSendAtMorning(settings, now) &&
        !hasSentNotificationToday(userId, settings, plantingLogs, now)
      ) {
        const reminderTokens = tokens.filter((entry) => entry.user_id === userId)

        if (reminderTokens.length > 0) {
          eligiblePlantingEntries.push({
            reminder: plantingReminder,
            tokens: reminderTokens,
          })
        }
      }
    }

    if (eligibleWeatherTokens.length === 0 && eligiblePlantingEntries.length === 0) {
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

    const invalidTokenIds: number[] = []
    let sentCount = 0
    let failedCount = 0
    const logsToInsert: Array<{ user_id: string; tipe: string; pesan: string; sent_at: string }> = []

    if (eligibleWeatherTokens.length > 0) {
      const response = await getMessaging().sendEachForMulticast(
        buildWeatherMorningMessage(eligibleWeatherTokens.map((entry) => entry.token)),
      )
      const weatherResult = collectInvalidTokenIds(response.responses, eligibleWeatherTokens)
      invalidTokenIds.push(...weatherResult.invalidTokenIds)
      sentCount += weatherResult.sentCount
      failedCount += weatherResult.failedCount
      for (const userId of weatherResult.successfulUserIds) {
        logsToInsert.push({
          user_id: userId,
          tipe: WEATHER_MORNING_TYPE,
          pesan: WEATHER_MORNING_BODY,
          sent_at: now.toISOString(),
        })
      }
    }

    for (const entry of eligiblePlantingEntries) {
      const body = buildPlantingReminderBody(entry.reminder.plant_label)
      const response = await getMessaging().sendEachForMulticast(
        buildPlantingReminderMessage(
          entry.tokens.map((token) => token.token),
          entry.reminder.plant_id,
          entry.reminder.plant_label,
        ),
      )
      const plantingResult = collectInvalidTokenIds(response.responses, entry.tokens)
      invalidTokenIds.push(...plantingResult.invalidTokenIds)
      sentCount += plantingResult.sentCount
      failedCount += plantingResult.failedCount
      for (const userId of plantingResult.successfulUserIds) {
        logsToInsert.push({
          user_id: userId,
          tipe: PLANTING_REMINDER_TYPE,
          pesan: body,
          sent_at: now.toISOString(),
        })
      }
    }

    if (invalidTokenIds.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('fcm_tokens')
        .delete()
        .in('id', [...new Set(invalidTokenIds)])

      if (deleteError) {
        console.error('Gagal menghapus token FCM invalid:', deleteError.message)
      }
    }

    if (logsToInsert.length > 0) {
      const { error: logInsertError } = await supabaseAdmin.from('notifikasi_log').insert(logsToInsert)

      if (logInsertError) {
        console.error('Gagal menyimpan log notifikasi:', logInsertError.message)
      }
    }

    return NextResponse.json({
      status: 'success',
      summary: {
        total_tokens: tokens.length,
        eligible_tokens:
          eligibleWeatherTokens.length +
          eligiblePlantingEntries.reduce((sum, entry) => sum + entry.tokens.length, 0),
        sent: sentCount,
        failed: failedCount,
        removed_invalid_tokens: [...new Set(invalidTokenIds)].length,
        skipped_users: skippedUsers,
      },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

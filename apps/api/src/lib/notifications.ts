export type NotificationSettingsRow = {
  user_id: string
  notifications_enabled: boolean
  weather_morning: boolean
  planting_reminder?: boolean
  morning_hour: number
  timezone: string | null
}

export type NotificationLogRow = {
  user_id: string
  sent_at: string
  tipe?: string
}

export function getSafeTimezone(timezone: string | null | undefined) {
  const candidate = timezone?.trim() || 'Asia/Jakarta'

  try {
    Intl.DateTimeFormat('en-US', { timeZone: candidate }).format(new Date())
    return candidate
  } catch {
    return 'Asia/Jakarta'
  }
}

function getLocalParts(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const valueByType = new Map(parts.map((part) => [part.type, part.value]))

  return {
    dateKey: `${valueByType.get('year')}-${valueByType.get('month')}-${valueByType.get('day')}`,
    hour: Number(valueByType.get('hour') || '0'),
  }
}

export function shouldSendAtMorning(
  settings: NotificationSettingsRow,
  now: Date,
) {
  const timezone = getSafeTimezone(settings.timezone)
  const { hour } = getLocalParts(now, timezone)
  return hour === settings.morning_hour
}

export function shouldSendWeatherMorningNow(
  settings: NotificationSettingsRow,
  now: Date,
) {
  if (!settings.notifications_enabled || !settings.weather_morning) {
    return false
  }

  return shouldSendAtMorning(settings, now)
}

export function hasSentWeatherMorningToday(
  userId: string,
  settings: NotificationSettingsRow,
  logs: NotificationLogRow[],
  now: Date,
) {
  const timezone = getSafeTimezone(settings.timezone)
  const currentDateKey = getLocalParts(now, timezone).dateKey

  return logs.some((log) => {
    if (log.user_id !== userId) {
      return false
    }

    return getLocalParts(new Date(log.sent_at), timezone).dateKey === currentDateKey
  })
}

export function hasSentNotificationToday(
  userId: string,
  settings: NotificationSettingsRow,
  logs: NotificationLogRow[],
  now: Date,
) {
  const timezone = getSafeTimezone(settings.timezone)
  const currentDateKey = getLocalParts(now, timezone).dateKey

  return logs.some((log) => {
    if (log.user_id !== userId) {
      return false
    }

    return getLocalParts(new Date(log.sent_at), timezone).dateKey === currentDateKey
  })
}

import { getSupabaseAdmin } from '@/lib/supabase-server'

const DEFAULT_NOTIFICATION_SETTINGS = {
  notifications_enabled: true,
  weather_morning: true,
  weather_alert: false,
  planting_reminder: true,
  fertilizer_reminder: true,
  harvest_reminder: false,
  weekly_ai_tips: true,
  morning_hour: 6,
  timezone: 'Asia/Jakarta',
}

export async function ensureProfile(user: { id: string; email: string | null }) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert(
      {
        user_id: user.id,
        email: user.email,
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function ensureNotificationSettings(userId: string) {
  const supabaseAdmin = getSupabaseAdmin()

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('notification_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (existingError) {
    throw existingError
  }

  if (existing) {
    return existing
  }

  const { data, error } = await supabaseAdmin
    .from('notification_settings')
    .insert(
      {
        user_id: userId,
        ...DEFAULT_NOTIFICATION_SETTINGS,
      },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}

export { DEFAULT_NOTIFICATION_SETTINGS }

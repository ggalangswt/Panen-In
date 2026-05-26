import { requireAuthenticatedUser } from '@/lib/auth'
import { badRequest, handleRouteError } from '@/lib/http'
import { ensureNotificationSettings } from '@/lib/profile'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BOOLEAN_FIELDS = [
  'notifications_enabled',
  'weather_morning',
  'weather_alert',
  'planting_reminder',
  'fertilizer_reminder',
  'harvest_reminder',
  'weekly_ai_tips',
] as const

function serializeSettings(settings: any) {
  return {
    notifications_enabled: settings.notifications_enabled,
    weather_morning: settings.weather_morning,
    weather_alert: settings.weather_alert,
    planting_reminder: settings.planting_reminder,
    fertilizer_reminder: settings.fertilizer_reminder,
    harvest_reminder: settings.harvest_reminder,
    weekly_ai_tips: settings.weekly_ai_tips,
    morning_hour: settings.morning_hour,
    timezone: settings.timezone,
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const settings = await ensureNotificationSettings(user.id)

    return NextResponse.json({
      status: 'success',
      data: serializeSettings(settings),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    await ensureNotificationSettings(user.id)

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    for (const field of BOOLEAN_FIELDS) {
      if (field in body) {
        if (typeof body[field] !== 'boolean') {
          return badRequest(`${field} harus berupa boolean`)
        }

        updates[field] = body[field]
      }
    }

    if ('morning_hour' in body) {
      if (!Number.isInteger(body.morning_hour) || body.morning_hour < 4 || body.morning_hour > 9) {
        return badRequest('morning_hour harus berupa integer antara 4 dan 9')
      }

      updates.morning_hour = body.morning_hour
    }

    if ('timezone' in body) {
      const timezone = String(body.timezone || 'Asia/Jakarta').trim() || 'Asia/Jakarta'
      updates.timezone = timezone
    }

    if (Object.keys(updates).length === 0) {
      const settings = await ensureNotificationSettings(user.id)

      return NextResponse.json({
        status: 'success',
        data: serializeSettings(settings),
      })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('notification_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: 'success',
      data: serializeSettings(data),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

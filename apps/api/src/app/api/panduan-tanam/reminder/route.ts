import { requireAuthenticatedUser } from '@/lib/auth'
import { badRequest, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function serializeReminder(reminder: any) {
  return reminder
    ? {
        plant_id: reminder.plant_id,
        plant_label: reminder.plant_label,
        active: reminder.active,
      }
    : null
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('planting_guide_reminders')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: 'success',
      data: serializeReminder(data),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const body = await request.json()
    const plantId = String(body.plant_id || '').trim()
    const plantLabel = String(body.plant_label || '').trim()

    if (!plantId || !plantLabel) {
      return badRequest('plant_id dan plant_label wajib diisi')
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('planting_guide_reminders')
      .upsert(
        {
          user_id: user.id,
          plant_id: plantId,
          plant_label: plantLabel,
          active: true,
        },
        { onConflict: 'user_id' },
      )
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: 'success',
      data: serializeReminder(data),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

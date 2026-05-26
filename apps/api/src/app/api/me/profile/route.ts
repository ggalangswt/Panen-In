import { requireAuthenticatedUser } from '@/lib/auth'
import { badRequest, handleRouteError } from '@/lib/http'
import { ensureProfile } from '@/lib/profile'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function serializeProfile(profile: any, user: { id: string; email: string | null }) {
  return {
    user_id: user.id,
    email: user.email,
    display_name: profile.display_name ?? null,
    kabupaten: profile.kabupaten ?? null,
    preferred_plants: Array.isArray(profile.preferred_plants) ? profile.preferred_plants : [],
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const profile = await ensureProfile(user)

    return NextResponse.json({
      status: 'success',
      data: serializeProfile(profile, user),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    await ensureProfile(user)

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    if ('display_name' in body) {
      updates.display_name = body.display_name ? String(body.display_name).trim() : null
    }

    if ('kabupaten' in body) {
      updates.kabupaten = body.kabupaten ? String(body.kabupaten).trim() : null
    }

    if ('preferred_plants' in body) {
      if (
        !Array.isArray(body.preferred_plants) ||
        body.preferred_plants.some(
          (item: unknown) => typeof item !== 'string' || item.trim().length === 0,
        )
      ) {
        return badRequest('preferred_plants harus berupa array string yang valid')
      }

      updates.preferred_plants = body.preferred_plants.map((item: string) => item.trim())
    }

    if (Object.keys(updates).length === 0) {
      const profile = await ensureProfile(user)

      return NextResponse.json({
        status: 'success',
        data: serializeProfile(profile, user),
      })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: 'success',
      data: serializeProfile(data, user),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

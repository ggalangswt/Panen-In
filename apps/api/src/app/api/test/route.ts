import { getNotificationCronSecret } from '@/lib/env'
import { forbidden, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const internalSecret = request.headers.get('x-internal-secret')

    if (!internalSecret || internalSecret !== getNotificationCronSecret()) {
      return forbidden('Invalid internal secret')
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: 'connected',
      data,
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

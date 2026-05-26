import { requireAuthenticatedUser } from '@/lib/auth'
import { badRequest, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const body = await request.json()
    const { token, device_type } = body

    if (!token) {
      return badRequest('token wajib diisi')
    }

    // Gunakan upsert supaya jika token yang sama didaftarkan lagi, tidak duplikat
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('fcm_tokens')
      .upsert(
        { user_id: user.id, token, device_type: String(device_type || 'web').trim() || 'web' },
        { onConflict: 'token' }
      )
      .select()

    if (error) throw error

    return NextResponse.json({ status: 'success', message: 'Token berhasil disimpan', data })
  } catch (error) {
    return handleRouteError(error)
  }
}

import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, token, device_type } = body

    if (!user_id || !token) {
      return NextResponse.json({ error: 'user_id dan token wajib diisi' }, { status: 400 })
    }

    // Gunakan upsert supaya jika token yang sama didaftarkan lagi, tidak duplikat
    const { data, error } = await supabaseServer
      .from('fcm_tokens')
      .upsert(
        { user_id, token, device_type: device_type || 'web' },
        { onConflict: 'token' }
      )
      .select()

    if (error) throw error

    return NextResponse.json({ status: 'success', message: 'Token berhasil disimpan', data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
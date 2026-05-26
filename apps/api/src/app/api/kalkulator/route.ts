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
    const {
      musim_tanam,
      jenis_tanaman,
      item_modal,
      hasil_kg,
      harga_per_kg
    } = body

    // Validasi input
    if (
      !musim_tanam ||
      !jenis_tanaman ||
      !Array.isArray(item_modal) ||
      item_modal.length === 0 ||
      hasil_kg == null ||
      harga_per_kg == null
    ) {
      return badRequest('musim_tanam, jenis_tanaman, item_modal, hasil_kg, dan harga_per_kg wajib diisi')
    }

    // Hitung total modal dari item_modal
    const total_modal = item_modal.reduce(
      (acc: number, item: { nama: string; nilai: number }) => acc + item.nilai, 0
    )

    // Insert ke Supabase — kolom generated dihitung otomatis oleh DB
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('kalkulator_usaha')
      .insert({
        user_id: user.id,
        musim_tanam,
        jenis_tanaman,
        item_modal,
        total_modal,
        hasil_kg,
        harga_per_kg
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      status: 'success',
      data
    })

  } catch (error) {
    return handleRouteError(error)
  }
}

// GET — ambil semua riwayat kalkulator milik user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('kalkulator_usaha')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      status: 'success',
      data
    })

  } catch (error) {
    return handleRouteError(error)
  }
}

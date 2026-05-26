import { requireAuthenticatedUser } from '@/lib/auth'
import { badRequest, handleRouteError } from '@/lib/http'
import {
  generateHarvestSummary,
  HARVEST_NOTE_SELECT,
  sanitizeHarvestNotePayload,
} from '@/lib/harvest-notes'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const body = await request.json()
    const {
      kalkulator_id,
      jenis_tanaman,
      tanggal_tanam,
      estimasi_panen,
      tanggal_panen_aktual,
      hasil_aktual_kg,
      harga_jual,
      masalah
    } = body

    if (!jenis_tanaman || !tanggal_tanam) {
      return badRequest('jenis_tanaman dan tanggal_tanam wajib diisi')
    }

    const supabaseAdmin = getSupabaseAdmin()

    if (kalkulator_id) {
      const { data: kalkulator, error: kalkulatorError } = await supabaseAdmin
        .from('kalkulator_usaha')
        .select('id, user_id')
        .eq('id', kalkulator_id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (kalkulatorError) {
        throw kalkulatorError
      }

      if (!kalkulator) {
        return badRequest('kalkulator_id tidak valid untuk user ini')
      }
    }

    const payload = sanitizeHarvestNotePayload({
      kalkulator_id,
      jenis_tanaman,
      tanggal_tanam,
      estimasi_panen,
      tanggal_panen_aktual,
      hasil_aktual_kg,
      harga_jual,
      masalah,
    })
    const ringkasan_ai = await generateHarvestSummary(payload)

    const { data, error } = await supabaseAdmin
      .from('catatan_panen')
      .insert({
        user_id: user.id,
        ...payload,
        ringkasan_ai,
        synced: true
      })
      .select(HARVEST_NOTE_SELECT)
      .single()

    if (error) throw error

    return NextResponse.json({ status: 'success', data })

  } catch (error) {
    return handleRouteError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('catatan_panen')
      .select(HARVEST_NOTE_SELECT)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ status: 'success', data })

  } catch (error) {
    return handleRouteError(error)
  }
}

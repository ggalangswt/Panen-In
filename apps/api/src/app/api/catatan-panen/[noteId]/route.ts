import { requireAuthenticatedUser } from '@/lib/auth'
import { badRequest, handleRouteError, notFound } from '@/lib/http'
import {
  generateHarvestSummary,
  HARVEST_NOTE_SELECT,
  sanitizeHarvestNotePayload,
} from '@/lib/harvest-notes'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
  params: Promise<{
    noteId: string
  }>
}

function getPatchedValue<T>(
  updates: Record<string, unknown>,
  key: string,
  existingValue: T,
): T {
  if (key in updates) {
    return updates[key] as T
  }

  return existingValue
}

async function getOwnedHarvestNote(noteId: string, userId: string) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('catatan_panen')
    .select(HARVEST_NOTE_SELECT)
    .eq('id', noteId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { noteId } = await context.params
    const note = await getOwnedHarvestNote(noteId, user.id)

    if (!note) {
      return notFound('Catatan panen tidak ditemukan')
    }

    return NextResponse.json({ status: 'success', data: note })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { noteId } = await context.params
    const existingNote = await getOwnedHarvestNote(noteId, user.id)

    if (!existingNote) {
      return notFound('Catatan panen tidak ditemukan')
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    if ('jenis_tanaman' in body) {
      const jenisTanaman = String(body.jenis_tanaman || '').trim()
      if (!jenisTanaman) {
        return badRequest('jenis_tanaman wajib diisi')
      }
      updates.jenis_tanaman = jenisTanaman
    }

    if ('tanggal_tanam' in body) {
      const tanggalTanam = String(body.tanggal_tanam || '').trim()
      if (!tanggalTanam) {
        return badRequest('tanggal_tanam wajib diisi')
      }
      updates.tanggal_tanam = tanggalTanam
    }

    if ('estimasi_panen' in body) {
      updates.estimasi_panen = body.estimasi_panen ? String(body.estimasi_panen).trim() : null
    }

    if ('tanggal_panen_aktual' in body) {
      updates.tanggal_panen_aktual = body.tanggal_panen_aktual
        ? String(body.tanggal_panen_aktual).trim()
        : null
    }

    if ('hasil_aktual_kg' in body) {
      if (body.hasil_aktual_kg != null && (typeof body.hasil_aktual_kg !== 'number' || body.hasil_aktual_kg < 0)) {
        return badRequest('hasil_aktual_kg harus berupa angka non-negatif')
      }
      updates.hasil_aktual_kg = body.hasil_aktual_kg ?? null
    }

    if ('harga_jual' in body) {
      if (body.harga_jual != null && (typeof body.harga_jual !== 'number' || body.harga_jual < 0)) {
        return badRequest('harga_jual harus berupa angka non-negatif')
      }
      updates.harga_jual = body.harga_jual ?? null
    }

    if ('masalah' in body) {
      updates.masalah = body.masalah ? String(body.masalah).trim() : null
    }

    if ('kalkulator_id' in body) {
      if (body.kalkulator_id == null || body.kalkulator_id === '') {
        updates.kalkulator_id = null
      } else {
        const kalkulatorId = String(body.kalkulator_id)
        const supabaseAdmin = getSupabaseAdmin()
        const { data: kalkulator, error: kalkulatorError } = await supabaseAdmin
          .from('kalkulator_usaha')
          .select('id, user_id')
          .eq('id', kalkulatorId)
          .eq('user_id', user.id)
          .maybeSingle()

        if (kalkulatorError) {
          throw kalkulatorError
        }

        if (!kalkulator) {
          return badRequest('kalkulator_id tidak valid untuk user ini')
        }

        updates.kalkulator_id = kalkulatorId
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ status: 'success', data: existingNote })
    }

    const nextPayload = sanitizeHarvestNotePayload({
      kalkulator_id: getPatchedValue(updates, 'kalkulator_id', existingNote.kalkulator_id ?? null),
      jenis_tanaman: getPatchedValue(updates, 'jenis_tanaman', existingNote.jenis_tanaman),
      tanggal_tanam: getPatchedValue(updates, 'tanggal_tanam', existingNote.tanggal_tanam),
      estimasi_panen: getPatchedValue(updates, 'estimasi_panen', existingNote.estimasi_panen ?? null),
      tanggal_panen_aktual: getPatchedValue(
        updates,
        'tanggal_panen_aktual',
        existingNote.tanggal_panen_aktual ?? null,
      ),
      hasil_aktual_kg: getPatchedValue(
        updates,
        'hasil_aktual_kg',
        existingNote.hasil_aktual_kg ?? null,
      ),
      harga_jual: getPatchedValue(updates, 'harga_jual', existingNote.harga_jual ?? null),
      masalah: getPatchedValue(updates, 'masalah', existingNote.masalah ?? null),
    })

    const ringkasan_ai = await generateHarvestSummary(nextPayload)
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('catatan_panen')
      .update({
        ...nextPayload,
        ringkasan_ai,
        synced: true,
      })
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select(HARVEST_NOTE_SELECT)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ status: 'success', data })
  } catch (error) {
    return handleRouteError(error)
  }
}

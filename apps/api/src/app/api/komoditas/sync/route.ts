import { requireAuthenticatedUser } from '@/lib/auth'
import { badRequest, forbidden, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const body = await request.json()
    const { data_lokal } = body // Menerima array data catatan_panen dari penyimpanan lokal HP

    if (!data_lokal || !Array.isArray(data_lokal) || data_lokal.length === 0) {
      return badRequest('data_lokal dalam bentuk array wajib dilampirkan')
    }

    const supabaseAdmin = getSupabaseAdmin()
    const providedIds = data_lokal
      .map((item: any) => item?.id)
      .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)

    if (providedIds.length > 0) {
      const { data: existingRecords, error: existingError } = await supabaseAdmin
        .from('catatan_panen')
        .select('id, user_id')
        .in('id', providedIds)

      if (existingError) {
        throw existingError
      }

      const unauthorizedRecord = existingRecords?.find((item: any) => item.user_id !== user.id)

      if (unauthorizedRecord) {
        return forbidden('Tidak bisa menyinkronkan catatan milik user lain')
      }
    }

    // Map data lokal, pastikan set status 'synced: true' sebelum masuk ke cloud Supabase
    const dataToSync = data_lokal.map((item: any) => ({
      id: item.id || crypto.randomUUID(),
      user_id: user.id,
      kalkulator_id: item.kalkulator_id || null,
      jenis_tanaman: item.jenis_tanaman,
      tanggal_tanam: item.tanggal_tanam,
      estimasi_panen: item.estimasi_panen,
      tanggal_panen_aktual: item.tanggal_panen_aktual || null,
      hasil_aktual_kg: item.hasil_aktual_kg || null,
      harga_jual: item.harga_jual || null,
      masalah: item.masalah || null,
      foto_urls: item.foto_urls || null,
      synced: true, // <-- Paksa menjadi true karena sekarang sudah sukses masuk cloud database
      updated_at: new Date().toISOString()
    }))

    // Masukkan masal menggunakan upsert (jika ID sudah ada di cloud akan diupdate, jika belum akan ditambah baru)
    const { data, error } = await supabaseAdmin
      .from('catatan_panen')
      .upsert(dataToSync, { onConflict: 'id' })
      .select()

    if (error) throw error

    return NextResponse.json({
      status: 'success',
      message: 'Sinkronisasi data offline ke cloud berhasil dilakukan.',
      total_synced: data?.length || 0,
      synced_records: data
    })

  } catch (error) {
    return handleRouteError(error)
  }
}

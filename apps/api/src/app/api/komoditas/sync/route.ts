import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data_lokal } = body // Menerima array data catatan_panen dari penyimpanan lokal HP

    if (!data_lokal || !Array.isArray(data_lokal) || data_lokal.length === 0) {
      return NextResponse.json({ error: 'data_lokal dalam bentuk array wajib dilampirkan' }, { status: 400 })
    }

    // Map data lokal, pastikan set status 'synced: true' sebelum masuk ke cloud Supabase
    const dataToSync = data_lokal.map((item: any) => ({
      id: item.id || crypto.randomUUID(),
      user_id: item.user_id,
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
    const { data, error } = await supabaseServer
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

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
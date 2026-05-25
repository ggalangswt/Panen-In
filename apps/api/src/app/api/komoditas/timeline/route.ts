import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const catatan_panen_id = searchParams.get('id')

    if (!catatan_panen_id) {
      return NextResponse.json({ error: 'id catatan_panen wajib diisi' }, { status: 400 })
    }

    // Ambil data catatan_panen berserta relasi kalkulator_usaha sesuai ERD kamu
    const { data: komoditas, error: dbError } = await supabaseServer
      .from('catatan_panen')
      .select('*, kalkulator_usaha(*)')
      .eq('id', catatan_panen_id)
      .single()

    if (dbError || !komoditas) {
      return NextResponse.json({ error: 'Data komoditas tidak ditemukan' }, { status: 404 })
    }

    const timelineEvents = []

    // 1. Milestone Perencanaan (Dari kalkulator_usaha)
    if (komoditas.kalkulator_usaha) {
      timelineEvents.push({
        id: 'milestone-rencana',
        tanggal: komoditas.kalkulator_usaha.created_at,
        tipe: 'perencanaan',
        judul: 'Rencana Usaha Tanam 📝',
        deskripsi: `Menyusun modal awal sebesar Rp ${(komoditas.kalkulator_usaha.total_modal || 0).toLocaleString('id-ID')} untuk musim tanam ${komoditas.kalkulator_usaha.musim_tanam || '-'}`,
        status: 'completed'
      })
    }

    // 2. Milestone Penanaman
    if (komoditas.tanggal_tanam) {
      timelineEvents.push({
        id: 'milestone-tanam',
        tanggal: komoditas.tanggal_tanam,
        tipe: 'penanaman',
        judul: 'Mulai Menanam 🌿',
        deskripsi: `Bibit komoditas ${komoditas.jenis_tanaman} resmi ditanam di lahan.`,
        status: 'completed'
      })
    }

    // 3. Milestone Masalah Lahan (Jika ada input di kolom masalah)
    if (komoditas.masalah) {
      timelineEvents.push({
        id: 'milestone-masalah',
        tanggal: komoditas.updated_at || komoditas.created_at, // Estimasi waktu update masalah
        tipe: 'kendala',
        judul: 'Laporan Masalah di Lahan ⚠️',
        deskripsi: komoditas.masalah,
        status: 'warning'
      })
    }

    // 4. Milestone Perkiraan Panen (Sebagai info masa depan atau acuan waktu)
    if (komoditas.estimasi_panen && !komoditas.tanggal_panen_aktual) {
      timelineEvents.push({
        id: 'milestone-estimasi',
        tanggal: komoditas.estimasi_panen,
        tipe: 'rencana_panen',
        judul: 'Perkiraan Rencana Panen 🌾',
        deskripsi: `Siklus pertumbuhan mendeteksi komoditas siap panen pada tanggal ${komoditas.estimasi_panen}`,
        status: 'upcoming'
      })
    }

    // 5. Milestone Panen Aktual (Final Akhir Siklus)
    if (komoditas.tanggal_panen_aktual) {
      const pendapatan = (komoditas.hasil_aktual_kg || 0) * (komoditas.harga_jual || 0)
      timelineEvents.push({
        id: 'milestone-panen-aktual',
        tanggal: komoditas.tanggal_panen_aktual,
        tipe: 'panen_sukses',
        judul: 'Panen Raya Berhasil! 🎉',
        deskripsi: `Berhasil memanen ${komoditas.hasil_aktual_kg || 0} kg dengan estimasi pendapatan kotor Rp ${pendapatan.toLocaleString('id-ID')}`,
        status: 'completed'
      })
    }

    // Urutkan timeline berdasarkan tanggal secara runtut dari awal sampai akhir
    timelineEvents.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())

    return NextResponse.json({
      status: 'success',
      meta: {
        id: komoditas.id,
        jenis_tanaman: komoditas.jenis_tanaman,
        status_sinkronisasi: komoditas.synced ? 'Synced to Cloud' : 'Local Only'
      },
      timeline: timelineEvents
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
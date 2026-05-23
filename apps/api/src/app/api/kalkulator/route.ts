import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      musim_tanam,
      jenis_tanaman,
      item_modal,
      hasil_kg,
      harga_per_kg
    } = body

    // Validasi input
    if (!user_id || !musim_tanam || !jenis_tanaman || !item_modal || !hasil_kg || !harga_per_kg) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Hitung total modal dari item_modal
    const total_modal = item_modal.reduce(
      (acc: number, item: { nama: string; nilai: number }) => acc + item.nilai, 0
    )

    // Insert ke Supabase — kolom generated dihitung otomatis oleh DB
    const { data, error } = await supabaseServer
      .from('kalkulator_usaha')
      .insert({
        user_id,
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

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// GET — ambil semua riwayat kalkulator milik user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('kalkulator_usaha')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      status: 'success',
      data
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
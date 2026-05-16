import { getCuaca } from '@/lib/openweather'
import { geminiModel } from '@/lib/gemini'
import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const kabupaten = searchParams.get('kabupaten')

    if (!user_id || !kabupaten) {
      return NextResponse.json(
        { error: 'user_id dan kabupaten wajib diisi' },
        { status: 400 }
      )
    }

    // Cek cache dulu — kalau kurang dari 1 jam, pakai cache
    const { data: cache } = await supabaseServer
      .from('cuaca_cache')
      .select('*')
      .eq('user_id', user_id)
      .single()

    const satu_jam_lalu = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    if (cache && cache.fetched_at > satu_jam_lalu) {
      return NextResponse.json({
        status: 'success',
        source: 'cache',
        data: cache
      })
    }

    // Fetch cuaca dari OpenWeatherMap
    const data_cuaca = await getCuaca(kabupaten)

    // Generate rekomendasi dari Gemini
    const cuacaHariIni = data_cuaca.list[0]
    const prompt = `
      Kondisi cuaca hari ini di ${kabupaten}:
      - Suhu: ${cuacaHariIni.main.temp}°C
      - Kelembaban: ${cuacaHariIni.main.humidity}%
      - Kondisi: ${cuacaHariIni.weather[0].description}
      - Kecepatan angin: ${cuacaHariIni.wind.speed} m/s
      
      Berikan 1 saran pertanian praktis untuk petani hari ini dalam 1 kalimat singkat.
      Contoh: "Kelembaban tinggi hari ini — waspadai serangan jamur pada tanaman kamu."
      Jawab hanya dengan kalimat sarannya saja, tanpa tambahan apapun.
    `

    const result = await geminiModel.generateContent(prompt)
    const rekomendasi_ai = result.response.text().trim()

    // Simpan ke cache (upsert)
    const { data, error } = await supabaseServer
      .from('cuaca_cache')
      .upsert({
        user_id,
        kabupaten,
        data_cuaca,
        rekomendasi_ai,
        fetched_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      status: 'success',
      source: 'fresh',
      data
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
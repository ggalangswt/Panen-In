import { getCuaca } from '@/lib/openweather'
import { requireAuthenticatedUser } from '@/lib/auth'
import { getGeminiModel } from '@/lib/gemini'
import { badRequest, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { normalizeKabupaten } from '@/lib/weather'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function buildFallbackRecommendation(cuacaHariIni: {
  main: { humidity: number; temp: number }
  weather: Array<{ main: string; description: string }>
  wind: { speed: number }
}) {
  const kondisiUtama = cuacaHariIni.weather[0]?.main?.toLowerCase() ?? ''

  if (kondisiUtama.includes('rain')) {
    return 'Ada potensi hujan hari ini, jadi tunda penyemprotan dan cek drainase lahan agar tidak becek.'
  }

  if (cuacaHariIni.main.humidity >= 80) {
    return 'Kelembaban cukup tinggi hari ini, jadi periksa daun dan batang untuk mencegah jamur sejak awal.'
  }

  if (cuacaHariIni.main.temp >= 32) {
    return 'Suhu cukup panas hari ini, jadi prioritaskan penyiraman pagi atau sore agar tanaman tidak stres.'
  }

  if (cuacaHariIni.wind.speed >= 8) {
    return 'Angin cukup kencang hari ini, jadi cek penyangga tanaman dan hindari aplikasi pupuk daun saat siang.'
  }

  return 'Cuaca relatif stabil hari ini, jadi lanjutkan perawatan rutin sambil tetap pantau kelembaban tanah.'
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const { searchParams } = new URL(request.url)
    const kabupaten = searchParams.get('kabupaten')

    if (!kabupaten) {
      return badRequest('kabupaten wajib diisi')
    }

    const kabupaten_normalized = normalizeKabupaten(kabupaten)
    const supabaseAdmin = getSupabaseAdmin()

    // Cek cache dulu — kalau kurang dari 1 jam, pakai cache
    const { data: cache } = await supabaseAdmin
      .from('cuaca_cache')
      .select('*')
      .eq('user_id', user.id)
      .eq('kabupaten_normalized', kabupaten_normalized)
      .maybeSingle()

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

    let rekomendasi_ai = buildFallbackRecommendation(cuacaHariIni)

    try {
      const result = await getGeminiModel().generateContent(prompt)
      const generatedText = result.response.text().trim()

      if (generatedText) {
        rekomendasi_ai = generatedText
      }
    } catch (error) {
      console.warn('Gemini fallback used for /api/cuaca:', error)
    }

    // Simpan ke cache (upsert)
    const { data, error } = await supabaseAdmin
      .from('cuaca_cache')
      .upsert({
        user_id: user.id,
        kabupaten,
        kabupaten_normalized,
        data_cuaca,
        rekomendasi_ai,
        fetched_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,kabupaten_normalized',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      status: 'success',
      source: 'fresh',
      data
    })

  } catch (error) {
    return handleRouteError(error)
  }
}

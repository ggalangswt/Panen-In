import { reverseGeocodeWithNominatim } from '@/lib/geocoding'
import { handleRouteError, badRequest, notFound } from '@/lib/http'
import { reverseGeocode } from '@/lib/openweather'
import { findIndonesiaRegencyFromCandidates } from '@panenin/utils'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = Number(searchParams.get('lat'))
    const lon = Number(searchParams.get('lon'))

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return badRequest('lat dan lon harus berupa angka yang valid')
    }

    const results = await reverseGeocode(lat, lon)

    const indonesiaResults = results.filter((item) => item.country === 'ID')

    if (indonesiaResults.length === 0) {
      return notFound('Lokasi tidak ditemukan di Indonesia')
    }

    const openWeatherMatch = findIndonesiaRegencyFromCandidates(
      indonesiaResults.flatMap((item) => [
        item.name,
        item.state ?? '',
        item.local_names?.id ?? '',
        item.local_names?.en ?? '',
      ]),
    )

    let matchedRegency = openWeatherMatch
    let sourceName = indonesiaResults
      .map((item) =>
        [item.local_names?.id ?? item.name, item.state].filter(Boolean).join(', '),
      )
      .find(Boolean)

    if (!matchedRegency) {
      const fallback = await reverseGeocodeWithNominatim(lat, lon)
      const fallbackCandidates = [
        fallback.address?.county ?? '',
        fallback.address?.city ?? '',
        fallback.address?.municipality ?? '',
        fallback.address?.town ?? '',
        fallback.address?.village ?? '',
        fallback.address?.state ?? '',
      ]

      matchedRegency = findIndonesiaRegencyFromCandidates(fallbackCandidates)
      sourceName = sourceName ?? fallback.display_name
    }

    if (!matchedRegency) {
      return notFound('Kabupaten/kota dari lokasi ini belum bisa dipetakan')
    }

    return NextResponse.json({
      status: 'success',
      data: {
        kabupaten: matchedRegency.name,
        matched_label: matchedRegency.name,
        source_name: sourceName ?? matchedRegency.baseName,
      },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}

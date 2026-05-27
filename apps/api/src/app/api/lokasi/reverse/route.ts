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

    const matchedRegency = findIndonesiaRegencyFromCandidates(
      indonesiaResults.flatMap((item) => [item.name, item.state ?? '']),
    )

    if (!matchedRegency) {
      return notFound('Kabupaten/kota dari lokasi ini belum bisa dipetakan')
    }

    const sourceName = indonesiaResults
      .map((item) => [item.name, item.state].filter(Boolean).join(', '))
      .find(Boolean)

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

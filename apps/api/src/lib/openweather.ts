import { getOpenWeatherApiKey } from '@/lib/env'
import { findIndonesiaRegencyByName } from '@panenin/utils'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0'

type OpenWeatherCoordinates = {
  lat: number
  lon: number
  name: string
  state?: string
  country: string
  local_names?: Record<string, string>
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Gagal fetch OpenWeather: ${response.statusText}`)
  }

  return (await response.json()) as T
}

export async function geocodeKabupaten(kabupaten: string) {
  const matchedRegency = findIndonesiaRegencyByName(kabupaten)
  const candidateQueries = Array.from(
    new Set([kabupaten, matchedRegency?.baseName].filter(Boolean) as string[]),
  )

  for (const query of candidateQueries) {
    const encodedQuery = encodeURIComponent(`${query},ID`)
    const result = await fetchJson<OpenWeatherCoordinates[]>(
      `${GEO_BASE_URL}/direct?q=${encodedQuery}&limit=1&appid=${getOpenWeatherApiKey()}`,
    )

    const coordinates = result[0]

    if (coordinates) {
      return coordinates
    }
  }

  throw new Error('Lokasi tidak ditemukan di OpenWeather')
}

export async function reverseGeocode(lat: number, lon: number) {
  const result = await fetchJson<OpenWeatherCoordinates[]>(
    `${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${getOpenWeatherApiKey()}`,
  )

  return result
}

export async function getCuaca(kabupaten: string) {
  const coordinates = await geocodeKabupaten(kabupaten)

  return fetchJson<{
    list: Array<{
      main: { temp: number; humidity: number }
      weather: Array<{ main: string; description: string; icon: string }>
      wind: { speed: number }
      dt: number
      dt_txt: string
    }>
  }>(
    `${BASE_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${getOpenWeatherApiKey()}&units=metric&lang=id&cnt=5`,
  )
}

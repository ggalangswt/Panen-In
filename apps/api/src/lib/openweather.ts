import { getOpenWeatherApiKey } from '@/lib/env'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export async function getCuaca(kabupaten: string) {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${kabupaten},ID&appid=${getOpenWeatherApiKey()}&units=metric&lang=id&cnt=5`,
    {
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error(`Gagal fetch cuaca: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

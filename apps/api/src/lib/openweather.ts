const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY!
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export async function getCuaca(kabupaten: string) {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${kabupaten},ID&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id&cnt=5`
  )

  if (!response.ok) {
    throw new Error(`Gagal fetch cuaca: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
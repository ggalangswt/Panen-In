type NominatimReverseAddress = {
  city?: string
  county?: string
  state?: string
  municipality?: string
  town?: string
  village?: string
}

type NominatimReverseResponse = {
  address?: NominatimReverseAddress
  display_name?: string
}

export async function reverseGeocodeWithNominatim(lat: number, lon: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=10&layer=address&lat=${lat}&lon=${lon}`,
    {
      cache: 'no-store',
      headers: {
        'Accept-Language': 'id,en',
        'User-Agent': 'PanenIn/1.0 (location reverse lookup)',
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Gagal fetch Nominatim: ${response.statusText}`)
  }

  return (await response.json()) as NominatimReverseResponse
}

export function normalizeKabupaten(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

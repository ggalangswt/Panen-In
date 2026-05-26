import { getSupabaseAdmin } from '@/lib/supabase-server'

type LegacyUserSeed = {
  id: string
  email: string | null
}

type LegacyUserOverrides = {
  nama?: string
  kabupaten?: string | null
}

function buildDefaultName(user: LegacyUserSeed) {
  const emailPrefix = user.email?.split('@')[0]?.trim()
  return emailPrefix || 'Petani PanenIn'
}

export async function ensureLegacyUserRow(
  user: LegacyUserSeed,
  overrides: LegacyUserOverrides = {},
) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('users')
    .select('id, nama, kabupaten')
    .eq('id', user.id)
    .maybeSingle()

  if (existingError) {
    throw existingError
  }

  if (existing) {
    const nextNama =
      overrides.nama !== undefined ? overrides.nama.trim() || existing.nama : existing.nama
    const nextKabupaten =
      overrides.kabupaten !== undefined ? overrides.kabupaten : existing.kabupaten ?? null

    if (nextNama === existing.nama && nextKabupaten === (existing.kabupaten ?? null)) {
      return existing
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        nama: nextNama,
        kabupaten: nextKabupaten,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id, nama, kabupaten')
      .single()

    if (error) {
      throw error
    }

    return data
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      id: user.id,
      nama: overrides.nama?.trim() || buildDefaultName(user),
      kabupaten: overrides.kabupaten ?? null,
    })
    .select('id, nama, kabupaten')
    .single()

  if (error) {
    throw error
  }

  return data
}

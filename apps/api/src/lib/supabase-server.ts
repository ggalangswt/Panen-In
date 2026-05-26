import { createClient } from '@supabase/supabase-js'

import {
  getSupabaseAnonKey,
  getSupabaseServiceKey,
  getSupabaseUrl,
} from '@/lib/env'

let supabaseAdminClient: any = null
let supabaseAuthClient: any = null

export function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return supabaseAdminClient
}

export function getSupabaseAuth() {
  if (!supabaseAuthClient) {
    supabaseAuthClient = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return supabaseAuthClient
}

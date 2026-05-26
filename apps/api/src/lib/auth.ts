import { NextRequest } from 'next/server'

import { getSupabaseAuth } from '@/lib/supabase-server'

export type AuthenticatedUser = {
  id: string
  email: string | null
}

export class UnauthorizedError extends Error {
  status = 401
}

function getBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization')

  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    throw new UnauthorizedError('Missing bearer token')
  }

  const token = header.slice(7).trim()

  if (!token) {
    throw new UnauthorizedError('Missing bearer token')
  }

  return token
}

export async function requireAuthenticatedUser(
  request: NextRequest,
): Promise<AuthenticatedUser> {
  const token = getBearerToken(request)
  const supabaseAuth = getSupabaseAuth()
  const {
    data: { user },
    error,
  } = await supabaseAuth.auth.getUser(token)

  if (error || !user) {
    throw new UnauthorizedError('Invalid or expired bearer token')
  }

  return {
    id: user.id,
    email: user.email ?? null,
  }
}

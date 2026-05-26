import { NextResponse } from 'next/server'

import { UnauthorizedError } from '@/lib/auth'

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function unauthorized(message: string) {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message: string) {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function notFound(message: string) {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function handleRouteError(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return unauthorized(error.message)
  }

  console.error(error)
  const message = error instanceof Error ? error.message : 'Internal server error'
  return NextResponse.json({ error: message }, { status: 500 })
}

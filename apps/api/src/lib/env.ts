function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getSupabaseUrl() {
  return requireEnv('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabaseAnonKey() {
  return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export function getSupabaseServiceKey() {
  return requireEnv('SUPABASE_SECRET_KEY')
}

export function getGeminiApiKey() {
  return requireEnv('GEMINI_API_KEY')
}

export function getOpenWeatherApiKey() {
  return requireEnv('OPENWEATHER_API_KEY')
}

export function getNotificationCronSecret() {
  return requireEnv('NOTIFICATION_CRON_SECRET')
}

export function getFirebaseProjectId() {
  return requireEnv('FIREBASE_PROJECT_ID')
}

export function getFirebaseClientEmail() {
  return requireEnv('FIREBASE_CLIENT_EMAIL')
}

export function getFirebasePrivateKey() {
  return requireEnv('FIREBASE_PRIVATE_KEY')
}

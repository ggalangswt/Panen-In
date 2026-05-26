# PanenIn Monorepo

Monorepo untuk PanenIn dengan front-end `Next.js` mobile-first dan paket shared untuk UI, types, dan utilities.

## Workspace

- `apps/api`: backend API `Next.js` untuk auth-protected routes, AI, cuaca, profile, dan settings
- `apps/mobile-web`: aplikasi utama Next.js untuk pengalaman mobile web
- `packages/ui`: komponen UI bersama
- `packages/types`: tipe data lintas layer
- `packages/utils`: helper dan formatter bersama
- `docs/`: artefak product, flow, dan timeline

## Environment

Repo ini saat ini mengandalkan environment variable berikut:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- `SUPABASE_SECRET_KEY`
- `GEMINI_API_KEY`
- `OPENWEATHER_API_KEY`
- `NOTIFICATION_CRON_SECRET`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Catatan lokal: file `.env` di root repo tidak otomatis dibaca saat kamu menjalankan `apps/api` atau `apps/mobile-web` secara langsung dari workspace app. Cara paling aman adalah source env dulu dari root repo sebelum menjalankan app:

```bash
cd /home/kurohitam/code/Panen-In
set -a
source .env
set +a
```

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`

## Menjalankan App

Backend API:

```bash
cd /home/kurohitam/code/Panen-In
set -a && source .env && set +a
pnpm --filter @panenin/api dev
```

Frontend mobile web:

```bash
cd /home/kurohitam/code/Panen-In
set -a && source .env && set +a
pnpm --filter @panenin/mobile-web dev
```

Frontend memanggil backend lewat rewrite `Next.js` ke `/api/*`. Secara lokal, request itu diproxy ke `http://127.0.0.1:4000` kecuali `NEXT_PUBLIC_API_URL` diisi nilai lain.

## Database

Migration yang wajib dipakai untuk profile, notification settings, dan cache cuaca ada di:

- [supabase/migrations/20260526_add_profiles_and_notification_settings.sql](/home/kurohitam/code/Panen-In/supabase/migrations/20260526_add_profiles_and_notification_settings.sql:1)

Setelah migration diterapkan, endpoint baru yang dipakai frontend adalah:

- `GET/PATCH /api/me/profile`
- `GET/PATCH /api/me/settings/notifications`
- `GET /api/cuaca?kabupaten=...`

## Catatan Integrasi

- Semua route user-facing sekarang wajib bearer token Supabase.
- Area `(main)` di frontend sudah protected; user tanpa session akan diarahkan ke `/login`.
- Route internal `POST /api/notifikasi/send` sekarang butuh header `x-internal-secret` yang nilainya sama dengan `NOTIFICATION_CRON_SECRET`.

## Push Notification Live

Scope live saat ini baru `cuaca pagi`.

Yang sudah diimplementasikan:

- frontend web meminta permission browser saat toggle notifikasi utama diaktifkan
- frontend mendaftarkan FCM token ke `POST /api/notifikasi/register`
- backend scheduler hanya memilih user dengan `notifications_enabled = true` dan `weather_morning = true`
- backend hanya mengirim saat `morning_hour` cocok dengan jam lokal user
- backend mendedupe `cuaca_pagi` agar tidak terkirim dua kali di hari lokal yang sama
- backend membersihkan token FCM yang invalid

Yang masih perlu kamu set manual di deploy:

1. Isi env Firebase Web di frontend Vercel.
2. Isi env Firebase Admin di backend Railway.
3. Buat Railway Cron yang memanggil:

```http
POST /api/notifikasi/send
x-internal-secret: <NOTIFICATION_CRON_SECRET>
```

Jadwal yang disarankan:

- `0 * * * *`

Artinya cron jalan tiap jam, lalu backend sendiri yang memfilter user sesuai timezone dan `morning_hour`.

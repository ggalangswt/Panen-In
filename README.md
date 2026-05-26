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
- `SUPABASE_SECRET_KEY`
- `GEMINI_API_KEY`
- `OPENWEATHER_API_KEY`
- `NOTIFICATION_CRON_SECRET`

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

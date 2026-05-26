# API App

Backend PanenIn dibangun dengan `Next.js App Router` dan berjalan di port `4000`.

## Env yang Dibutuhkan

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY`
- `GEMINI_API_KEY`
- `OPENWEATHER_API_KEY`
- `NOTIFICATION_CRON_SECRET`

## Jalankan Lokal

Jalankan dari root repo setelah source `.env`:

```bash
cd /home/kurohitam/code/Panen-In
set -a && source .env && set +a
pnpm --filter @panenin/api dev
```

## Endpoint Frontend

- `GET/PATCH /api/me/profile`
- `GET/PATCH /api/me/settings/notifications`
- `GET /api/cuaca?kabupaten=...`
- `POST/GET /api/kalkulator`
- `POST/GET /api/catatan-panen`
- `GET /api/catatan-panen/ringkasan`
- `GET /api/komoditas/timeline?id=...`
- `POST /api/konsultasi`

Semua endpoint di atas memakai `Authorization: Bearer <supabase_access_token>`.

## Endpoint Internal

- `POST /api/notifikasi/send`

Route internal ini tidak memakai bearer token user. Gunakan header:

```http
x-internal-secret: <NOTIFICATION_CRON_SECRET>
```

## Migration

Pastikan migration ini sudah diterapkan ke database Supabase:

- [../../supabase/migrations/20260526_add_profiles_and_notification_settings.sql](/home/kurohitam/code/Panen-In/supabase/migrations/20260526_add_profiles_and_notification_settings.sql:1)

## Catatan Runtime

- Backend akan memastikan user Supabase punya row di tabel legacy `public.users` saat request authenticated pertama.
- Endpoint cuaca tetap akan mengembalikan response walau Gemini sedang `503`; dalam kondisi itu backend memakai fallback rekomendasi lokal.

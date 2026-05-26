# Mobile Web App

Frontend PanenIn memakai `Next.js` mobile-first dan sekarang sudah terhubung ke backend authenticated API.

## Fitur yang Sudah Terhubung

- login dan register via Supabase Auth
- protected route untuk area `(main)`
- profile dan personal info via `/api/me/profile`
- notification settings via `/api/me/settings/notifications`
- weather via `/api/cuaca`
- calculator via `/api/kalkulator`
- notes summary dan list via `/api/catatan-panen`
- consultation via `/api/konsultasi`

## Jalankan Lokal

```bash
cd /home/kurohitam/code/Panen-In
set -a && source .env && set +a
pnpm --filter @panenin/mobile-web dev
```

## Env yang Dibutuhkan

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

## Catatan Integrasi

- Frontend mengambil access token dari session Supabase browser.
- Semua request backend dikirim ke path `/api/*` dan diproxy oleh `Next.js` ke backend lokal di `http://127.0.0.1:4000`.
- Jika backend berada di host lain, set `NEXT_PUBLIC_API_URL`.
- Saat user menyalakan toggle notifikasi utama di halaman profile, frontend akan meminta permission browser dan mendaftarkan token FCM web.

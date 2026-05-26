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

## Catatan Integrasi

- Frontend mengambil access token dari session Supabase browser.
- Semua request backend dikirim ke path `/api/*` dan diproxy oleh `Next.js` ke backend lokal di `http://127.0.0.1:4000`.
- Jika backend berada di host lain, set `NEXT_PUBLIC_API_URL`.

# Components

Sumber:
- Button `node-id=4:104`
- Card vegetables `node-id=14:172`
- Bottom nav `node-id=63:534`
- Toggle `node-id=94:2639`

## Button

Node: `4:104`

Varian:
- `ver1`: background putih, teks `primary.pr30`
- `ver2`: background `primary.pr30`, teks putih

Spesifikasi:
- tinggi visual `57px`
- radius `10px`
- padding horizontal `10px`
- padding vertical `15px`
- label style `18px / 27px / 700`
- lebar referensi pada mockup `360px`

Aturan:
- gunakan `ver1` untuk CTA di splash / entry
- gunakan `ver2` untuk CTA utama di surface terang

## Card Vegetables

Node: `14:172`

Varian:
- `default`
- `selection`
- `default pilih tanaman`
- `selection pilih tanaman`

Pola visual:
- kartu putih dengan border `neutral.ne20`
- selected state memakai `primary.pr00` + border `primary.pr30`
- ada check icon kecil di pojok kanan atas saat selected
- label tanaman memakai `12px / 18px / 500`
- icon tanaman berada di tengah, label di bawah icon
- radius `10px`

Grid:
- dua kolom
- gap horizontal `10px`
- gap vertikal `10px`

Komoditas referensi:
- Padi
- Jagung
- Cabai
- Tomat
- Bawang
- Singkok
- Kedelai
- Sayuran Hijau

Catatan:
- ejaan `Singkok` muncul di Figma; jangan ubah otomatis tanpa konfirmasi product copy

## Bottom Nav

Node: `63:534`

State aktif:
- `home`
- `catatan`
- `profil`

Struktur:
- container putih dengan top border `neutral.ne20`
- tinggi `77px`
- tiga item nav
- item aktif memakai gradient hijau dan teks/icon putih
- item nonaktif memakai teks `neutral.ne30`
- setiap item radius `10px`
- label style `12px / 18px / 500`

Icon slots:
- Home
- Catatan
- Profil

## Toggle

Node: `94:2639`

State:
- `false`: track `neutral.ne10`
- `true`: track `primary.pr30`

Spesifikasi:
- ukuran track `66px x 31px`
- radius `999px`
- inner padding `2px`
- knob diameter `25px`
- knob putih dengan shadow lembut

Aturan:
- gunakan animasi geser sederhana saat berubah state
- jangan ubah ukuran dasar toggle kecuali memang ada kebutuhan accessibility yang jelas

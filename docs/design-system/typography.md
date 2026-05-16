# Typography

Sumber:
- Figma typography board `node-id=1:157`
- style yang muncul di komponen referensi splash, button, nav, card, dan layout guide

Font family utama:
- `Plus Jakarta Sans`

## Semantic Roles

| Role | Size | Line Height | Weight | Figma Style |
| --- | --- | --- | --- | --- |
| `display.bold` | `22px` | `29px` | `700` | `Display/Bold` |
| `display.semibold` | `22px` | `29px` | `600` | `Display/SemiBold` |
| `display.medium` | `22px` | `29px` | `500` | `Display/Medium` |
| `display.regular` | `22px` | `29px` | `400` | `Display/Regular` |
| `display.light` | `22px` | `29px` | `300` | `Display/Light` |
| `heading.h1.bold` | `18px` | `27px` | `700` | `Heading/h1/Bold` |
| `heading.h2.bold` | `15px` | `22.5px` | `700` | `Heading/h2/Bold` |
| `heading.h2.medium` | `15px` | `22.5px` | `500` | `Heading/h2/Medium` |
| `body.regular` | `14px` | `21px` | `400` | `Body/Regular` |
| `label.medium` | `12px` | `18px` | `500` | `Label/Medium` |
| `micro.extrabold` | `10px` | `15px` | `800` | `Micro/ExtraBold` |

## Product-Specific Usage

| Use Case | Style |
| --- | --- |
| splash logo title | `28px / 1` `800` |
| primary button label | `heading.h1.bold` |
| section heading | `heading.h2.medium` atau `heading.h2.bold` |
| chip label | `label.medium` |
| card body copy | `body.regular` |
| bottom nav label | `label.medium` |
| micro helper / tiny indicator | `micro.extrabold` |

## Implementasi

- Pertahankan `Plus Jakarta Sans` sebagai font utama semua screen.
- Jangan campur font display lain untuk fitur utama app.
- Untuk heading, utamakan role semantik (`h1`, `h2`) dibanding styling bebas.
- Body copy di app saat ini dominan memakai `14/21`, jadi itu sebaiknya jadi default teks penjelas.

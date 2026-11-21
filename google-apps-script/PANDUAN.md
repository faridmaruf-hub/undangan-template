# Panduan memasang RSVP & Ucapan (Google Sheets)

## 1. Atur akses Sheet
Bagikan Sheet ke **Restricted** (hanya Anda, plus keluarga yang perlu memantau, misalnya dengan akses *Viewer*).
Undangan **tidak** butuh Sheet yang bisa diedit publik — skrip berjalan atas nama Anda.

## 2. Tempel skrip
1. Buka Google Sheet → menu **Extensions → Apps Script**.
2. Hapus isi `Code.gs` bawaan, tempel seluruh isi file `Code.gs` dari folder ini, lalu **Save** (ikon disket).
3. Di toolbar, pilih fungsi **`setup`** → klik **Run**.
   Google akan meminta izin: pilih akun Anda → *Advanced* → *Go to … (unsafe)* → **Allow**.
   (Peringatan "unsafe" muncul karena skrip buatan sendiri yang belum diverifikasi Google; ini normal.)
   Setelah itu sheet **RSVP** dengan judul kolom muncul di spreadsheet.

## 3. Deploy sebagai Web App
1. Klik **Deploy → New deployment**.
2. Ikon roda gigi → pilih **Web app**.
3. *Execute as*: **Me** · *Who has access*: **Anyone**.
4. Klik **Deploy**, lalu salin **Web app URL** (berakhiran `/exec`).

## 4. Sambungkan ke undangan
Di `undangan.config.mjs`, isi:
```js
rsvp: { url: "https://script.google.com/macros/s/XXXX/exec", maksTamu: 5 },
```
Lalu `node build.mjs` dan push. Bagian RSVP akan muncul otomatis.

## Mengelola data
- **Sembunyikan ucapan** yang tidak pantas: hapus centang di kolom **Tampilkan**.
- **Total tamu hadir**: di sel kosong mana saja ketik `=SUMIF(C:C;"Hadir";D:D)` (gunakan `,` bila setelan Sheet berbahasa Inggris).
- **Jangan ubah urutan kolom** A–F; menambah kolom setelah F aman.

## Kalau skrip diubah
**Deploy → Manage deployments → ✏️ (Edit) → Version: New version → Deploy.**
Cara ini mempertahankan URL yang sama. Membuat *New deployment* akan menghasilkan URL baru.

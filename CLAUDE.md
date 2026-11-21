# Undangan Digital — Templat

Templat undangan pernikahan digital milik Farid Ma'ruf (jasa undangan digital). Situs statis tanpa dependensi.
Repo ini **publik** dan menjadi dasar setiap repo klien (privat). Jangan pernah memasukkan data klien ke sini.

## Struktur
```
undangan.config.mjs   semua isi undangan (satu-satunya berkas yang diubah per klien)
konten/foto/, konten/musik.mp3
tema/                 halaman.mjs (HTML), buat-link.mjs, format.mjs, style.css, script.js, buat-link.js
build.mjs             node build.mjs → dist/ (validasi tanggal & berkas, baca ukuran gambar pratinjau)
alat/                 siapkan-foto.py, siapkan-pratinjau.py (butuh Pillow)
google-apps-script/   Code.gs + PANDUAN.md (RSVP ke Google Sheets)
wrangler.jsonc        nama Worker = subdomain: <name>.mengundang.workers.dev; assets = dist
```
- Nama hari dan bulan dihitung dari tanggal (Intl id-ID), jangan ditulis manual.
- Opsi config penting: `urutan` (wanita-pria/pria-wanita), `tema` ("" perak-sage atau "kuning-banjar"), `pratinjau.foto` (1200×630), `rsvp.url` ("" disembunyikan, "demo", atau URL /exec), `musik`, `amplop.rekening` (amplop digital; kosong = disembunyikan), `acara[].informasi: true` (acara yang hanya diberitahukan, mis. akad di KUA), `penutup.turutMengundang` (teks atau daftar).
- Tema warna memakai variabel CSS di `:root` dan diganti lewat `[data-tema="…"]`. Tema baru cukup ditambahkan sebagai blok baru; jangan menulis warna langsung di aturan CSS.
- Bagian ucapan disembunyikan sampai ada minimal satu ucapan.

## Alur kerja
1. Ubah config atau tema, lalu `node build.mjs`.
2. Periksa tampilan di lebar HP. Headless Chrome punya lebar minimum, jadi render `dist/` di dalam `<iframe width=390>`. Pakai salinan sementara `_preview.html` dengan cover terbuka dan `.reveal` dipaksa terlihat, lalu hapus.
3. Push ke `main`. Cloudflare Workers Builds menjalankan `node build.mjs` lalu `npx wrangler deploy`.
4. Perubahan `tema/` sebaiknya disalin juga ke repo klien yang masih aktif, karena repo klien adalah salinan beku templat.

Membuat undangan klien baru: lihat `PANDUAN-KLIEN-BARU.md`. Di Cloudflare, isi *Project name* dan *Build command* lewat **Advanced settings** saat import.

## Bahasa
Semua teks wajib bahasa Indonesia yang baik, benar, dan wajar dibaca. Tidak ada hiasan berbahasa Inggris, dan tidak ada frasa klise salinan undangan lain.
Ikuti `PEDOMAN-BAHASA.md` dan periksa setiap teks baru sebelum dikirim.
Pemilik lebih menyukai solusi yang berkelanjutan dan sistematis (bisa dipakai ulang untuk klien berikutnya).

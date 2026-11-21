# Undangan Digital — Templat

Templat undangan pernikahan digital buatan [Farid Ma'ruf](https://faridmaruf.com).
Situs statis yang ringan, dirancang untuk dibuka di HP lewat tautan WhatsApp.

**Demo:** https://demo.mengundang.workers.dev · [Alat tautan tamu](https://demo.mengundang.workers.dev/buat-link)

## Fitur

- **Nama tamu di sampul** dari tautan: `…/?to=Bapak+Ahmad+%26+Keluarga`
- **Profil mempelai**, ayat/kutipan, hitung mundur, galeri dengan lightbox
- **Waktu dan tempat**: tombol Google Maps dan *Simpan ke Kalender*; nama hari dan bulan dihitung otomatis dari tanggal
- **RSVP dan ucapan** tersimpan di Google Sheets milik klien (Google Apps Script, tanpa server sendiri), dengan kolom untuk menyembunyikan ucapan
- **Musik latar** (opsional), berhenti otomatis saat aplikasi ditinggalkan
- **Alat buat tautan tamu**: tempel daftar nama (dan nomor WhatsApp), langsung jadi tautan dan pesan undangan siap kirim, plus ekspor CSV. Semua diproses di browser.
- **Pratinjau WhatsApp** (Open Graph) dan `noindex` agar tidak muncul di mesin pencari
- **Teks berbahasa Indonesia yang baik dan benar**: lihat [PEDOMAN-BAHASA.md](PEDOMAN-BAHASA.md)

## Cara kerja

```
undangan.config.mjs   ← semua isi undangan (satu-satunya berkas yang diubah per klien)
konten/foto/           ← foto
konten/musik.mp3       ← musik (opsional)
tema/                  ← tampilan: HTML, CSS, JavaScript
build.mjs              ← node build.mjs  →  dist/
```

Tanpa dependensi: cukup Node 18+. Build memeriksa isian penting (tanggal valid, berkas foto ada) dan berhenti dengan pesan jelas bila ada yang salah.

```bash
node build.mjs        # hasil di dist/, buka dist/index.html di browser
```

Hosting: Cloudflare Workers (static assets), deploy otomatis setiap push ke GitHub.
Alamat klien: `<nama-pasangan>.mengundang.workers.dev`.

## Membuat undangan klien baru

Lihat [PANDUAN-KLIEN-BARU.md](PANDUAN-KLIEN-BARU.md).

## Hak cipta

© Farid Ma'ruf. Kode ini dipublikasikan sebagai portfolio. Foto pada demo adalah gambar pengganti (placeholder).

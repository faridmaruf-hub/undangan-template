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
- **Tema warna**: perak-sage (bawaan) atau *kuning-banjar* (emas antik, terinspirasi kuning kebesaran Kesultanan Banjar)
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

## Kredit

Musik demo: *Velvet Breath of the Saxophone* — Farid Ma'ruf.

Foto demo dari [Unsplash](https://unsplash.com) ([Unsplash License](https://unsplash.com/license)), terima kasih kepada para fotografernya:

| Berkas | Fotografer | Sumber |
|---|---|---|
| sampul, galeri-01 | Jonathan Borba | [__vggaw2Nzk](https://unsplash.com/photos/__vggaw2Nzk) |
| hero, galeri-05 | Mesa Photo | [V8JBij7CvUE](https://unsplash.com/photos/V8JBij7CvUE) |
| hitung-mundur | Wedding Photography | [Qn5QFRNXJIs](https://unsplash.com/photos/Qn5QFRNXJIs) |
| penutup | Catherine Kay Greenup | [gJJzYZDRieM](https://unsplash.com/photos/gJJzYZDRieM) |
| panel-samping, galeri-07 | Stacey Vandas | [8HX_r68ZM58](https://unsplash.com/photos/8HX_r68ZM58) |
| mempelai-wanita | Bob Oh | [iJY-h1wEMK4](https://unsplash.com/photos/iJY-h1wEMK4) |
| mempelai-pria | Klara Kulikova | [sj3gSYe5OXE](https://unsplash.com/photos/sj3gSYe5OXE) |
| galeri-02 | SASI | [iCQKDhQKbcE](https://unsplash.com/photos/iCQKDhQKbcE) |
| galeri-03 | Annie Spratt | [V9l3wtOVk4c](https://unsplash.com/photos/V9l3wtOVk4c) |
| galeri-04 | Shelby Deeter | [-XlBjdtRqK8](https://unsplash.com/photos/-XlBjdtRqK8) |
| galeri-06 | Oscar Helgstrand | [PwCNGxJd8hs](https://unsplash.com/photos/PwCNGxJd8hs) |

Untuk klien sungguhan, foto-foto ini diganti dengan foto prewedding klien.

## Hak cipta

© Farid Ma'ruf. Kode ini dipublikasikan sebagai portfolio; foto dan musik demo mengikuti lisensi masing-masing.

# Panduan: undangan untuk klien baru

Contoh: pasangan **Andi & Sari** → alamat `andi-sari.mengundang.workers.dev`.

## 1. Buat repo privat dari templat
Di GitHub, buka repo `undangan-template` → **Use this template → Create a new repository**.
- Nama: `undangan-andi-sari`
- Visibilitas: **Private** (berisi foto dan data pribadi klien)

Lalu clone ke komputer.

## 2. Isi konten
1. **Foto**: perkecil dulu, lalu letakkan di `konten/foto/`.
   ```bash
   python alat/siapkan-foto.py "C:/folder/foto-asli" konten/foto
   ```
   Hapus foto contoh (`sampul.jpg`, `galeri-01.jpg`, dst.) yang tidak dipakai.
   Foto profil mempelai: potong persegi, wajah di tengah (±600×600 px).
2. **Musik** (opsional): `konten/musik.mp3`, lalu isi `musik: "musik.mp3"`. Pastikan berlisensi.
3. **`undangan.config.mjs`**: isi semua bagian. Yang paling sering terlewat:
   - `slug` dan `url` (sama dengan nama Worker)
   - `zonaWaktu` dan `labelZonaWaktu` (WIB/WITA/WIT)
   - `acara[].mulai` lengkap dengan zona, mis. `"2027-06-12T08:00:00+07:00"`
   - `acara[].peta`: tautan dari Google Maps → Bagikan → Salin link
4. **Nama Worker** di `wrangler.jsonc`: `"name": "andi-sari"`.
5. **Periksa bahasa** semua teks dengan [PEDOMAN-BAHASA.md](PEDOMAN-BAHASA.md).
6. `node build.mjs`, buka `dist/index.html`, periksa di ukuran HP (DevTools → mode perangkat).
7. Commit dan push.

## 3. RSVP (Google Sheets)
Ikuti [google-apps-script/PANDUAN.md](google-apps-script/PANDUAN.md). Sheet sebaiknya milik akun yang Anda kelola atau dibagikan ke klien sebagai *Viewer*.
Masukkan URL `/exec` ke `rsvp.url`, lalu build dan push lagi.

## 4. Online-kan di Cloudflare
1. **Workers & Pages → Create application → Import a repository** → pilih `undangan-andi-sari`.
   - Bila repo tidak muncul: *Configure GitHub App* → tambahkan repo tersebut.
2. Pengaturan build:
   - **Project/Worker name**: `andi-sari` (harus sama dengan `wrangler.jsonc`)
   - **Build command**: `node build.mjs`
   - **Deploy command**: `npx wrangler deploy`
3. Deploy. Alamat: `https://andi-sari.mengundang.workers.dev`.

## 5. Sebelum dibagikan
- [ ] Buka di HP sungguhan (Android dan iPhone bila ada): sampul, musik, galeri, RSVP
- [ ] Kirim satu RSVP percobaan, lalu hapus barisnya di Sheet
- [ ] Kirim tautan ke diri sendiri di WhatsApp untuk mengecek pratinjau
- [ ] Minta klien memeriksa ulang **nama, gelar, tanggal, jam, dan alamat**
- [ ] Bagikan alat `…/buat-link` ke klien untuk membuat tautan per tamu

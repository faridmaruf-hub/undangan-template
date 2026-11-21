import { esc, tanggalLengkap, teksWaktu, acaraUndangan, acaraInformasi, kalimatInformasi } from "./format.mjs";
import { namaPasangan } from "./halaman.mjs";

// Pesan WhatsApp bawaan, disusun dari data acara (tanggal & hari dihitung otomatis).
export function pesanBawaan(c) {
  const p = c.pesanWhatsApp || {};
  const acara = acaraUndangan(c);
  const tempatSama = acara.every((a) => a.tempat === acara[0].tempat && (a.alamat || []).join() === (acara[0].alamat || []).join());
  const tempatTeks = (a) => [a.tempat, ...(a.alamat || [])].join(", ");
  const blokAcara = acara.map((a) => [
    `*${a.nama}*`,
    tanggalLengkap(a.mulai, c.zonaWaktu),
    teksWaktu(a, c.zonaWaktu, c.labelZonaWaktu),
    ...(tempatSama ? [] : [`Tempat: ${tempatTeks(a)}`]),
  ].join("\n")).join("\n\n");

  return [
    c.pembuka?.salam,
    "Yth. {nama}",
    p.pembuka || "Dengan hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:",
    blokAcara,
    tempatSama ? `Tempat: ${tempatTeks(acara[0])}` : null,
    acaraInformasi(c).map((a) => kalimatInformasi(a, c.zonaWaktu)).join("\n") || null,
    "Informasi lengkap dan konfirmasi kehadiran dapat dilihat melalui tautan berikut:\n{tautan}",
    p.penutup || "Kami akan merasa terhormat apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    c.penutup?.salam,
    `${c.penutup?.penanda || "Kami yang berbahagia"},\n*${namaPasangan(c)}*`,
  ].filter(Boolean).join("\n\n");
}

export function renderBuatLink(c) {
  const data = {
    url: c.url,
    slug: c.slug || "undangan",
    kodeNegara: c.kodeNegara || "62",
    templat: pesanBawaan(c),
  };
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Buat Tautan Tamu — ${esc(namaPasangan(c))}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/style.css">
  <script id="buat-link-config" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
</head>
<body class="tool"${c.tema ? ` data-tema="${esc(c.tema)}"` : ""}>
  <main class="tool__main">
    <h1 class="title">Buat Tautan Tamu</h1>
    <p class="lead">Undangan ${esc(namaPasangan(c))} · <a href="${esc(c.url)}/" target="_blank" rel="noopener">${esc(c.url.replace(/^https:\/\//, ""))}</a></p>

    <section class="tool__card">
      <label class="field"><span>Daftar tamu</span>
        <textarea id="daftar" rows="8" placeholder="Bapak Ahmad &amp; Keluarga, 081234567890&#10;Ibu Siti&#10;Saudara Rahmat, 0857 1234 5678"></textarea></label>
      <p class="tool__hint">Satu nama per baris. Nomor WhatsApp boleh ditambahkan setelah tanda koma.</p>

      <details class="tool__details">
        <summary>Ubah templat pesan</summary>
        <label class="field"><span>Templat pesan WhatsApp</span>
          <textarea id="templat" rows="16"></textarea></label>
        <p class="tool__hint"><code>{nama}</code> dan <code>{tautan}</code> diganti otomatis. Teks di antara tanda bintang (<code>*seperti ini*</code>) tampil tebal di WhatsApp.</p>
        <button id="resetTemplat" class="btn btn--ghost" type="button">Kembalikan templat bawaan</button>
      </details>
    </section>

    <div class="tool__bar">
      <p id="ringkasan" class="tool__hint"></p>
      <button id="unduhCsv" class="btn btn--ghost" type="button" disabled>Unduh CSV</button>
    </div>
    <ul id="hasil" class="tool__list"></ul>

    <p class="tool__hint tool__privacy">Semua proses berjalan di browser ini. Daftar tamu tidak dikirim ke server mana pun; hanya disimpan di perangkat ini agar tidak hilang saat halaman ditutup.</p>
  </main>
  <script src="assets/buat-link.js"></script>
</body>
</html>
`;
}

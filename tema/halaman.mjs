import { esc, infoTanggal, tanggalLengkap, teksWaktu, tautanKalender } from "./format.mjs";

const IKON = {
  surat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  musik: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

const img = (f) => `assets/img/${encodeURI(f)}`;
const bg = (f) => (f ? ` style="background-image:url('${img(f)}')"` : "");

export function urutanMempelai(c) {
  const { wanita, pria } = c.mempelai;
  return c.mempelai.urutan === "pria-wanita" ? [pria, wanita] : [wanita, pria];
}
export const namaPasangan = (c) => urutanMempelai(c).map((m) => m.panggilan).join(" & ");

function kartuMempelai(m) {
  const ig = m.instagram ? m.instagram.replace(/^@/, "") : "";
  return `
      <div class="couple reveal">
        ${m.foto ? `<div class="couple__photo"><img src="${img(m.foto)}" alt="${esc(m.namaLengkap || m.panggilan)}" loading="lazy"></div>` : ""}
        <h3 class="script couple__name">${esc(m.namaLengkap || m.panggilan)}</h3>
        <p class="couple__parents">${esc(m.keterangan)} dari<br><strong>${esc(m.ayah)}</strong><br>dan <strong>${esc(m.ibu)}</strong></p>
        ${ig ? `<a class="ig" href="https://www.instagram.com/${esc(ig)}/" target="_blank" rel="noopener">${IKON.instagram} @${esc(ig)}</a>` : ""}
      </div>`;
}

function kartuAcara(a, c, judul) {
  const t = infoTanggal(a.mulai, c.zonaWaktu);
  return `
      <article class="event reveal">
        <h3 class="event__title">${esc(a.nama)}</h3>
        <div class="event__date">
          <span class="event__day">${esc(t.hari)}</span>
          <span class="event__num">${esc(t.tanggal)}</span>
          <span class="event__month">${esc(t.bulan)} ${esc(t.tahun)}</span>
        </div>
        <p class="event__time">${esc(teksWaktu(a, c.zonaWaktu, c.labelZonaWaktu))}</p>
        <p class="event__place"><strong>${esc(a.tempat)}</strong>${(a.alamat || []).map((l) => `<br>${esc(l)}`).join("")}</p>
        <div class="event__actions">
          ${a.peta ? `<a class="btn btn--dark" href="${esc(a.peta)}" target="_blank" rel="noopener">Lihat Lokasi</a>` : ""}
          <a class="btn btn--ghost" href="${esc(tautanKalender(a, judul, c.durasiKalenderJam))}" target="_blank" rel="noopener">Simpan ke Kalender</a>
        </div>
      </article>`;
}

export function renderHalaman(c) {
  const pasangan = namaPasangan(c);
  const [m1, m2] = urutanMempelai(c);
  const judul = `${esc(m1.panggilan)} &amp; ${esc(m2.panggilan)}`;
  const target = c.hitungMundur?.target || c.acara[c.acara.length - 1].mulai;
  const tUtama = infoTanggal(target, c.zonaWaktu);
  const tanggalTitik = `${tUtama.tanggal} · ${String(new Date(target).toLocaleString("en-US", { timeZone: c.zonaWaktu, month: "2-digit" }))} · ${tUtama.tahun}`;
  const tanggalUtama = `${tanggalLengkap(target, c.zonaWaktu)}`;
  const lokasiUtama = c.acara[c.acara.length - 1];
  const runtime = {
    target,
    rsvpUrl: c.rsvp?.url || "",
    maksTamu: c.rsvp?.maksTamu || 5,
  };
  const p = c.penutup || {};
  const kredit = c.kredit;

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Undangan Pernikahan ${judul}</title>
  <meta name="description" content="Undangan pernikahan ${judul} — ${esc(tanggalUtama)}.">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#3b3d48">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(c.sampul?.judul || "The Wedding of")} ${judul}">
  <meta property="og:description" content="${esc(tanggalUtama)} · ${esc([lokasiUtama.tempat, ...(lokasiUtama.alamat || [])].join(", "))}">
  <meta property="og:url" content="${esc(c.url)}/">
  ${c.sampul?.foto ? `<meta property="og:image" content="${esc(c.url)}/${img(c.sampul.foto)}">` : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/style.css">
  <script id="undangan-config" type="application/json">${JSON.stringify(runtime).replace(/</g, "\\u003c")}</script>
</head>
<body class="locked">

  <!-- ============ SAMPUL ============ -->
  <div id="cover" class="cover"${bg(c.sampul?.foto)}>
    <div class="cover__inner">
      <p class="eyebrow">${esc(c.sampul?.judul || "The Wedding of")}</p>
      <h1 class="script cover__names">${esc(m1.panggilan)} <span>&amp;</span> ${esc(m2.panggilan)}</h1>
      <p class="cover__date">${esc(tanggalTitik)}</p>
      <div class="cover__guest">
        <p>Yth. Bapak/Ibu/Saudara/i</p>
        <p id="guestName" class="cover__guest-name">Tamu Undangan</p>
        <small>Mohon maaf apabila ada kesalahan penulisan nama atau gelar.</small>
      </div>
      <button id="openBtn" class="btn btn--light" type="button">${IKON.surat} Buka Undangan</button>
    </div>
  </div>

  <aside class="side"${bg(c.panelSamping?.foto)} aria-hidden="true">
    <div class="side__inner">
      <p class="eyebrow">${esc(c.sampul?.judul || "The Wedding of")}</p>
      <p class="script side__names">${judul}</p>
      <p class="side__date">${esc(tanggalUtama)}</p>
    </div>
  </aside>

  <main class="main">

    <section class="hero"${bg(c.hero?.foto)}>
      <div class="hero__content reveal">
        <p class="eyebrow">${esc(c.sampul?.judul || "The Wedding of")}</p>
        <h2 class="script hero__names">${judul}</h2>
        <p class="hero__date">${esc(tanggalUtama)}</p>
      </div>
      <div class="scroll-hint" aria-hidden="true"><span></span></div>
    </section>

    ${c.ayat ? `
    <!-- ============ AYAT ============ -->
    <section class="section section--soft center">
      ${c.ayat.basmalah ? `<p class="arabic reveal">${esc(c.ayat.basmalah)}</p>
      <div class="ornament reveal" aria-hidden="true"></div>` : ""}
      ${c.ayat.arab ? `<p class="arabic arabic--ayat reveal">${esc(c.ayat.arab)}</p>` : ""}
      <p class="quote reveal">“${esc(c.ayat.terjemahan)}”</p>
      <p class="quote-src reveal">${esc(c.ayat.sumber)}</p>
    </section>` : ""}

    <!-- ============ MEMPELAI ============ -->
    <section class="section center">
      ${c.pembuka?.salam ? `<p class="salam reveal">${esc(c.pembuka.salam)}</p>` : ""}
      ${c.pembuka?.teks ? `<p class="lead reveal">${esc(c.pembuka.teks)}</p>` : ""}
      ${kartuMempelai(m1)}
      <p class="script amp reveal">&amp;</p>
      ${kartuMempelai(m2)}
    </section>

    <!-- ============ HITUNG MUNDUR ============ -->
    <section class="countdown-wrap"${bg(c.hitungMundur?.foto)}>
      <div class="countdown-card reveal">
        <p class="eyebrow">Menuju Hari Bahagia</p>
        <div id="countdown" class="countdown">
          <div><span data-cd="d">0</span><small>Hari</small></div>
          <div><span data-cd="h">0</span><small>Jam</small></div>
          <div><span data-cd="m">0</span><small>Menit</small></div>
          <div><span data-cd="s">0</span><small>Detik</small></div>
        </div>
        <p id="countdownDone" class="countdown-done" hidden>Alhamdulillah, acara telah berlangsung. Terima kasih atas doa restunya.</p>
      </div>
    </section>

    <!-- ============ ACARA ============ -->
    <section class="section section--soft center">
      <h2 class="title reveal">Waktu dan Tempat</h2>
      ${c.acara.map((a) => kartuAcara(a, c, pasangan)).join("")}
    </section>

    ${c.galeri?.length ? `
    <!-- ============ GALERI ============ -->
    <section class="section center">
      <h2 class="title reveal">Galeri</h2>
      <div id="gallery" class="gallery">
        ${c.galeri.map((g, i) => `<img src="${img(g.foto)}" alt="Foto ${i + 1}" loading="lazy"${g.bentuk ? ` class="${g.bentuk === "tinggi" ? "tall" : g.bentuk === "lebar" ? "wide" : ""}"` : ""}>`).join("\n        ")}
      </div>
    </section>` : ""}

    <!-- ============ RSVP & UCAPAN ============ -->
    <section id="rsvp" class="section section--soft center" hidden>
      <h2 class="title reveal">Konfirmasi Kehadiran</h2>
      <p class="lead reveal">Mohon konfirmasi kehadiran Bapak/Ibu/Saudara/i. Doa dan ucapan dapat dituliskan di bawah ini.</p>
      <form id="rsvpForm" class="rsvp reveal" novalidate>
        <label class="field"><span>Nama</span>
          <input name="nama" type="text" maxlength="80" required autocomplete="name" placeholder="Nama Anda"></label>
        <fieldset class="field"><legend>Kehadiran</legend>
          <div class="choice">
            <label><input type="radio" name="kehadiran" value="Hadir" required><span>Hadir</span></label>
            <label><input type="radio" name="kehadiran" value="Tidak Hadir"><span>Tidak Hadir</span></label>
            <label><input type="radio" name="kehadiran" value="Masih Ragu"><span>Masih Ragu</span></label>
          </div>
        </fieldset>
        <label class="field" id="jumlahField" hidden><span>Jumlah yang hadir</span>
          <select name="jumlah">${Array.from({ length: runtime.maksTamu }, (_, i) => `<option value="${i + 1}">${i + 1} orang</option>`).join("")}</select></label>
        <label class="field"><span>Ucapan dan Doa</span>
          <textarea name="ucapan" rows="4" maxlength="500" placeholder="Tulis ucapan dan doa terbaik…"></textarea></label>
        <input class="hp" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn btn--dark rsvp__submit" type="submit">Kirim</button>
        <p class="rsvp__status" role="status" aria-live="polite"></p>
      </form>
      <div class="wishes reveal">
        <h3 class="wishes__title">Ucapan dan Doa <span id="wishCount"></span></h3>
        <ul id="wishList" class="wishes__list"><li class="wishes__empty">Memuat ucapan…</li></ul>
      </div>
    </section>

    <!-- ============ PENUTUP ============ -->
    <section class="closing"${bg(p.foto)}>
      <div class="closing__content reveal">
        ${p.teks ? `<p class="lead">${esc(p.teks)}</p>` : ""}
        ${p.salam ? `<p class="salam">${esc(p.salam)}</p>` : ""}
        ${p.turutMengundang ? `<p class="closing__label">Turut Mengundang</p>
        <p class="closing__text">${esc(p.turutMengundang)}</p>` : ""}
        <p class="closing__label">${esc(p.penanda || "Kami yang berbahagia")}</p>
        <p class="script closing__names">${judul}</p>
        ${p.keterangan ? `<p class="closing__text">${esc(p.keterangan)}</p>` : ""}
      </div>
    </section>

    ${kredit ? `<footer class="footer">
      <p class="footer__by">${esc(kredit.teks)} <a href="${esc(kredit.situs)}" target="_blank" rel="noopener">${esc(kredit.nama)}</a></p>
      <p class="footer__links">${(kredit.tautan || []).map((t) => `<a href="${esc(t.url)}"${/^https?:/.test(t.url) ? ' target="_blank" rel="noopener"' : ""}>${esc(t.label)}</a>`).join('\n        <span aria-hidden="true">·</span>\n        ')}</p>
    </footer>` : ""}
  </main>

  ${c.musik ? `<audio id="music" src="assets/musik.mp3" loop preload="none"></audio>
  <button id="musicBtn" class="music-btn" type="button" aria-label="Putar atau jeda musik" hidden>${IKON.musik}</button>` : ""}

  <div id="lightbox" class="lightbox" hidden>
    <button class="lightbox__close" type="button" aria-label="Tutup">&times;</button>
    <button class="lightbox__nav lightbox__prev" type="button" aria-label="Sebelumnya">&#8249;</button>
    <img alt="">
    <button class="lightbox__nav lightbox__next" type="button" aria-label="Berikutnya">&#8250;</button>
  </div>

  <script src="assets/script.js"></script>
</body>
</html>
`;
}

// Build undangan: node build.mjs
// Membaca undangan.config.mjs + konten/, menghasilkan situs statis di dist/.
// Tanpa dependensi — cukup Node 18+.

import { readFile, writeFile, mkdir, rm, cp, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderHalaman } from "./tema/halaman.mjs";
import { renderBuatLink } from "./tema/buat-link.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const config = (await import(pathToFileURL(join(ROOT, "undangan.config.mjs")).href)).default;

// ---- Validasi sederhana: lebih baik gagal saat build daripada rusak di HP tamu ----
const errors = [];
const need = (cond, msg) => { if (!cond) errors.push(msg); };
need(config.url && /^https:\/\//.test(config.url), "url wajib diisi dan diawali https://");
need(config.mempelai?.wanita?.panggilan && config.mempelai?.pria?.panggilan, "mempelai.wanita/pria.panggilan wajib diisi");
need(Array.isArray(config.acara) && config.acara.length > 0, "acara minimal satu");
for (const [i, a] of (config.acara || []).entries()) {
  need(!isNaN(new Date(a.mulai)), `acara[${i}].mulai bukan tanggal yang valid (contoh: "2026-12-06T08:00:00+08:00")`);
}
const fotoDipakai = new Set([
  config.sampul?.foto, config.hero?.foto, config.hitungMundur?.foto, config.penutup?.foto,
  config.panelSamping?.foto, config.mempelai?.wanita?.foto, config.mempelai?.pria?.foto,
  ...(config.galeri || []).map((g) => g.foto),
].filter(Boolean));
const exists = (p) => access(p).then(() => true, () => false);
for (const f of fotoDipakai) need(await exists(join(ROOT, "konten/foto", f)), `foto tidak ditemukan: konten/foto/${f}`);
if (config.musik) need(await exists(join(ROOT, "konten", config.musik)), `musik tidak ditemukan: konten/${config.musik}`);
if (errors.length) {
  console.error("✗ Build gagal:\n  - " + errors.join("\n  - "));
  process.exit(1);
}

// ---- Ukuran foto sampul untuk pratinjau tautan (og:image:width/height) ----
function ukuranJpeg(buf) {
  // Cari penanda SOF (0xFFC0–0xFFCF kecuali C4/C8/CC) yang memuat tinggi & lebar.
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) {
      return { tinggi: buf.readUInt16BE(i + 5), lebar: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}
if (config.sampul?.foto && /\.jpe?g$/i.test(config.sampul.foto)) {
  config._ukuranSampul = ukuranJpeg(await readFile(join(ROOT, "konten/foto", config.sampul.foto)));
}

// ---- Tulis dist/ ----
await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, "assets/img"), { recursive: true });
await writeFile(join(DIST, "index.html"), renderHalaman(config));
await writeFile(join(DIST, "buat-link.html"), renderBuatLink(config));
for (const f of ["style.css", "script.js", "buat-link.js"]) await cp(join(ROOT, "tema", f), join(DIST, "assets", f));
for (const f of fotoDipakai) await cp(join(ROOT, "konten/foto", f), join(DIST, "assets/img", f));
if (config.musik) await cp(join(ROOT, "konten", config.musik), join(DIST, "assets/musik.mp3"));
// Catatan: sengaja TIDAK memakai robots.txt "Disallow" — itu bisa menghalangi pratinjau tautan WhatsApp.
// Agar tidak muncul di Google, halaman memakai <meta name="robots" content="noindex">.

console.log(`✓ Build selesai → dist/  (${config.url})`);

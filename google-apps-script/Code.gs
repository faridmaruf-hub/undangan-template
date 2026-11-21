/**
 * RSVP & Ucapan — Undangan Digital oleh Farid Ma'ruf
 *
 * Tempel seluruh isi file ini di Google Sheet: Extensions > Apps Script.
 * Lalu Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Sheet bernama "RSVP" beserta judul kolomnya dibuat otomatis saat pertama dipakai.
 *
 * Kolom "Tampilkan": hapus centang untuk menyembunyikan ucapan dari undangan.
 */

const SHEET_NAME = 'RSVP';
const HEADERS = ['Waktu', 'Nama', 'Kehadiran', 'Jumlah', 'Ucapan', 'Tampilkan'];
const KEHADIRAN = ['Hadir', 'Tidak Hadir', 'Masih Ragu'];
const MAX_UCAPAN_DITAMPILKAN = 200;

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(5, 420);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Mencegah "formula injection": teks yang diawali = + - @ tidak boleh dianggap rumus.
function clean_(v, max) {
  let s = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

/** Menerima kiriman form RSVP dari undangan. */
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json_({ ok: true }); // bot mengisi kolom jebakan — abaikan diam-diam

    const nama = clean_(data.nama, 80);
    const kehadiran = KEHADIRAN.indexOf(data.kehadiran) >= 0 ? data.kehadiran : '';
    const jumlah = Math.max(0, Math.min(10, parseInt(data.jumlah, 10) || 0));
    const ucapan = clean_(data.ucapan, 500);
    if (!nama || !kehadiran) return json_({ ok: false, error: 'Data tidak lengkap' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = getSheet_();
      sh.appendRow([new Date(), nama, kehadiran, kehadiran === 'Hadir' ? jumlah : 0, ucapan, true]);
      sh.getRange(sh.getLastRow(), 6).insertCheckboxes().check();
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'Terjadi kesalahan' });
  }
}

/** Mengirim daftar ucapan (yang dicentang "Tampilkan") ke undangan. */
function doGet() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return json_({ ok: true, items: [] });

  const rows = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  const items = rows
    .filter(r => r[5] === true && String(r[4]).trim() !== '')
    .map(r => ({
      waktu: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      nama: String(r[1]),
      kehadiran: String(r[2]),
      ucapan: String(r[4]).replace(/^'/, '')
    }))
    .reverse()
    .slice(0, MAX_UCAPAN_DITAMPILKAN);
  return json_({ ok: true, items: items });
}

/** Opsional: jalankan sekali dari editor untuk membuat sheet & memberi izin. */
function setup() {
  getSheet_();
}

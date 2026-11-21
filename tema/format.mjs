// Helper bersama untuk halaman dan alat buat-link.

export const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Nama hari/bulan dihitung dari tanggal, jadi tidak mungkin salah tulis (mis. hari tidak cocok dengan tanggal).
const fmt = (zona, opts) => new Intl.DateTimeFormat("id-ID", { timeZone: zona, ...opts });

export function infoTanggal(iso, zona) {
  const d = new Date(iso);
  return {
    hari: fmt(zona, { weekday: "long" }).format(d),          // "Jumat"
    tanggal: fmt(zona, { day: "2-digit" }).format(d),         // "04"
    tanggalPendek: fmt(zona, { day: "numeric" }).format(d),   // "4"
    bulan: fmt(zona, { month: "long" }).format(d),            // "Desember"
    tahun: fmt(zona, { year: "numeric" }).format(d),          // "2026"
    jam: fmt(zona, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d).replace(":", "."), // "08.00"
  };
}

// "Minggu, 6 Desember 2026"
export function tanggalLengkap(iso, zona) {
  const t = infoTanggal(iso, zona);
  return `${t.hari}, ${t.tanggalPendek} ${t.bulan} ${t.tahun}`;
}

// "Pukul 08.00 WITA sampai selesai" atau "Pukul 08.00–11.00 WITA"
export function teksWaktu(acara, zona, labelZona) {
  const mulai = infoTanggal(acara.mulai, zona).jam;
  if (acara.selesai && acara.tampilkanJamSelesai) {
    return `Pukul ${mulai}–${infoTanggal(acara.selesai, zona).jam} ${labelZona}`;
  }
  return `Pukul ${mulai} ${labelZona} sampai selesai`;
}

// Acara yang hanya diberitahukan (informasi: true), mis. akad nikah terbatas: tamu tidak diundang hadir.
export const acaraUndangan = (c) => c.acara.filter((a) => !a.informasi);
export const acaraInformasi = (c) => c.acara.filter((a) => a.informasi);

// "Akad nikah kami dilangsungkan pada Sabtu, 12 Juni 2027, di KUA Kecamatan Contoh, Kota Contoh."
// Dapat diganti utuh lewat acara[].teksInformasi. tebal(s) membungkus bagian penting (<strong> di halaman, *…* di WhatsApp).
export function kalimatInformasi(a, zona, tebal = (s) => s) {
  if (a.teksInformasi) return a.teksInformasi;
  const nama = a.nama.charAt(0).toUpperCase() + a.nama.slice(1).toLowerCase();
  const tempat = [a.tempat, ...(a.alamat || [])].join(", ");
  return `${nama} kami dilangsungkan pada ${tebal(tanggalLengkap(a.mulai, zona))}, di ${tebal(tempat)}.`;
}

// "000011112222" → "0000 1111 2222" (mudah dibaca; yang disalin tetap angka tanpa spasi)
export const nomorRapi = (n) => String(n).replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");

const utc = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function tautanKalender(acara, judul, durasiJamBawaan = 4) {
  const mulai = new Date(acara.mulai);
  const selesai = acara.selesai ? new Date(acara.selesai) : new Date(mulai.getTime() + durasiJamBawaan * 3600e3);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${acara.nama} ${judul}`,
    dates: `${utc(mulai)}/${utc(selesai)}`,
    location: [acara.tempat, ...(acara.alamat || [])].join(", "),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

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

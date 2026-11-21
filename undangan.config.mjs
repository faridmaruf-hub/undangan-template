// Isi undangan. Ini DATA CONTOH — ganti seluruhnya untuk klien sungguhan.
// Setelah diubah: node build.mjs  → hasil di dist/
// Hari dan nama bulan dihitung otomatis dari tanggal; cukup isi tanggal & jam dengan benar.
// Sebelum dikirim ke klien, periksa semua teks dengan PEDOMAN-BAHASA.md.

export default {
  slug: "demo",                                   // dipakai untuk nama berkas & penyimpanan lokal
  url: "https://demo.mengundang.workers.dev",    // alamat final, tanpa garis miring di akhir
  zonaWaktu: "Asia/Jakarta",                     // Asia/Jakarta (WIB), Asia/Makassar (WITA), Asia/Jayapura (WIT)
  labelZonaWaktu: "WIB",
  kodeNegara: "62",                              // untuk nomor WhatsApp di alat buat-link

  mempelai: {
    urutan: "wanita-pria",                       // atau "pria-wanita"
    wanita: {
      panggilan: "Nadia",
      namaLengkap: "Nadia Putri Lestari",
      keterangan: "Putri kedua",
      ayah: "Bapak Ahmad Fauzi",
      ibu: "Ibu Sri Wahyuni",
      instagram: "",                             // tanpa @, kosongkan bila tidak ada
      foto: "mempelai-wanita.jpg",               // persegi, wajah di tengah
    },
    pria: {
      panggilan: "Raka",
      namaLengkap: "Raka Aditya Pratama",
      keterangan: "Putra pertama",
      ayah: "Bapak Budi Santoso",
      ibu: "Ibu Rina Marlina",
      instagram: "",
      foto: "mempelai-pria.jpg",
    },
  },

  sampul: { judul: "The Wedding of", foto: "sampul.jpg" },   // foto sampul juga dipakai untuk pratinjau WhatsApp
  panelSamping: { foto: "panel-samping.jpg" },               // hanya tampil di layar lebar
  hero: { foto: "hero.jpg" },
  hitungMundur: { foto: "hitung-mundur.jpg" },               // target: acara terakhir (atau isi target: "...")

  // Hapus seluruh blok ini (ayat: null) bila tidak memakai ayat/kutipan.
  ayat: {
    basmalah: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    arab: "وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗاِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ",
    terjemahan: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    sumber: "QS Ar-Rum: 21",
  },

  pembuka: {
    salam: "Assalamu’alaikum Warahmatullahi Wabarakatuh",
    teks: "Dengan memohon rahmat dan rida Allah Swt., kami bermaksud melangsungkan pernikahan:",
  },

  acara: [
    {
      nama: "Akad Nikah",
      mulai: "2027-06-12T08:00:00+07:00",
      selesai: "2027-06-12T10:00:00+07:00",      // untuk kalender; tulis jam selesai di halaman dengan tampilkanJamSelesai: true
      tempat: "Masjid Contoh",
      alamat: ["Jalan Melati No. 1", "Kota Contoh"],
      peta: "",                                  // tautan Google Maps (Bagikan → Salin link); kosong = tombol disembunyikan
    },
    {
      nama: "Resepsi",
      mulai: "2027-06-13T11:00:00+07:00",
      selesai: "2027-06-13T14:00:00+07:00",
      tampilkanJamSelesai: true,
      tempat: "Gedung Serbaguna Contoh",
      alamat: ["Jalan Kenanga No. 2", "Kota Contoh"],
      peta: "",
    },
  ],

  // bentuk: "tinggi" (2 baris) atau "lebar" (2 kolom). Pola rapi: tinggi+2 kotak, berulang; foto "lebar" di akhir.
  galeri: [
    { foto: "galeri-01.jpg", bentuk: "tinggi" },
    { foto: "galeri-02.jpg" },
    { foto: "galeri-03.jpg" },
    { foto: "galeri-04.jpg" },
    { foto: "galeri-05.jpg", bentuk: "tinggi" },
    { foto: "galeri-06.jpg" },
    { foto: "galeri-07.jpg", bentuk: "lebar" },
  ],

  // url: URL Web App Apps Script (lihat google-apps-script/PANDUAN.md),
  //      "demo" = contoh tanpa mengirim data, atau "" = bagian RSVP disembunyikan.
  rsvp: { url: "demo", maksTamu: 5 },

  penutup: {
    foto: "penutup.jpg",
    teks: "Kami akan merasa terhormat dan berbahagia apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    salam: "Wassalamu’alaikum Warahmatullahi Wabarakatuh",
    turutMengundang: "Keluarga Besar Kedua Mempelai",
    penanda: "Kami yang berbahagia",
    keterangan: "beserta keluarga besar",
  },

  musik: "musik.mp3",                            // di folder konten/; null = tanpa musik. Pastikan berlisensi.
                                                 // Demo: "Velvet Breath of the Saxophone" — Farid Ma'ruf

  pesanWhatsApp: {
    pembuka: "Dengan memohon rahmat dan rida Allah Swt., kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:",
    // penutup: "...",  // opsional; bawaan: "Kami akan merasa terhormat apabila ... memberikan doa restu."
  },

  kredit: {
    teks: "Undangan Digital oleh",
    nama: "Farid Ma'ruf",
    situs: "https://faridmaruf.com",
    tautan: [
      { label: "faridmaruf.com", url: "https://faridmaruf.com" },
      { label: "hello@faridmaruf.com", url: "mailto:hello@faridmaruf.com" },
      { label: "WhatsApp", url: "https://wa.me/33775799751" },
    ],
  },
};

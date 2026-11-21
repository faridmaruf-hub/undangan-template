(function () {
  "use strict";

  var CFG = JSON.parse(document.getElementById("buat-link-config").textContent);
  var KEY = "buat-link:" + CFG.slug;
  var daftar = document.getElementById("daftar");
  var templat = document.getElementById("templat");
  var hasil = document.getElementById("hasil");
  var ringkasan = document.getElementById("ringkasan");
  var unduhCsv = document.getElementById("unduhCsv");
  var baris = [];

  // Simpan di perangkat ini saja
  var simpanan = {};
  try { simpanan = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  daftar.value = simpanan.daftar || "";
  templat.value = simpanan.templat || CFG.templat;
  function simpan() {
    try { localStorage.setItem(KEY, JSON.stringify({ daftar: daftar.value, templat: templat.value })); } catch (e) {}
  }

  function tautanTamu(nama) {
    return CFG.url + "/?to=" + encodeURIComponent(nama).replace(/%20/g, "+");
  }

  // "0812-3456-7890" → "6281234567890"; "+62 812…" → "62812…"
  function nomorWa(teks) {
    var d = (teks || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.charAt(0) === "0") d = CFG.kodeNegara + d.slice(1);
    return d;
  }

  function salin(teks, tombol) {
    var selesai = function () {
      var asli = tombol.textContent;
      tombol.textContent = "Tersalin ✓";
      setTimeout(function () { tombol.textContent = asli; }, 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(teks).then(selesai);
    } else {
      var ta = document.createElement("textarea");
      ta.value = teks; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta); selesai();
    }
  }

  function tombol(label, kelas, aksi) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn " + kelas; b.textContent = label;
    b.addEventListener("click", function () { aksi(b); });
    return b;
  }

  function perbarui() {
    simpan();
    hasil.textContent = "";
    baris = daftar.value.split(/\r?\n/).map(function (l) {
      var i = l.lastIndexOf(",");
      var nama = l, nomor = "";
      // Bagian setelah koma terakhir dianggap nomor hanya bila isinya angka
      if (i > -1 && /^[\s+\d().-]{6,}$/.test(l.slice(i + 1))) { nama = l.slice(0, i); nomor = nomorWa(l.slice(i + 1)); }
      return { nama: nama.trim().replace(/\s+/g, " "), nomor: nomor };
    }).filter(function (r) { return r.nama; });

    baris.forEach(function (r) {
      r.tautan = tautanTamu(r.nama);
      r.pesan = templat.value.split("{nama}").join(r.nama).split("{tautan}").join(r.tautan);

      var li = document.createElement("li");
      li.className = "tool__item";
      var kepala = document.createElement("div");
      kepala.className = "tool__head";
      var nm = document.createElement("strong"); nm.textContent = r.nama;
      kepala.appendChild(nm);
      if (r.nomor) { var no = document.createElement("small"); no.textContent = "+" + r.nomor; kepala.appendChild(no); }
      var link = document.createElement("input");
      link.type = "text"; link.readOnly = true; link.value = r.tautan; link.className = "tool__link";
      link.addEventListener("focus", function () { link.select(); });
      var aksi = document.createElement("div");
      aksi.className = "tool__actions";
      aksi.appendChild(tombol("Salin Tautan", "btn--ghost", function (b) { salin(r.tautan, b); }));
      aksi.appendChild(tombol("Salin Pesan", "btn--ghost", function (b) { salin(r.pesan, b); }));
      aksi.appendChild(tombol(r.nomor ? "Kirim via WhatsApp" : "Bagikan via WhatsApp", "btn--dark", function () {
        window.open("https://wa.me/" + r.nomor + "?text=" + encodeURIComponent(r.pesan), "_blank", "noopener");
      }));
      li.appendChild(kepala); li.appendChild(link); li.appendChild(aksi);
      hasil.appendChild(li);
    });

    ringkasan.textContent = baris.length ? baris.length + " tamu" : "Belum ada nama tamu.";
    unduhCsv.disabled = !baris.length;
  }

  unduhCsv.addEventListener("click", function () {
    var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
    var csv = "Nama,Nomor WhatsApp,Tautan\n" + baris.map(function (r) {
      return [q(r.nama), q(r.nomor ? "+" + r.nomor : ""), q(r.tautan)].join(",");
    }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = "tautan-tamu-" + CFG.slug + ".csv";
    a.click();
  });

  document.getElementById("resetTemplat").addEventListener("click", function () {
    templat.value = CFG.templat; perbarui();
  });
  daftar.addEventListener("input", perbarui);
  templat.addEventListener("input", perbarui);
  perbarui();
})();

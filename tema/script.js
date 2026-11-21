(function () {
  "use strict";

  // Pengaturan dari build (undangan.config.mjs) — jangan diubah di sini.
  var CFG = JSON.parse(document.getElementById("undangan-config").textContent);

  // ---- Nama tamu dari URL: index.html?to=Bapak+Ahmad ----
  var params = new URLSearchParams(location.search);
  var guest = (params.get("to") || "").trim();
  if (guest) {
    document.getElementById("guestName").textContent = guest.slice(0, 80);
  }

  // ---- Musik latar (opsional: assets/musik.mp3) ----
  var music = document.getElementById("music");
  var musicBtn = document.getElementById("musicBtn");
  var wantPlay = false;
  function playMusic() {
    if (!music) return;
    wantPlay = true;
    music.preload = "auto";
    music.play().then(function () { musicBtn.hidden = false; })
      .catch(function () { musicBtn.hidden = false; /* diblokir browser: tamu bisa tekan tombol musik */ });
  }
  if (music) {
    music.volume = 0.7;
    music.addEventListener("play", function () { musicBtn.classList.add("is-playing"); });
    music.addEventListener("pause", function () { musicBtn.classList.remove("is-playing"); });
    music.addEventListener("error", function () { musicBtn.hidden = true; });
    musicBtn.addEventListener("click", function () {
      if (music.paused) playMusic(); else { wantPlay = false; music.pause(); }
    });
    // Jeda saat tab/aplikasi ditinggalkan, lanjut saat kembali
    document.addEventListener("visibilitychange", function () {
      if (!wantPlay) return;
      if (document.hidden) music.pause(); else music.play().catch(function () {});
    });
  }

  // ---- Buka undangan ----
  document.getElementById("openBtn").addEventListener("click", function () {
    document.getElementById("cover").classList.add("is-open");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    playMusic();
  });

  // ---- Animasi muncul saat scroll ----
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---- Hitung mundur ----
  var target = new Date(CFG.target).getTime();
  var cd = {};
  document.querySelectorAll("[data-cd]").forEach(function (el) { cd[el.dataset.cd] = el; });
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById("countdown").hidden = true;
      document.getElementById("countdownDone").hidden = false;
      return false;
    }
    var s = Math.floor(diff / 1000);
    cd.d.textContent = Math.floor(s / 86400);
    cd.h.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
    cd.m.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
    cd.s.textContent = String(s % 60).padStart(2, "0");
    return true;
  }
  if (tick()) { var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000); }

  // ---- RSVP & Ucapan (Google Sheets via Apps Script) ----
  // CFG.rsvpUrl: URL Web App, "demo" untuk portfolio (tidak mengirim apa pun), atau kosong (bagian disembunyikan).
  var RSVP_URL = CFG.rsvpUrl;
  var DEMO = RSVP_URL === "demo";
  var contohUcapan = [
    { waktu: new Date(Date.now() - 2 * 3600e3).toISOString(), nama: "Contoh Tamu", kehadiran: "Hadir", ucapan: "Selamat menempuh hidup baru. Semoga menjadi keluarga yang bahagia dan penuh berkah." },
    { waktu: new Date(Date.now() - 26 * 3600e3).toISOString(), nama: "Tamu Kedua", kehadiran: "Masih Ragu", ucapan: "Barakallahu lakuma wa baraka alaikuma." }
  ];

  var rsvpSection = document.getElementById("rsvp");
  if (RSVP_URL) {
    rsvpSection.hidden = false;
    var form = document.getElementById("rsvpForm");
    var statusEl = form.querySelector(".rsvp__status");
    var submitBtn = form.querySelector(".rsvp__submit");
    var jumlahField = document.getElementById("jumlahField");
    var wishList = document.getElementById("wishList");
    var wishCount = document.getElementById("wishCount");

    if (guest) form.nama.value = guest.slice(0, 80);

    form.addEventListener("change", function (e) {
      if (e.target.name === "kehadiran") jumlahField.hidden = e.target.value !== "Hadir";
    });

    var timeAgo = function (iso) {
      var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
      if (s < 60) return "baru saja";
      if (s < 3600) return Math.floor(s / 60) + " menit lalu";
      if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
      if (s < 2592000) return Math.floor(s / 86400) + " hari lalu";
      return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };

    var renderWishes = function (items) {
      wishList.textContent = "";
      wishCount.textContent = items.length ? "(" + items.length + ")" : "";
      if (!items.length) {
        var empty = document.createElement("li");
        empty.className = "wishes__empty";
        empty.textContent = "Belum ada ucapan. Jadilah yang pertama!";
        wishList.appendChild(empty);
        return;
      }
      items.forEach(function (w) {
        var li = document.createElement("li");
        var head = document.createElement("div"); head.className = "wish__head";
        var name = document.createElement("strong"); name.textContent = w.nama;
        var badge = document.createElement("span"); badge.className = "wish__badge"; badge.textContent = w.kehadiran;
        head.appendChild(name); head.appendChild(badge);
        var text = document.createElement("p"); text.textContent = w.ucapan;
        var time = document.createElement("small"); time.textContent = timeAgo(w.waktu);
        li.appendChild(head); li.appendChild(text); li.appendChild(time);
        wishList.appendChild(li);
      });
    };

    var loadWishes = function () {
      if (DEMO) { renderWishes(contohUcapan); return; }
      fetch(RSVP_URL)
        .then(function (r) { return r.json(); })
        .then(function (d) { renderWishes(d.ok ? d.items : []); })
        .catch(function () { wishList.innerHTML = '<li class="wishes__empty">Ucapan belum dapat dimuat.</li>'; });
    };
    loadWishes();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        nama: form.nama.value.trim(),
        kehadiran: (form.querySelector("input[name=kehadiran]:checked") || {}).value || "",
        jumlah: form.jumlah.value,
        ucapan: form.ucapan.value.trim(),
        website: form.website.value
      };
      if (!data.nama) { statusEl.textContent = "Mohon isi nama Anda."; form.nama.focus(); return; }
      if (!data.kehadiran) { statusEl.textContent = "Mohon pilih konfirmasi kehadiran."; return; }
      if (data.kehadiran !== "Hadir") data.jumlah = "0";

      submitBtn.disabled = true;
      statusEl.textContent = "Mengirim…";
      if (DEMO) {
        setTimeout(function () {
          if (data.ucapan) contohUcapan.unshift({ waktu: new Date().toISOString(), nama: data.nama, kehadiran: data.kehadiran, ucapan: data.ucapan });
          statusEl.textContent = "Terima kasih! (Mode demo: data tidak dikirim ke mana pun.)";
          form.ucapan.value = ""; renderWishes(contohUcapan); submitBtn.disabled = false;
        }, 600);
        return;
      }
      // text/plain agar tidak memicu preflight CORS di Apps Script
      fetch(RSVP_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d.ok) throw new Error(d.error || "gagal");
          statusEl.textContent = "Terima kasih, konfirmasi Anda sudah kami terima. 🤍";
          form.ucapan.value = "";
          loadWishes();
        })
        .catch(function () { statusEl.textContent = "Maaf, gagal mengirim. Silakan coba lagi."; })
        .then(function () { submitBtn.disabled = false; });
    });
  }

  // ---- Lightbox galeri ----
  var imgs = Array.prototype.slice.call(document.querySelectorAll("#gallery img"));
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var idx = 0;
  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[idx].src;
    lbImg.alt = imgs[idx].alt;
  }
  function close() { lb.hidden = true; document.body.style.overflow = ""; }
  imgs.forEach(function (img, i) {
    img.addEventListener("click", function () { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; });
  });
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector(".lightbox__next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  var startX = null;
  lb.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
    startX = null;
  });
})();

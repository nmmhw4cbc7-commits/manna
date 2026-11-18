/* Café Manna: kleine Helfer. Die Seite funktioniert auch ohne JavaScript. */
(function () {
  "use strict";
  var body = document.body;

  /* Header beim Scrollen */
  var onScroll = function () { body.classList.toggle("is-scrolled", window.scrollY > 24); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menü auf dem Handy */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-nav");
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Schließen" : "Menü";
      menu.hidden = !open;
      body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", function () { setOpen(menu.hidden); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1001px)").addEventListener("change", function (m) { if (m.matches) setOpen(false); });
  }

  /* Sanftes Einblenden beim Scrollen */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Öffnungszeiten: Freitag und Samstag, 18 bis 23 Uhr (Europe/Berlin).
     Zum Ändern nur HOURS anpassen (0 = Sonntag bis 6 = Samstag). */
  var HOURS = { 5: [18, 23], 6: [18, 23] };

  function berlinNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var m = {};
    parts.forEach(function (p) { m[p.type] = p.value; });
    return {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(m.weekday),
      minutes: (parseInt(m.hour, 10) % 24) * 60 + parseInt(m.minute, 10)
    };
  }

  function statusText() {
    var now = berlinNow();
    var t = HOURS[now.day];
    if (t && now.minutes >= t[0] * 60 && now.minutes < t[1] * 60) return "Jetzt geöffnet bis " + t[1] + " Uhr";
    if (t && now.minutes < t[0] * 60) return "Heute ab " + t[0] + " Uhr geöffnet";
    return "";
  }

  var text = statusText();
  document.querySelectorAll("[data-status]").forEach(function (el) {
    if (text) { el.textContent = text; el.hidden = false; }
  });

  var today = berlinNow().day;
  document.querySelectorAll("[data-day]").forEach(function (row) {
    if (parseInt(row.getAttribute("data-day"), 10) === today) row.classList.add("is-today");
  });

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  /* Reservierungsformular (iframe von cafemanna-ev.de): Höhe anpassen und
     melden, welcher Teil gerade sichtbar ist (für Hinweise und Dialoge). */
  var resFrame = document.querySelector("iframe[data-reservation]");
  if (resFrame && window.postMessage) {
    var resOrigin = new URL(resFrame.src, location.href).origin;
    var header = document.querySelector(".site-header");
    var pending = false;
    var sendViewport = function () {
      pending = false;
      if (!resFrame.contentWindow) return;
      var r = resFrame.getBoundingClientRect();
      var headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      var top = Math.max(0, headerBottom - r.top);
      var bottom = Math.min(r.height, window.innerHeight - r.top);
      if (bottom <= top) return;
      resFrame.contentWindow.postMessage({ type: "manna-res:viewport", top: top, bottom: bottom }, resOrigin);
    };
    /* Lädt das Formular nicht, stattdessen den Link zur Online-Reservierung zeigen */
    var resReady = false;
    setTimeout(function () {
      if (resReady) return;
      var wrap = resFrame.parentNode;
      wrap.hidden = true;
      var fb = document.querySelector(".res-fallback");
      if (fb) fb.innerHTML = '<a class="btn btn-solid" href="https://www.cafemanna-ev.de" rel="noopener">Online reservieren</a>';
    }, 12000);
    var queue = function () { if (!pending) { pending = true; requestAnimationFrame(sendViewport); } };
    window.addEventListener("message", function (e) {
      if (e.origin !== resOrigin || e.source !== resFrame.contentWindow || !e.data) return;
      resReady = true;
      if (e.data.type === "manna-res:height") {
        var h = parseInt(e.data.height, 10);
        if (h > 0 && h < 10000) resFrame.style.height = h + "px";
        queue();
      } else if (e.data.type === "manna-res:ready") {
        queue();
      }
    });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
  }
})();

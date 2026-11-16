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
  var DAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

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
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) return "Wieder geöffnet " + (i === 1 ? "morgen" : "am " + DAYS[d]) + " ab " + HOURS[d][0] + " Uhr";
    }
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
})();

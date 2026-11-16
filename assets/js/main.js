/* Café Manna – kleine Helfer. Seite funktioniert auch ohne JavaScript. */
(function () {
  "use strict";

  /* ---------- Mobile Navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (m) { if (m.matches) setOpen(false); });
  }

  /* ---------- Öffnungszeiten ----------
     Regulär: Freitag & Samstag, 18–23 Uhr (Zeitzone Europe/Berlin).
     Zum Ändern nur dieses Objekt anpassen (0 = Sonntag … 6 = Samstag). */
  var HOURS = { 5: [18, 23], 6: [18, 23] };
  var DAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  function berlinNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
    return { day: day, minutes: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10) };
  }

  function status() {
    var now = berlinNow();
    var today = HOURS[now.day];
    if (today && now.minutes >= today[0] * 60 && now.minutes < today[1] * 60) {
      return { open: true, text: "Jetzt geöffnet", detail: "bis " + today[1] + " Uhr" };
    }
    if (today && now.minutes < today[0] * 60) {
      return { open: false, text: "Heute geöffnet", detail: "ab " + today[0] + " Uhr" };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        var label = i === 1 ? "morgen" : DAYS[d];
        return { open: false, text: "Geschlossen", detail: "wieder " + label + " ab " + HOURS[d][0] + " Uhr" };
      }
    }
    return null;
  }

  var s = status();
  document.querySelectorAll("[data-status]").forEach(function (el) {
    if (!s) return;
    el.hidden = false;
    el.setAttribute("data-open", String(s.open));
    el.querySelector("[data-status-text]").textContent = s.text;
    el.querySelector("[data-status-detail]").textContent = s.detail;
  });

  var now = berlinNow();
  document.querySelectorAll(".hours tr[data-day]").forEach(function (row) {
    if (parseInt(row.getAttribute("data-day"), 10) === now.day) row.classList.add("is-today");
  });

  /* Jahr im Footer */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

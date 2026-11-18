# Café Manna – Website

Statische Website (HTML/CSS/ein bisschen JS), keine Abhängigkeiten, keine Cookies, keine externen Fonts.

## Arbeiten an der Seite

- Inhalte bearbeiten: `src/pages/*.html`
- Header, Navigation, Footer (für alle Seiten): `src/layout.html`
- Design: `assets/css/style.css` (Farben ganz oben als Variablen, Hell + Dunkel)
- Öffnungszeiten für den „Jetzt geöffnet“-Hinweis: `assets/js/main.js` → `HOURS`
- Danach bauen: `python3 build.py` → erzeugt die `.html`-Dateien im Hauptordner
- Ansehen: `index.html` im Browser öffnen

**Wichtig:** Die `.html`-Dateien im Hauptordner werden überschrieben – immer in `src/` ändern.

## Seiten

| Datei | Inhalt |
|---|---|
| index.html | Was ist Café Manna – auf einen Blick |
| besuch.html | Öffnungszeiten, Adresse, Route, FAQ |
| essen.html | Angebot, Spendenprinzip |
| abende.html | Musik-, Info-, Themenabende |
| ueber-uns.html | Verein, Hilfswerk, Name, Geschichte |
| reservieren.html | Reservierungsformular direkt eingebettet (iframe von cafemanna-ev.de/embed, Repo manna-res) + Telefon / WhatsApp |
| impressum.html, datenschutz.html | Rechtliches |

## Quellen der Inhalte (Stand Recherche: 16.11.2026)

- cdh-stephanus.org/cafe-manna/ (Nov. 2024) – Zeiten, Spende, 80 Plätze, Abende
- stephanus-zeitschrift.de/cafe-manna/ (Ausgabe 2/2024) – Umbau Sommer 2023, Name, Patenkinder, Schwegenheim
- cdh-stephanus.org/geschichte/ – 2008 Konferenzraum, 2021 Testzentrum, Sept. 2023 Eröffnung
- cafemanna-ev.de (+ Impressum/Datenschutz) – Online-Reservierung, Verein VR 61483, Vorstand
- linktr.ee/cafemanna, t.me/cafemanna – Instagram @cafemanna.ev, WhatsApp, Telegram
- Fotos & Logo: von cdh-stephanus.org, stephanus-zeitschrift.de, cafemanna-ev.de – **Nutzungsrechte bitte bestätigen**

## Offene Fragen (bitte klären)

1. Öffnungszeiten 2026 noch aktuell? (alle Quellen von 2024/2025)
2. Echte Speisekarte / typische Gerichte, vegetarisch/vegan, Allergene?
3. Parken, Eingang, barrierefrei (Stufen/Aufzug/WC)?
4. Kartenzahlung / PayPal vor Ort möglich?
5. Wie oft sind Infoabende? (Quellen: „am Wochenende abwechselnd“ vs. „etwa monatlich“)
6. Impressum: alter Platzhalter „HRB 12345 / Amtsgericht Musterstadt“ auf cafemanna-ev.de entfernen; welche E-Mail gilt – `verwaltung@` oder `info@`?
7. Wer ist redaktionell verantwortlich für die neue Seite? Wo wird gehostet?
8. Bessere/mehr Fotos (Theke, Außenansicht/Eingang, Essen, Abende)?

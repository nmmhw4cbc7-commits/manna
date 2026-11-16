#!/usr/bin/env python3
"""Baut die Website: src/pages/*.html + src/layout.html -> *.html im Projektordner.

Aufruf:  python3 build.py

Jede Seite in src/pages/ beginnt mit einem Kopf-Block:
<!--
title: Seitentitel
description: Kurzbeschreibung für Suchmaschinen
nav: besuch          (Schlüssel aus NAV unten, oder leer)
body: has-hero       (optional, CSS-Klasse für <body>)
-->
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"

# Navigation: links vom Logo, rechts vom Logo, und alles fürs Handy-Menü
NAV_LEFT = [
    ("besuch", "besuch.html", "Besuch"),
    ("essen", "essen.html", "Essen & Trinken"),
    ("abende", "abende.html", "Abende"),
]
NAV_RIGHT = [
    ("ueber-uns", "ueber-uns.html", "Über uns"),
]
NAV_MOBILE = [("start", "index.html", "Start")] + NAV_LEFT + NAV_RIGHT

HEAD_RE = re.compile(r"^\s*<!--(.*?)-->\s*", re.S)


def parse(text):
    m = HEAD_RE.match(text)
    meta = {}
    if m:
        for line in m.group(1).strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        text = text[m.end():]
    return meta, text


def nav_html(items, active, indent="          "):
    out = []
    for key, href, label in items:
        cur = ' aria-current="page"' if key == active else ""
        out.append(f'<li><a href="{href}"{cur}>{label.replace("&", "&amp;")}</a></li>')
    return ("\n" + indent).join(out)


def main():
    layout = (SRC / "layout.html").read_text(encoding="utf-8")
    pages = sorted((SRC / "pages").glob("*.html"))
    for page in pages:
        meta, body = parse(page.read_text(encoding="utf-8"))
        active = meta.get("nav", "")
        html = (
            layout.replace("{{title}}", meta.get("title", "Café Manna"))
            .replace("{{description}}", meta.get("description", ""))
            .replace("{{nav_left}}", nav_html(NAV_LEFT, active))
            .replace("{{nav_right}}", nav_html(NAV_RIGHT, active))
            .replace("{{nav_mobile}}", nav_html(NAV_MOBILE, active, "      "))
            .replace("{{cta_current}}", ' aria-current="page"' if active == "reservieren" else "")
            .replace("{{body_class}}", meta.get("body", ""))
            .replace("{{content}}", body.rstrip())
        )
        (ROOT / page.name).write_text(html, encoding="utf-8")
        print(f"  ✓ {page.name}")
    print(f"{len(pages)} Seiten gebaut.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Baut die Website: src/pages/*.html + src/layout.html -> *.html im Projektordner.

Aufruf:  python3 build.py

Jede Seite in src/pages/ beginnt mit einem Kopf-Block:
<!--
title: Seitentitel
description: Kurzbeschreibung für Suchmaschinen
nav: besuch          (Schlüssel aus NAV unten, oder leer)
-->
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"

# Reihenfolge = Reihenfolge im Menü
NAV = [
    ("start", "index.html", "Start"),
    ("besuch", "besuch.html", "Besuch"),
    ("essen", "essen.html", "Essen & Trinken"),
    ("abende", "abende.html", "Abende"),
    ("ueber-uns", "ueber-uns.html", "Über uns"),
]

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


def nav_html(active):
    items = []
    for key, href, label in NAV:
        cur = ' aria-current="page"' if key == active else ""
        items.append(f'<li><a href="{href}"{cur}>{label.replace("&", "&amp;")}</a></li>')
    return "\n          ".join(items)


def main():
    layout = (SRC / "layout.html").read_text(encoding="utf-8")
    pages = sorted((SRC / "pages").glob("*.html"))
    for page in pages:
        meta, body = parse(page.read_text(encoding="utf-8"))
        active = meta.get("nav", "")
        html = (
            layout.replace("{{title}}", meta.get("title", "Café Manna"))
            .replace("{{description}}", meta.get("description", ""))
            .replace("{{nav}}", nav_html(active))
            .replace("{{cta_current}}", ' aria-current="page"' if active == "reservieren" else "")
            .replace("{{content}}", body.rstrip())
        )
        (ROOT / page.name).write_text(html, encoding="utf-8")
        print(f"  ✓ {page.name}")
    print(f"{len(pages)} Seiten gebaut.")


if __name__ == "__main__":
    main()

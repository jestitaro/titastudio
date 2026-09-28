#!/usr/bin/env python3
"""Chequeos automáticos antes de exportar.

1. Sin reloj real: el JS no usa setInterval/setTimeout/requestAnimationFrame/Date.now/performance.now.
2. Loop sin salto: seek(0) y seek(4000) producen exactamente el mismo cuadro, en cada escena.
3. Determinismo: el mismo seek(ms) renderizado dos veces (con un salto en el medio) da el mismo cuadro.
4. Sin errores de consola al cargar cada escena.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

from export import ROOT, SCENES, serve

FORBIDDEN = re.compile(r"\b(setInterval|setTimeout|requestAnimationFrame|Date\.now|performance\.now)\b")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--chromium", default=None)
    args = ap.parse_args()
    ok = True

    for f in sorted((ROOT / "js").glob("*.js")):
        hits = FORBIDDEN.findall(f.read_text(encoding="utf-8"))
        print(f"[reloj] {f.name}: {'OK' if not hits else 'usa ' + ', '.join(sorted(set(hits)))}")
        ok &= not hits

    server, port = serve(ROOT)
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=args.chromium) if args.chromium else pw.chromium.launch()
            page = browser.new_page(viewport={"width": 1080, "height": 1080})
            errors: list[str] = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            for scene in SCENES:
                errors.clear()
                page.goto(f"http://127.0.0.1:{port}/render.html?escena={scene}")
                page.wait_for_function("window.ready === true")
                n = page.evaluate("document.getAnimations().length")

                page.evaluate("window.seek(0)")
                a = page.screenshot()
                page.evaluate("window.seek(4000)")
                b = page.screenshot()
                loop_ok = a == b

                page.evaluate("window.seek(1733.3)")
                c = page.screenshot()
                page.evaluate("window.seek(3100)")
                page.evaluate("window.seek(1733.3)")
                d = page.screenshot()
                det_ok = c == d

                moves = page.evaluate("window.seek(1000)") or page.screenshot() != a
                print(
                    f"[{scene}] animaciones={n} · loop 0↔4000 {'OK' if loop_ok else 'DIFIERE'}"
                    f" · determinismo {'OK' if det_ok else 'DIFIERE'} · movimiento {'OK' if moves else 'QUIETO'}"
                    f" · consola {'OK' if not errors else errors}"
                )
                ok &= loop_ok and det_ok and bool(moves) and not errors
            browser.close()
    finally:
        server.shutdown()

    print("\nTodo OK" if ok else "\nHay chequeos que fallaron")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

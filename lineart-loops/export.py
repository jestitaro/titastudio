#!/usr/bin/env python3
"""Exporta los loops line-art cuadro a cuadro con Playwright (Chromium headless) + ffmpeg.

Cada escena se controla por tiempo con window.seek(ms): nada depende del reloj real,
así que el render es determinista. El loop dura 4 s = 120 cuadros a 30 fps y el último
cuadro exportado es t = 3966,7 ms (no repite el cuadro 0), por eso el mp4 cierra sin salto.

Uso:
    python export.py                       # las 3 escenas, 1080×1080
    python export.py --escena celular      # una sola
    python export.py --wide                # 1920×1080
    python export.py --intro               # suma el draw-on inicial (1,5 s) antes del loop
    python export.py --alpha               # además .mov ProRes 4444 y .webm VP9 con alpha
    python export.py --alpha --mask-bg     # máscaras con el color de fondo en lugar de blanco
"""

from __future__ import annotations

import argparse
import functools
import http.server
import shutil
import subprocess
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
SCENES = ["celular", "laptop", "llamada"]
FPS = 30
LOOP_MS = 4000
INTRO_MS = 1500


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args) -> None:  # noqa: D401 - silencia el log por request
        pass


def serve(directory: Path) -> tuple[http.server.ThreadingHTTPServer, int]:
    handler = functools.partial(QuietHandler, directory=str(directory))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, server.server_address[1]


def run(cmd: list[str]) -> None:
    print("  $", " ".join(cmd))
    subprocess.run(cmd, check=True)


def render_frames(page, url: str, out: Path, total_ms: int, alpha: bool) -> int:
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.png"):
        old.unlink()
    page.goto(url)
    page.wait_for_function("window.ready === true")
    frames = round(total_ms * FPS / 1000)
    for i in range(frames):
        page.evaluate(f"window.seek({i * 1000 / FPS})")
        page.screenshot(path=str(out / f"{i + 1:04d}.png"), omit_background=alpha)
    return frames


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--escena", choices=SCENES, action="append", help="escena a exportar (repetible)")
    ap.add_argument("--wide", action="store_true", help="1920×1080 en lugar de 1080×1080")
    ap.add_argument("--intro", action="store_true", help="incluir el draw-on inicial antes del loop")
    ap.add_argument("--alpha", action="store_true", help="exportar también con fondo transparente")
    ap.add_argument("--mask-bg", action="store_true", help="pintar las máscaras con el color de fondo")
    ap.add_argument("--scale", type=float, default=2, help="deviceScaleFactor (por defecto 2)")
    ap.add_argument("--ffmpeg", default=shutil.which("ffmpeg") or "ffmpeg", help="ruta a ffmpeg")
    ap.add_argument("--chromium", default=None, help="ruta a un Chromium propio (opcional)")
    ap.add_argument("--out", default=str(ROOT / "out"), help="carpeta de salida")
    args = ap.parse_args()

    scenes = args.escena or SCENES
    w, h = (1920, 1080) if args.wide else (1080, 1080)
    size_tag = f"{w}x{h}"
    out_dir = Path(args.out)
    total_ms = LOOP_MS + (INTRO_MS if args.intro else 0)

    if args.alpha and not args.mask_bg:
        print(
            "Aviso: en modo --alpha las máscaras blancas detrás de cada forma se van a ver sobre el fondo transparente.\n"
            "       Si preferís que tomen el color de fondo, volvé a correr con --mask-bg."
        )

    server, port = serve(ROOT)
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=args.chromium) if args.chromium else pw.chromium.launch()
            page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=args.scale)
            passes = [False, True] if args.alpha else [False]
            for scene in scenes:
                for alpha in passes:
                    q = f"escena={scene}"
                    q += "&intro=1" if args.intro else ""
                    q += "&alpha=1" if alpha else ""
                    q += "&maskbg=1" if args.mask_bg else ""
                    tag = f"{scene}_{size_tag}" + ("_intro" if args.intro else "") + ("_alpha" if alpha else "")
                    frames_dir = out_dir / "frames" / tag
                    print(f"→ {tag}")
                    n = render_frames(page, f"http://127.0.0.1:{port}/render.html?{q}", frames_dir, total_ms, alpha)
                    pattern = str(frames_dir / "%04d.png")
                    if not alpha:
                        run([args.ffmpeg, "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", pattern,
                             "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart",
                             str(out_dir / f"{tag}.mp4")])
                    else:
                        run([args.ffmpeg, "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", pattern,
                             "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le",
                             str(out_dir / f"{tag}.mov")])
                        run([args.ffmpeg, "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", pattern,
                             "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "24",
                             str(out_dir / f"{tag}.webm")])
                    print(f"  {n} cuadros")
            browser.close()
    finally:
        server.shutdown()
    return 0


if __name__ == "__main__":
    sys.exit(main())

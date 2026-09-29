"""Genera la locución (una pista por frase) y el manifest de duraciones.

Requiere acceso de red a speech.platform.bing.com (edge-tts). Uso:
  python3 scripts/vo.py [voz]          # por defecto es-AR-ElenaNeural (también es-AR-TomasNeural)
Las frases salen de src/video/vo.ts. Si ya tenés los audios grabados, copialos como
public/audio/vo/01.mp3 … 11.mp3 y corré `python3 scripts/vo.py --manifest` para medir duraciones.
"""
import asyncio, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/audio/vo")
MANIFEST = os.path.join(ROOT, "src/video/vo-manifest.json")
os.makedirs(OUT, exist_ok=True)

src = open(os.path.join(ROOT, "src/video/vo.ts"), encoding="utf8").read()
LINES = re.findall(r'id: "(\d+)".*?text: "(.*?)" }', src)

def duration(path):
    r = subprocess.run(["npx", "remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], cwd=ROOT, capture_output=True, text=True)
    return float(r.stdout.strip())

async def synth(voice):
    import certifi
    if os.path.exists("/root/.ccr/ca-bundle.crt"):
        certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
    import edge_tts
    for i, text in LINES:
        await edge_tts.Communicate(text, voice, rate="-4%").save(os.path.join(OUT, f"{i}.mp3"))
        print("ok", i)

if "--manifest" not in sys.argv:
    asyncio.run(synth(sys.argv[1] if len(sys.argv) > 1 else "es-AR-ElenaNeural"))
m = {i: round(duration(os.path.join(OUT, f"{i}.mp3")), 3) for i, _ in LINES if os.path.exists(os.path.join(OUT, f"{i}.mp3"))}
json.dump(m, open(MANIFEST, "w"), indent=2)
print("manifest", m)

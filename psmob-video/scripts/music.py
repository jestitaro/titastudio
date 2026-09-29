"""Música original para el video (sintetizada, sin samples de terceros).

Estructura sincronizada con timing.ts (30 fps):
  0 – 20,5 s  problema: arpegio suave en La menor, tic-tac creciente, caída con swoosh, escritorio más oscuro
  20,5 s      whoosh + acorde brillante (entra la solución)
  20,5 – 77 s solución: Do mayor (C–G–Am–F), pad + arpegio + beat liviano; más cuerpo desde la góndola
  77 s – fin  cierre: acorde resuelto con brillo y fade out
Uso: python3 scripts/music.py <salida.wav> <segundos_totales> <inicio_s06_s> <inicio_s12_s> <inicio_s14_s>
"""
import sys
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
out, TOTAL, T_SOL, T_BUILD, T_END = sys.argv[1], *map(float, sys.argv[2:6])
N = int(TOTAL * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
BPM = 96.0
BEAT = 60 / BPM

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, t0, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))

def env(n, a, d):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e

def pluck(m, dur=1.2, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = sum((0.6 ** k) * bright ** k * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (3 + 2.5 * k)) for k in range(5))
    return s * env(n, 0.004, 0.9)

def pad(ms, dur, att=0.8):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for m in ms:
        for det in (-0.08, 0.0, 0.08):
            f = hz(m + det)
            s += np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)
    e = np.minimum(1, t / att) * np.minimum(1, (dur - t) / 0.6)
    return s * e / (len(ms) * 3)

def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 75 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)

def noise_hit(dur, decay, hp):
    n = int(dur * SR)
    x = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / decay)
    return sosfilt(butter(2, hp, "hp", fs=SR, output="sos"), x)

def swoosh(dur, up=True):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = sosfilt(butter(2, [800, 6000], "bp", fs=SR, output="sos"), x)
    e = (t / dur) ** 2 if up else (1 - t / dur) ** 2
    return x * e * 0.5

# ——— Problema (La menor): Am – F – C – G, arpegio suave y tic-tac ———
prob = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]
bar = 4 * BEAT
t = 0.0; k = 0
T_FALL = 9.7
while t < T_SOL - 0.2:
    root, ch = prob[k % 4]
    dark = t > T_FALL + 1.5
    add(pad([m + 12 for m in ch], bar + 0.4, 1.2), t, 0, 0.10 if not dark else 0.08)
    if not dark:
        for i in range(8):
            m = ch[i % 3] + 12 + (12 if i % 4 == 3 else 0)
            add(pluck(m, 1.0, 0.8), t + i * BEAT / 2, (-0.3 if i % 2 else 0.3), 0.08)
    else:
        for i in (0, 3, 6):
            add(pluck(ch[i % 3] + 12, 1.4, 0.6), t + i * BEAT / 2, 0.2, 0.06)
    add(pluck(root - 12, 2.0, 0.5), t, 0, 0.12)
    t += bar; k += 1
# Tic-tac (reloj) creciente en el problema
tt = 1.0
while tt < T_SOL - 0.3:
    g = 0.02 + 0.05 * min(1, tt / T_SOL)
    add(noise_hit(0.05, 0.01, 5000), tt, 0.4 if int(tt / BEAT) % 2 else -0.4, g)
    tt += BEAT
# Caída
add(swoosh(0.9, False), T_FALL, 0, 0.5)
add(kick() * 0.8, T_FALL + 1.0, 0, 0.5)

# ——— Solución (Do mayor): C – G – Am – F ———
add(swoosh(1.2, True), T_SOL - 1.2, 0, 0.6)
sol = [(48, [60, 64, 67, 71]), (43, [59, 62, 67, 74]), (45, [60, 64, 69, 72]), (41, [60, 65, 69, 72])]
t = T_SOL; k = 0
while t < T_END - 0.1:
    root, ch = sol[k % 4]
    build = t >= T_BUILD
    add(pad(ch, bar + 0.4, 0.5), t, 0, 0.11)
    for i in range(8):
        m = ch[[0, 1, 2, 3, 2, 1, 2, 3][i]] + 12
        add(pluck(m, 0.9, 1.0), t + i * BEAT / 2, (-0.35 if i % 2 else 0.35), 0.085)
    add(pluck(root, 2.2, 0.6), t, 0, 0.16 if build else 0.12)
    if build:
        add(pluck(root - 12, 2.2, 0.4), t, 0, 0.12)
    for b in range(4):
        tb = t + b * BEAT
        if tb >= T_END - 0.1: break
        if b % 2 == 0: add(kick(), tb, 0, 0.32)
        else: add(noise_hit(0.18, 0.05, 1500), tb, 0, 0.09)
        for s in range(2):
            add(noise_hit(0.05, 0.015, 7000), tb + s * BEAT / 2 + BEAT / 4, 0.3, 0.035 if not build else 0.05)
    t += bar; k += 1
# Transiciones suaves en el medio (swoosh cada cambio grande)
add(swoosh(0.8, True), T_BUILD - 0.8, 0, 0.35)

# ——— Cierre: acorde resuelto + brillo ———
add(swoosh(1.0, True), T_END - 1.0, 0, 0.4)
add(pad([48, 55, 60, 62, 64, 67], TOTAL - T_END + 0.2, 0.3), T_END, 0, 0.2)
for i, m in enumerate([72, 76, 79, 84, 86]):
    add(pluck(m, 2.5, 1.0), T_END + 0.1 + i * 0.12, (i - 2) * 0.2, 0.09)
add(kick(), T_END, 0, 0.3)

# Reverb simple y master
ir_n = int(1.8 * SR)
ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR / 0.45)
ir = sosfilt(butter(1, 4000, "lp", fs=SR, output="sos"), ir) * 0.015
L = L + fftconvolve(L, ir)[:N]; R = R + fftconvolve(R, ir)[:N]
fade = np.minimum(1, np.arange(N) / (0.5 * SR)) * np.minimum(1, (N - np.arange(N)) / (2.5 * SR))
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
st = np.stack([L, R], 1) / peak * 0.8
import wave
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok", out, TOTAL)

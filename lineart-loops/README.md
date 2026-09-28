# Caro y Nico · loops line-art

Tres escenas de 4 segundos en loop, sin saltos (celular, laptop y llamada), con Caro y Nico en estilo line-art editorial: trazo monolínea, relleno de color desplazado y máscaras blancas. El movimiento está hecho con Web Animations API, sin GSAP.

## Ver

Abrí `index.html` en el navegador. Funciona con doble clic, no hace falta servidor. Muestra las 3 escenas en loop, con el trazado inicial de las líneas solo en el primer ciclo.

`render.html?escena=celular` muestra una sola escena, pausada y controlable por tiempo. Parámetros:

| Parámetro | Efecto |
|---|---|
| `escena=celular\|laptop\|llamada` | escena a mostrar |
| `intro=1` | suma el trazado inicial de 1,5 s antes del loop |
| `alpha=1` | fondo transparente |
| `maskbg=1` | máscaras pintadas con `var(--bg)` en lugar de blanco |

En la consola, `window.seek(ms)` pausa todo y lleva cada animación a ese tiempo.

## Exportar

Requisitos: Python 3.9 o superior y ffmpeg instalado y en el PATH.

```
pip install -r requirements.txt
playwright install chromium
python export.py
```

Por defecto exporta las 3 escenas a 1080×1080, con escala 2 y 30 fps: son 120 cuadros por loop en `out/frames/<escena>/0001.png…` y el video en `out/<escena>_1080x1080.mp4` (H.264, `yuv420p`, `crf 18`, `+faststart`).

| Flag | Qué hace |
|---|---|
| `--escena laptop` | exporta una sola escena (se puede repetir) |
| `--wide` | 1920×1080 |
| `--intro` | incluye el trazado inicial antes del loop |
| `--alpha` | además `.mov` ProRes 4444 y `.webm` VP9 con alpha |
| `--mask-bg` | máscaras del color de fondo; recomendado junto con `--alpha` |
| `--ffmpeg /ruta/ffmpeg` · `--chromium /ruta/chrome` | binarios propios |

El último cuadro exportado es t = 3966,7 ms. Nunca se repite el cuadro 0, así que el loop cierra sin salto.

## Cómo está armado

- `js/art.js`: kit de dibujo. Cada pieza lleva máscara blanca, relleno desplazado y línea. También incluye brazos curvos, mangas, manos, teléfono y garabatos con 3 variantes.
- `js/characters.js`: Caro y Nico de medio cuerpo, con pivotes en la cabeza, el pelo y los brazos.
- `js/scenes.js`: las 3 escenas, sus animaciones y `window.seek`.

## Tiempos

Todos los tiempos entran exactos en el loop de 4 s:

| Animación | Tiempo |
|---|---|
| Respiración | 2 ciclos por loop, 1,4 px |
| Parpadeo | 120 ms, una vez por loop por personaje, desfasados (Caro 1,2 s y Nico 2,9 s) |
| Pelo | ±1,5° |
| Boiling de garabatos | 24 pasos de ~167 ms, en escalones y no interpolado |
| Ráfagas del celular | 400 ms cada 1,33 s (3 por loop) |
| Fist pump | 2 golpes y pausa, 2 veces por loop |
| Ondas de la llamada | 1 s cada una, 3 desfasadas |

Easing general: `cubic-bezier(.45,0,.55,1)`.

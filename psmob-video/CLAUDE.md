# psmob-video

Video de PSMob (app mobile de campo de QuartzSales) hecho con Remotion.

## Jerarquía de fuentes de verdad

1. **Design system PSMob** → colores, tipografía, componentes UI, spacing, bordes, estados, iconografía de interfaz, estructura visual de la app. Tokens en `src/design/psmob-tokens.ts`.
2. **Assets del ZIP** → personajes, proporciones, estilo de ilustración, escenas, ambientes, poses, objetos, lenguaje visual del video.
3. **Brief del video** → narrativa, timing, escenas, transiciones, ritmo, intención de motion.

## Reglas

- No rediseñar los personajes para adaptarlos al design system.
- No convertir el video en una demo de UI.
- El design system aparece integrado en la historia: celulares, dashboards, formularios, chats, KPIs y elementos de interfaz.
- Animación y personajes mantienen el estilo visual de los assets aprobados.
- Convenciones de UI PSMob: moneda `$1.234,07`, fechas `DD/MM/YYYY`, PDV en mayúsculas + dirección en minúscula, EAN en monospace.

## Render en el contenedor cloud

Chromium headless ya está instalado; usarlo en lugar de descargar uno:

```
npx remotion render <Comp> out/<archivo>.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Las fuentes (Roboto / Roboto Mono) van por `@fontsource`, sin red. Textos en `src/i18n/es.ts`.

## Videos de producto QuartzSales (Apollo web)

Independientes de PSMob. Trabajan a 60 fps sobre un viewport lógico de 1600×900 escalado ×1,2.

- `src/qs-kit/`: kit compartido por todos los videos. No importa nada de un video puntual.
  - `motion/`: easing, viewport, `makeCamera` (cámara virtual) y `makeCursor` (cursor).
  - `design/tokens.ts`: tema Lara violeta, Poppins, PrimeIcons y tonos de badge.
  - `ui/`: primitivas (Button, Badge, Field, Sk…), `Sidebar`/`Topbar` con el menú actual de Apollo (`APOLLO_NAV`) y `Cursor`.
- `src/<video>/`: cada video tiene su carpeta con `animation/` (timeline, layout, camera, cursor, scene-state), `components/` y `data/`. El ejemplo de referencia es `src/pedidos/` (composición `Pedidos-Flow`, documentada en `docs/pedidos-flow.md`).
- **Flujo de entrega:** primero preview en baja (`--scale=0.5 --crf=30`, por ejemplo `npm run pedidos:preview`). Recién con OK, render en alta (`--crf=16`).
- **Frames sueltos:** `COMP=<Composición> node scripts/stills.mjs <frames…>`.
- **Reglas acordadas:**
  - Títulos de columna con la misma alineación que su contenido.
  - Título de sección alineado con el buscador o chip de la misma fila.
  - Total arriba en el panel lateral.
  - Sin zoom a botones.
  - Datos siempre ficticios.
- Moneda `$24,150.00`.

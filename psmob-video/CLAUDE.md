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

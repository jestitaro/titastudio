# Instructivo: videos de producto QuartzSales con Claude Code + Remotion

Este instructivo explica cómo se armó el video "Crear pedido" (composición `Pedidos-Flow`) y cómo repetir el proceso para otros flujos, por ejemplo tableros de BI.

El resultado es un video de 25 a 35 segundos, en 1920×1080 a 60 fps. Muestra la interfaz real de QuartzSales "en vivo", con cursor, microinteracciones y una cámara virtual que se acerca a las zonas importantes. No es una presentación de slides ni una sucesión de capturas.

---

## 1. Qué hace falta

- **Claude Code**, en la web (claude.ai/code) o en la terminal, con acceso al repositorio `titastudio`.
- **El proyecto `psmob-video`** dentro del repo. Ya tiene todo instalado:
  - Remotion 4.0.529 (React + TypeScript).
  - Las *skills* oficiales de Remotion, en `psmob-video/.claude/skills/`.
  - Fuentes locales (Poppins, Roboto) e íconos PrimeIcons.
- **Node.js 20 o superior**, solo si se trabaja en la computadora propia. En Claude Code web ya viene instalado.

No hace falta crear un proyecto nuevo para cada video: cada video nuevo es una carpeta más dentro de `psmob-video/src/`.

### ¿Hay que escribir `/remotion` al principio?

No. **No existe un comando `/remotion`.** Las skills de Remotion están instaladas en el proyecto y Claude las usa solo cuando trabaja sobre archivos de `psmob-video/`. Lo único que hace falta es:

1. Abrir la sesión de Claude Code sobre el repo `titastudio`.
2. Decir explícitamente en el primer mensaje que se trabaja en `psmob-video` con Remotion.

Si alguien quiere forzar la carga de las buenas prácticas, puede empezar el mensaje con `/remotion-best-practices`, pero no es obligatorio.

### Si alguna vez hay que armar un proyecto desde cero

Solo si no se usa `psmob-video`:

```
npx create-video@latest            # crea un proyecto Remotion vacío
npx skills add remotion-dev/skills # instala las skills de Remotion para Claude
npm i @fontsource/poppins primeicons
```

Después conviene copiar `src/pedidos/animation/` como base (timeline, easing, cámara y cursor) y agregar un `CLAUDE.md` con las reglas de la sección 6.

---

## 2. Material de entrada

Esto es lo que se usó en el video de pedidos:

| Material | Formato | Para qué sirve |
|---|---|---|
| Capturas del flujo real, una por paso y estado | ZIP con PNG | Fuente de verdad visual: layout, proporciones, colores, componentes |
| Imágenes de productos ficticios | ZIP con PNG | Thumbnails de la tabla y del resumen |
| Logo oficial | SVG (full color) | Sidebar de la app |
| Brief escrito | Texto en el chat | Narrativa, duración, escenas, reglas de cámara y motion |

**Aclaración:** en este video no se usaron grabaciones de pantalla ni archivos de Figma. Se usaron **capturas PNG**. Si en un video nuevo hay Figma o una grabación, sirven, con algunos matices:

- **Capturas PNG:** es lo que mejor funciona. Conviene una captura por pantalla y por estado (filtro abierto, tooltip visible, desplegable abierto, estado vacío, estado con datos). Capturas recortadas a la app, sin barras del navegador.
- **Figma:** si la sesión tiene el conector de Figma, alcanza con pegar el link del frame. Si no lo tiene, exportar los frames como PNG.
- **Grabación de pantalla:** Claude no "mira" el video como una persona. Puede extraerle cuadros sueltos, pero se pierde precisión. Sirve más como referencia de ritmo; para la parte visual, acompañarla siempre con capturas.

**Datos:** nunca se usan datos reales de clientes. Hay que pedirle a Claude datos ficticios consistentes, o pasárselos directamente (clientes, sucursales, montos, KPIs). Los totales tienen que cerrar en todo el video.

---

## 3. Paso a paso

### Paso 1 · Abrir la sesión y subir el material

Abrir Claude Code sobre el repo `titastudio` y adjuntar los ZIP (capturas, imágenes, logo) en el primer mensaje.

### Paso 2 · Mandar el brief

Usar la plantilla de la sección 4. Cuanto más claro esté el storyboard, menos iteraciones hacen falta. El brief tiene que decir:

- qué flujo se cuenta, escena por escena;
- duración y formato (25–35 s, 1920×1080, 60 fps);
- qué no tiene que pasar (slides, overlays, flechas, lupas, zoom a botones);
- dónde se quiere zoom y dónde no;
- que los datos sean ficticios.

### Paso 3 · Dejar que Claude inspeccione e implemente

Claude revisa el repo, reutiliza la arquitectura de `src/pedidos/` y crea la composición nueva. También renderiza frames sueltos para controlarse a sí mismo. Al terminar entrega el MP4.

### Paso 4 · Revisar e iterar

Mirar el video y pedir ajustes concretos, de a uno o de a pocos. Algunos ejemplos de lo que se pidió en el video de pedidos:

- "Más zoom en las partes donde hacés zoom."
- "Cuando está agregando el cliente quiero más zoom."
- "No quiero zoom al final cuando está por enviar: zoom al botón no tiene sentido."
- "El logo de QuartzSales es este" (con el SVG adjunto).

Cada ajuste toma pocos minutos porque todos los tiempos y encuadres están centralizados en dos archivos (sección 5).

### Paso 5 · Exportar

Claude renderiza el MP4 y lo comparte en el chat. También queda en `psmob-video/out/`, una carpeta que no se sube al repo. El código queda commiteado en la rama de trabajo.

---

## 4. Plantilla de brief

Copiar y completar lo que está entre corchetes:

> Trabajá sobre el proyecto `psmob-video` del repo, con Remotion, como Senior Motion Designer + Senior Frontend Engineer especializado en product storytelling para SaaS.
>
> **Objetivo:** un video de [25–35] s, 1920×1080, 60 fps, que muestre [el flujo: por ejemplo, abrir el tablero de Ventas → aplicar filtro de región → ver cómo cambian los KPIs → abrir el detalle de un gráfico → volver a la vista general].
>
> **Fuente de verdad:** las capturas adjuntas. Respetá estructura, proporciones, colores, tipografía, componentes y densidad. No rediseñes el producto. Seguí el mismo estilo del video `Pedidos-Flow` (`src/pedidos/`).
>
> **Datos:** ficticios y consistentes en todo el video. [Opcional: lista de datos.]
>
> **Storyboard:**
> 1. [Escena 1: qué se ve y qué acción ocurre]
> 2. [Escena 2…]
>
> **Cámara:** todo pasa en una sola pantalla con cámara virtual (paneo y zoom). Zoom en: [zonas]. Sin zoom en: [zonas, por ejemplo botones o CTAs]. Nada de slides, duplicados de UI, lupas, flechas ni overlays explicativos.
>
> **Técnica:** animación determinista (todo derivado del frame), timeline central editable y componentes separados, como en `src/pedidos/`.
>
> Implementalo, renderizá y mandame el video.

---

## 5. Archivos clave de cada video

Cada video vive en su propia carpeta, por ejemplo `src/pedidos/` o `src/tablero-ventas/`. La estructura es la misma:

| Archivo | Qué contiene | Cuándo se toca |
|---|---|---|
| `animation/timeline.ts` | Todos los tiempos, en frames (60 = 1 segundo) | Ritmo: algo pasa muy rápido o muy lento |
| `animation/camera.ts` | Encuadres de cámara: foco y escala por momento | Más o menos zoom, zoom en otra zona, sacar un zoom |
| `animation/cursor.ts` | Recorrido y clicks del cursor | El cursor va a otro lugar |
| `animation/scene-state.ts` | Estado de toda la pantalla en cada frame | Lógica de interacciones |
| `data/` | Datos ficticios, catálogo e imágenes | Cambiar nombres, montos, productos |
| `design/tokens.ts` | Colores, fuentes, sombras | Ajustes de estilo |
| `components/` | Pantallas y componentes de la UI | Cambios visuales en la interfaz |

Imágenes y logos van en `psmob-video/public/`.

---

## 6. Estilo acordado

Estas reglas salieron de las iteraciones del video de pedidos. Conviene pegarlas en el brief o pedirle a Claude que las respete.

**Formato**
- 1920×1080, 60 fps, entre 25 y 35 segundos.
- Una sola interfaz durante todo el video. El cuadro nunca cambia; lo que se mueve es la cámara.

**Identidad visual (Apollo)**
- Poppins, íconos PrimeIcons y logo oficial full color en SVG.
- Violeta primario `#7f47ec`, fondo `#eef1f7` y cards blancas con radio 12.
- Respetar el layout real: sidebar, topbar con breadcrumb, cards y stepper.

**Cámara**
- Plano general por defecto. El zoom se usa solo para leer algo: un campo con su desplegable, un panel, un KPI, un gráfico.
- Escalas de referencia:
  - campos de formulario: ×1,8;
  - paneles chicos (como el Resumen del Pedido): ×2,1;
  - acercamientos suaves: ×1,35.
- **No hacer zoom a botones** como Continuar o Enviar. El botón se entiende con el click.
- Si la zona no entra completa, la cámara la recorre: encuadre 1 → encuadre 2 → vuelta al plano general.
- Siempre volver al plano general entre zonas, para que se entienda dónde está cada cosa.

**Motion**
- Cada animación explica una acción o un cambio de estado. Nada decorativo.
- Cursor con trayectoria curva, que frena antes de clickear. Click con feedback mínimo.
- Skeletons breves solo donde hay carga real (listados, desplegables, tablas).
- Los números se interpolan (totales, unidades, KPIs) y los cambios llevan un highlight suave que se apaga solo.
- Prohibido: glow, partículas, 3D, gradientes decorativos, títulos gigantes, flechas, círculos tipo lupa y transiciones tipo PowerPoint.

**Datos**
- Siempre ficticios: clientes, productos, montos. Los totales tienen que cerrar en todas las pantallas.

---

## 7. Adaptación a tableros de BI

La arquitectura es la misma. Cambia el tipo de contenido:

| En pedidos | En un tablero BI |
|---|---|
| Tabla de productos | Grilla de KPIs + gráficos |
| Escribir cantidades | Aplicar filtros (fecha, región, canal) |
| Total que se actualiza | KPIs que cuentan hasta el nuevo valor |
| Ítem que entra al carrito | Barras que crecen, líneas que se dibujan, segmentos que se reacomodan |
| Zoom al Resumen del Pedido | Zoom a un KPI o a un gráfico puntual |
| Toast "Pedido creado" | Tooltip, drill-down o exportación |

Recomendaciones:

- Pedir que los gráficos se hagan en **SVG**, no en imagen: así se pueden animar y se ven nítidos con zoom.
- Pasar capturas del tablero **con y sin filtro aplicado**, para que los dos estados sean fieles.
- Definir los datos antes del brief: valores antes y después del filtro, y que sean coherentes entre sí (la suma de regiones da el total, etc.).
- Contar una historia corta, por ejemplo: "veo el tablero → filtro → noto un cambio → entro al detalle → vuelvo".

---

## 8. Ver y exportar el video

Estos comandos van en la terminal, dentro de `psmob-video/`. En Claude Code web, se le puede pedir directamente a Claude que los ejecute.

| Acción | Comando |
|---|---|
| Abrir Remotion Studio (play, pausa, scrub, saltar a un frame) | `npm run dev` |
| Renderizar el video del flujo de pedidos | `npm run pedidos:render` |
| Renderizar cualquier composición | `npx remotion render <Nombre-Composición> out/<archivo>.mp4` |
| Exportar un frame suelto como imagen | `npx remotion still <Nombre-Composición> out/frame.png --frame=1200` |

En el contenedor de Claude Code web hay que agregar el navegador que ya viene instalado:

```
--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

En una computadora propia no hace falta: Remotion descarga su navegador la primera vez.

---

## 9. Problemas frecuentes

- **"No encuentra el navegador" al renderizar en la web:** falta el flag `--browser-executable` de la sección 8.
- **Una imagen no aparece:** tiene que estar dentro de `psmob-video/public/` y cargarse con `staticFile(...)`. Claude lo resuelve si se le avisa.
- **Aparece un dato real en pantalla:** pedir que lo reemplace por uno ficticio. Ojo con los nombres de archivo de las imágenes: si repiten nombres reales, Claude les asigna nombres ficticios en pantalla.
- **El ritmo se siente lento o apurado:** pedir el ajuste en segundos ("la escena del filtro, 2 segundos más corta"). Claude lo traduce a la timeline.
- **"Parece una presentación":** casi siempre falta continuidad. Pedir que la transición sea con la misma card o el mismo panel transformándose, sin cortes.

# Pedidos · animación del flujo de creación

Composición `Pedidos-Flow`: 1920×1080, 60 fps, 2016 frames (33,6 s). Muestra el flujo completo de QuartzSales: listado, Nuevo Pedido, tipo de pedido, información general, selección de productos, foco de cámara en el Resumen del Pedido (edición y eliminación), resumen, envío y vuelta al listado con el pedido nuevo.

Todo pasa sobre una sola interfaz: el cuadro nunca cambia de tamaño y lo único que se mueve es una cámara virtual (`translate + scale` sobre el stage).

## Por qué Remotion y no Angular

El repo no incluye el código Angular de QuartzSales. La única fuente del producto son las capturas. La stack que ya existía acá es Remotion, que por diseño es determinista: cada frame es una función pura de `useCurrentFrame()`. Por eso la UI se reconstruyó en DOM + SVG, con PrimeIcons (el set que aparece en las capturas) y Poppins, respetando el layout de Apollo. Si más adelante los componentes Angular reales entran al repo, `animation/` se puede reutilizar tal cual, porque no depende de React.

## Estructura (`src/pedidos/`)

```
animation/
  timeline.ts     timeline única: todos los timings en frames (editar acá)
  easing.ts       lerp, clamp, smoothstep, easeInOutCubic, easeOutCubic, easeInOutQuart, cubicBezier, springAt
  layout.ts       geometría del viewport lógico 1600×900 (escala ×1,2); cursor y cámara apuntan a estos rects
  cursor.ts       trayectoria por tramos con arco, frenado, click y tipo de cursor
  camera.ts       keyframes de cámara (foco + escala, máximo 1,12)
  scene-state.ts  getSceneState(frame): todo el estado visual
data/catalog.ts   catálogo ficticio ↔ imágenes de public/productos/ (25 assets de productos_ficticios.zip)
data/mock-data.ts datos del pedido (NOVA RETAIL S.A., Sucursal Centro, OC-20486, líneas A/B/C)
design/tokens.ts  colores muestreados de las capturas, fuentes e íconos
components/       AppShell, OrderList, OrderTypeModal, Stepper, GeneralInfo, ProductTable,
                  CartSummary, OrderSummary, SectionHeader, Toast, Cursor, ui (primitivas + skeleton)
PedidosFlow.tsx   PedidosFrame({ frame }) = renderFrame(frame)
```

No hay `setTimeout`, `requestAnimationFrame`, animaciones CSS ni estado incremental. Hasta el shimmer de los skeletons y el giro del spinner se calculan a partir del frame.

## Continuidad entre pantallas

- **Modal → formulario:** la superficie del modal es la card principal y su rect se interpola hasta el del formulario.
- **Formulario → productos → resumen:** la card y el botón "Volver" quedan fijos. El título cambia por crossfade en el mismo lugar. La columna derecha se compacta para dejar entrar el carrito.
- **Productos → resumen:** las filas elegidas se desplazan desde su posición en la tabla hasta las tarjetas del resumen. Comparten las mismas columnas.
- **Resumen → listado:** la card principal se ensancha hasta ser la card del listado y el stepper sale por la derecha.

## Uso

```
npm run dev                         # Remotion Studio: play/pausa, scrub, saltar a frame (fuera del área exportada)
npm run pedidos:frames -- 0 600 1200  # PNG de frames sueltos en out/pedidos-frames/
npm run pedidos:render              # MP4 H.264 en out/pedidos-flow.mp4
```

Para un solo frame con la CLI: `npx remotion still Pedidos-Flow out/f1200.png --frame=1200 --browser-executable=...`.

## Escena clave: foco en el Resumen del Pedido

| Bloque | Frames | Qué pasa |
|---|---|---|
| intro | 786–870 | la card del formulario pasa a la tabla; skeleton → filas con imagen |
| selección | 876–1112 | A se tipea (6), B se tipea (5), C se sube con "+" (1→3); cada línea entra al panel |
| enfoque | 1136–1214 | pan + zoom (×1,6) hacia el panel inferior derecho |
| interacción | 1238–1318 | "−" dos veces en A (6→4) y eliminar B |
| update | 1322–1394 | B colapsa, C sube; total, unidades y cajas se interpolan |
| alejamiento | 1394–1470 | zoom out a pantalla completa |

Todos esos frames están en `timeline.ts` (`focusIn`, `minusA`, `clickTrashB`, `removeB`, `focusHold`, `focusOut`). El encuadre del zoom es `FOCUS_CART` en `camera.ts`. La cámara interpola el rectángulo visible (1/escala lineal), así que paneo y zoom avanzan juntos a velocidad pareja.

Totales coherentes: después de cargar, $33,511.50 (14 u.); después de editar y eliminar, $19,161.50 (7 u.). Ese es el monto que llega al resumen y a la fila nueva del listado.

## Mejoras de UX en Selección de Productos

- Filas de 52 px en lugar de 36, más padding de celda y una línea divisoria suave.
- Thumbnail real de 36×40. Nombre en 12,5 semibold y metadata (SKU · EAN) liviana debajo.
- Precios alineados a la derecha en tabular-nums. P/Desc. en semibold. Desc. vacío como "—".
- Stepper de cantidad `[− n +]` que reemplaza el input suelto. La fila seleccionada lleva acento lateral violeta y fondo tenue.
- Panel "Resumen del Pedido" con contador de productos, métricas Unidades/Cajas, ítems con imagen, stepper, subtotal y botón de eliminar visible, y el total destacado al pie.

## Mapa de escenas (frames)

| Escena | Frames |
|---|---|
| 1 · Listado (skeleton → contenido, push-in, click) | 0–224 |
| 2 · Tipo de pedido (modal → Tradicional → morph) | 224–380 |
| 3 · Información general | 372–786 |
| 4 · Selección de productos | 786–1136 |
| 5 · Foco en el Resumen del Pedido | 1136–1470 |
| 6 · Continuar | 1440–1502 |
| 7 · Resumen | 1502–1672 |
| 8 · Envío (Enviando… → toast) | 1672–1738 |
| 9 · Cierre (fila nueva "Borrador") | 1734–2016 |

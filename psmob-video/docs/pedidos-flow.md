# Pedidos · animación del flujo de creación

Composición `Pedidos-Flow`: 1920×1080, 60 fps, 2100 frames (35 s). Muestra el flujo completo de QuartzSales: listado, Nuevo Pedido, tipo de pedido, información general, productos, validación, resumen, envío y vuelta al listado con el pedido nuevo.

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
data/mock-data.ts datos ficticios (NOVA RETAIL S.A., Sucursal Centro, OC-20486, Producto Demo A/B)
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

## Mapa de escenas (frames)

| Escena | Frames |
|---|---|
| 1 · Listado (skeleton → contenido, push-in, click) | 0–224 |
| 2 · Tipo de pedido (modal → Tradicional → morph) | 224–380 |
| 3 · Información general | 372–876 |
| 4 · Selección de productos + carrito | 876–1372 |
| 5 · Validación (total → $0, monto mínimo) | 1372–1508 |
| 6 · Continuar | 1508–1566 |
| 7 · Resumen | 1566–1766 |
| 8 · Envío (Enviando… → toast) | 1766–1832 |
| 9 · Cierre (fila nueva "Borrador") | 1828–2100 |

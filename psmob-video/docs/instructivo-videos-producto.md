# Instructivo: videos de producto QuartzSales con Claude Code + Remotion

Este instructivo es para cualquier persona de eSaurio que quiera armar un video de producto con el estilo del video "Crear pedido": la interfaz real de QuartzSales cobra vida, con cursor, microinteracciones y una cámara virtual que se acerca a las zonas importantes. No es una presentación de slides ni una sucesión de capturas.

No hace falta saber programar. Claude escribe todo el código; tu trabajo es instalar las herramientas, preparar el material, explicar qué querés contar y revisar el resultado.

**Resultado esperado:** un MP4 de 25 a 35 segundos, 1920×1080, 60 fps.

---

## Parte 1 · Instalación (se hace una sola vez)

### 1.1 Instalar Node.js

Remotion, la herramienta que genera el video, funciona sobre Node.js.

1. Entrá a https://nodejs.org y descargá la versión **LTS**.
2. Instalala con las opciones por defecto.
3. Para verificar, abrí una terminal y escribí `node -v`. Tiene que aparecer un número de versión, 20 o mayor.

Para abrir una terminal: en Mac, *Terminal* (Cmd + Espacio → "Terminal"); en Windows, *PowerShell* (menú Inicio → "PowerShell").

### 1.2 Instalar Claude Code

Claude Code es la versión de Claude que trabaja directamente sobre archivos de tu computadora.

En Mac o Linux, en la terminal:

```
curl -fsSL https://claude.ai/install.sh | bash
```

En Windows, en PowerShell:

```
irm https://claude.ai/install.ps1 | iex
```

Para verificar: `claude --version`.

La primera vez que escribas `claude`, te va a pedir iniciar sesión. Entrá con **tu cuenta de Claude de la empresa**.

> Si preferís no usar la terminal, Claude Code también está disponible en la app de escritorio de Claude (pestaña *Code*) y como extensión de VS Code. Los pasos de este instructivo son los mismos: lo único que cambia es dónde escribís.

### 1.3 Crear el proyecto de videos

Esto se hace una sola vez. Todos los videos futuros van a vivir en este mismo proyecto.

1. En la terminal, andá a la carpeta donde quieras guardarlo, por ejemplo Documentos:
   ```
   cd ~/Documents
   ```
2. Creá el proyecto:
   ```
   npx create-video@latest
   ```
   Te va a hacer preguntas:
   - **Nombre:** `qs-videos`.
   - **Template:** elegí **Blank**.
   - **Tailwind:** respondé **No**.
   - **Skills / agent instructions:** si te ofrece instalarlas, respondé **Sí**.
3. Entrá a la carpeta e instalá las dependencias:
   ```
   cd qs-videos
   npm install
   ```
4. Instalá las *skills* de Remotion. Son instrucciones especializadas que Claude usa automáticamente para trabajar bien con Remotion:
   ```
   npx skills add remotion-dev/skills
   ```
5. Instalá la tipografía y los íconos de QuartzSales:
   ```
   npm install @fontsource/poppins primeicons
   ```
6. Creá dos carpetas para el material:
   - `referencias/`: capturas, Figma exportado, briefs. Claude las lee; no aparecen en el video.
   - `public/`: imágenes que sí aparecen en el video (logo, fotos de productos).

### 1.4 Crear el archivo de reglas (CLAUDE.md)

Este archivo es lo más importante del instructivo. Claude lo lee al empezar cada sesión, y ahí queda guardado el **estilo que ya ajustamos** en el video de pedidos. Sin este archivo, cada video arranca de cero.

Creá un archivo llamado `CLAUDE.md` en la raíz de `qs-videos` y pegá el texto completo del **Anexo A**, al final de este instructivo.

Si no sabés crear el archivo, abrí Claude (paso 2.1) y escribí:

> Creá un archivo CLAUDE.md en la raíz del proyecto con este contenido: [pegar el Anexo A completo]

---

## Parte 2 · Cómo usarlo para un video nuevo

### 2.1 Abrir Claude en el proyecto

En la terminal:

```
cd ~/Documents/qs-videos
claude
```

Siempre abrí Claude **desde la carpeta del proyecto**. Así lee el `CLAUDE.md` y las skills de Remotion.

**¿Hay que escribir `/remotion` al principio?** No: ese comando no existe. Las skills de Remotion se activan solas cuando Claude trabaja en el proyecto. Si querés asegurarte, podés empezar el primer mensaje con `/remotion-best-practices`, pero es opcional.

**Permisos:** Claude va a pedir permiso para crear archivos y ejecutar comandos (instalar paquetes, renderizar). Es normal; aceptá. Si querés que no pregunte por cada archivo, en Claude Code podés pasar al modo que acepta ediciones automáticamente con Shift + Tab.

### 2.2 Preparar y adjuntar el material

Antes de escribir el brief, copiá todo el material a la carpeta del proyecto. Es la forma más confiable de "adjuntar": después le decís a Claude en qué carpeta está.

| Material | Dónde va | Formato ideal |
|---|---|---|
| Capturas de la pantalla real, una por paso y estado | `referencias/<nombre-del-video>/` | PNG |
| Pantallas de Figma | `referencias/<nombre-del-video>/` | PNG exportado del frame |
| Logo de QuartzSales | `public/` | SVG full color |
| Imágenes que van dentro de la UI (productos, avatares) | `public/<nombre-del-video>/` | PNG o JPG |
| Grabación de pantalla (opcional) | `referencias/<nombre-del-video>/` | MP4 o MOV |

Cómo preparar cada cosa:

- **Capturas:** son la fuente de verdad visual. Hacé una por cada pantalla **y por cada estado**: filtro cerrado y abierto, tooltip visible, desplegable abierto, tabla vacía y con datos. Recortalas a la app, sin barras del navegador ni del sistema.
- **Figma:** exportá cada frame como PNG a 2x. Si tu Claude tiene conectado Figma, también podés pegar el link del frame en el chat.
- **Grabación de pantalla:** Claude no "mira" un video como una persona: puede extraerle cuadros sueltos, pero pierde precisión. Usala como referencia de ritmo y acompañala **siempre** con capturas.
- **Datos reales:** no hace falta borrarlos de las capturas, pero aclarale a Claude que **no los copie**. En el video van datos ficticios.
- **ZIP:** si tenés el material en un ZIP, descomprimilo en la carpeta. También podés decirle a Claude "descomprimí `referencias/material.zip`".

En la terminal también podés arrastrar un archivo a la ventana para pegar su ruta en el mensaje. En la app de escritorio, usá el botón de adjuntar.

### 2.3 Mandar el brief

Copiá la plantilla del **Anexo B**, completala y mandala como primer mensaje. Cuanto más concreto sea el storyboard, menos vueltas hacen falta.

Un buen brief dice:

- qué se cuenta, escena por escena, con la acción de cada una;
- dónde está el material (las carpetas del paso 2.2);
- qué datos ficticios usar, o que Claude los invente;
- dónde querés zoom y dónde no;
- duración y formato.

Claude va a inspeccionar el material, construir la interfaz, animarla, revisar cuadros sueltos y avisarte cuando haya una primera versión.

### 2.4 Ver el video

Para ver y recorrer el video en el navegador, abrí **otra** terminal en la carpeta del proyecto y escribí:

```
npm run dev
```

Se abre Remotion Studio en el navegador (en general en http://localhost:3000). Ahí tenés play, pausa, la barra para recorrer el video y el número de frame. Anotar el frame o el segundo exacto de lo que querés cambiar ayuda mucho.

Si preferís un archivo de video, pedile a Claude: "Renderizá el video completo en MP4".

### 2.5 Pedir ajustes

Pedí cambios **concretos**, de a uno o de a pocos, y nombrá la escena o el segundo. Estos son ejemplos reales del video de pedidos:

- "Más zoom en las partes donde hacés zoom."
- "Cuando está eligiendo el cliente, quiero todavía más zoom."
- "No quiero zoom al final cuando está por enviar: zoom al botón no tiene sentido."
- "El logo de QuartzSales es este: `public/logo-qs.svg`."
- "En el segundo 12 el cursor va muy rápido, hacelo más lento."
- "La escena del filtro, 2 segundos más corta."
- "Mostrame el frame 900 antes de renderizar todo."

Para frases más precisas, usá el vocabulario del **Anexo C**.

### 2.6 Exportar

Pedile a Claude: "Renderizá el video final". El MP4 queda en la carpeta `out/` del proyecto. Si querés hacerlo vos, en la terminal:

```
npx remotion render
```

Este comando te deja elegir la composición si hay más de una.

### 2.7 Guardar lo aprendido

Si durante las iteraciones acordaste una regla nueva ("los KPIs siempre cuentan desde cero", "nunca zoom a tooltips"), pedí al final:

> Agregá al CLAUDE.md las reglas nuevas que acordamos en esta sesión.

Así el próximo video ya arranca con ese criterio.

---

## Parte 3 · Adaptación a tableros de BI

La forma de trabajar es la misma; cambia el contenido de la pantalla.

| En el video de pedidos | En un tablero BI |
|---|---|
| Tabla de productos | Grilla de KPIs + gráficos |
| Escribir cantidades | Aplicar filtros (fecha, región, canal) |
| Total que se actualiza | KPIs que cuentan hasta el valor nuevo |
| Ítem que entra al carrito | Barras que crecen, líneas que se dibujan, segmentos que se reacomodan |
| Zoom al panel Resumen del Pedido | Zoom a un KPI o a un gráfico puntual |
| Toast "Pedido creado" | Tooltip, drill-down o exportación |

Recomendaciones para BI:

- **Capturas con y sin filtro aplicado**, para que los dos estados del tablero sean fieles.
- **Datos definidos antes del brief:** valores antes y después de cada filtro, y coherentes entre sí. Por ejemplo, que la suma de las regiones dé el total. Si no los tenés, pedí: "Inventá datos ficticios coherentes y mostrámelos antes de animar".
- **Gráficos en SVG**, no como imagen pegada. Pedilo explícitamente: así se animan y se ven nítidos con zoom.
- **Una historia corta:** veo el tablero → filtro → noto un cambio → entro al detalle → vuelvo a la vista general.

---

## Parte 4 · Problemas frecuentes

| Problema | Qué hacer |
|---|---|
| `node` o `npx` "no se reconoce como comando" | Node.js no quedó instalado. Repetí el paso 1.1 y abrí una terminal nueva. |
| `claude` "no se reconoce como comando" | Cerrá y abrí la terminal. Si sigue, repetí el paso 1.2. |
| Claude no respeta el estilo | Verificá que abriste `claude` desde la carpeta `qs-videos` y que el `CLAUDE.md` está en la raíz. |
| Una imagen no aparece en el video | Tiene que estar dentro de `public/`. Decile a Claude la ruta exacta. |
| Aparece un dato real en pantalla | Pedí que lo reemplace por uno ficticio. Ojo con los nombres de archivo de las imágenes: no tienen que mostrarse en pantalla. |
| "Parece una presentación" | Falta continuidad. Pedí que la transición sea con la misma card o panel transformándose, sin cortes. |
| La primera vez que renderiza tarda o descarga algo | Es normal: Remotion baja un navegador propio la primera vez. |
| La conversación se hizo muy larga y Claude se confunde | Empezá una sesión nueva (`/clear` o cerrar y volver a abrir `claude`). El código y el `CLAUDE.md` quedan; pedí "seguí con el video de <nombre>". |

---

## Anexo A · Texto para CLAUDE.md

Copiar completo:

```
# Videos de producto QuartzSales (Remotion)

Videos de product storytelling de QuartzSales (Apollo, web). Cada video es una
carpeta en src/<nombre-del-video>/ y una <Composition> en src/Root.tsx.

## Formato
- 1920×1080, 60 fps, 25–35 s.
- Una sola interfaz durante todo el video. El cuadro nunca cambia de tamaño:
  lo único que se mueve es una cámara virtual (translate + scale sobre el stage).
- Nada de slides, duplicados de UI, lupas, flechas, círculos ni overlays explicativos.

## Fuente de verdad
1. Capturas o Figma en referencias/: estructura, proporciones, colores, componentes,
   densidad y jerarquía. No rediseñar el producto salvo que se pida una mejora de UX.
2. Brief del usuario: narrativa, escenas, timing, cámara.
- Datos siempre ficticios y consistentes en todo el video; los totales cierran.
  Nunca copiar clientes, montos ni nombres reales de las capturas ni de los nombres de archivo.

## Identidad visual (Apollo / PrimeNG Lara violeta)
- Tipografía Poppins (@fontsource/poppins, 400/500/600/700). Íconos PrimeIcons.
- Logo oficial full color en SVG desde public/ (nunca redibujarlo).
- Violeta primario #7f47ec (hover #6d31e0, deshabilitado #c9aff7).
- Fondo de layout #eef1f7, cards blancas con radio 12 y sombra muy suave.
- Texto #334155 / #1e293b, secundario #64748b, bordes #dee2e8.
- Layout real: sidebar blanco con logo y menú, topbar con breadcrumb, contenido en cards.
- Moneda $24,150.00, fechas DD/MM/YYYY.

## Arquitectura obligatoria (determinista)
src/<video>/
  animation/timeline.ts    todos los tiempos en frames (60 = 1 s), en un solo objeto editable
  animation/easing.ts      lerp, clamp, smoothstep, easeInOutCubic, easeOutCubic, cubicBezier
  animation/layout.ts      geometría de la UI en un viewport lógico de 1600×900 (escalado ×1,2)
  animation/camera.ts      keyframes de cámara {frame, x, y, escala}
  animation/cursor.ts      tramos del cursor y clicks
  animation/scene-state.ts getSceneState(frame): todo el estado visual
  data/                    datos ficticios
  design/tokens.ts         colores, fuentes, sombras
  components/              componentes presentacionales (reciben el estado, no calculan tiempos)
- Todo se deriva del frame con funciones puras. Prohibido setTimeout, setInterval,
  requestAnimationFrame, animaciones CSS autónomas o Math.random.
- UI en DOM/SVG (no Canvas). Gráficos en SVG.
- Imágenes con <Img src={staticFile(...)}> desde public/.

## Cámara
- Plano general por defecto. El zoom solo sirve para leer algo: un campo con su
  desplegable, un panel, un KPI, un gráfico.
- Escalas de referencia: campos de formulario ×1,8; paneles chicos ×2,1;
  acercamientos suaves ×1,35.
- No hacer zoom a botones (Continuar, Enviar, Guardar): el click alcanza.
- Si la zona no entra completa, recorrerla: encuadre 1 → encuadre 2 → plano general.
- Volver siempre al plano general entre zonas.
- Interpolar el rectángulo visible (1/escala lineal) para que paneo y zoom avancen
  juntos. Limitar el foco para no mostrar fuera del stage.

## Motion
- Cada animación explica una acción o un cambio de estado. Nada decorativo.
- Cursor dentro de la escena: trayectoria curva, frena antes del click, feedback mínimo,
  cambia a mano sobre lo clickeable.
- Skeletons breves solo donde hay carga (tablas, desplegables, tableros).
- Números interpolados (totales, KPIs) con highlight suave que se apaga solo.
- Transiciones entre pantallas con continuidad: la misma card o panel se transforma.
- Prohibido: glow, partículas, 3D, gradientes decorativos, títulos gigantes,
  rebotes exagerados, transiciones tipo PowerPoint.

## Forma de trabajo
- Inspeccionar el material, implementar todas las escenas, renderizar cuadros sueltos
  para verificar y recién después pulir. No dejar TODOs en interacciones clave.
- Antes de entregar: npx tsc --noEmit sin errores y revisión visual de frames clave.
```

---

## Anexo B · Plantilla de brief

Copiar, completar lo que está entre corchetes y mandar como primer mensaje:

```
Vamos a armar un video nuevo en este proyecto con Remotion, siguiendo el CLAUDE.md.
Trabajá como Senior Motion Designer + Senior Frontend Engineer especializado en
product storytelling para SaaS.

Nombre del video: [ej. tablero-ventas]
Material: capturas en referencias/[carpeta]/, logo en public/[archivo].svg,
imágenes en public/[carpeta]/.

Objetivo: [una frase: qué tiene que entender quien lo mire]
Duración: [25–35] s · 1920×1080 · 60 fps

Storyboard:
1. [Escena: qué pantalla se ve y qué acción ocurre]
2. [...]
3. [...]

Datos ficticios: [lista, o "inventalos coherentes y mostrámelos antes de animar"]

Cámara:
- Zoom en: [zonas]
- Sin zoom en: [zonas, por ejemplo botones]

Mejoras de UX permitidas: [ninguna / cuáles]

Inspeccioná el material, implementalo completo, revisá frames clave y renderizá el MP4.
```

---

## Anexo C · Vocabulario útil para pedir cambios

| Querés… | Decí… |
|---|---|
| Que algo dure más o menos | "La escena X, N segundos más larga o corta" |
| Más o menos acercamiento | "Más zoom en [zona]" / "Sin zoom en [zona]" |
| Que la cámara recorra una zona | "Que la cámara baje dentro del panel hasta [elemento]" |
| Que se lea un cambio de valor | "Que el total se anime y quede resaltado un momento" |
| Que no parezca un corte | "Que la transición sea con la misma card transformándose" |
| Revisar algo puntual | "Mostrame el frame N" / "Mostrame el segundo N" |
| Cambiar el ritmo del cursor | "El cursor más lento antes del click en [elemento]" |
| Cuidar el estilo | "Respetá la captura [archivo] para [componente]" |
| Cerrar | "Renderizá el video final" |

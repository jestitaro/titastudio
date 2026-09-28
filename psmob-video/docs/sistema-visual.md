# Sistema visual · video PSMob

## Referencia canónica (Archivo comprimido.zip)

Son 4 ilustraciones de Storyset, estilo "pana": `marketing`, `app-monetization`, `software-integration` y `office-work`.

- **Contorno:** no se usan strokes. Las líneas son paths rellenos en `#263238`. Hay línea fina solo en detalles internos: pliegues, dedos, bordes de objetos y fondos. Las formas de piel y ropa no llevan contorno.
- **Relleno:** flat, sin degradés. La sombra es un plano de otro tono: `#FF9A6C` bajo la mandíbula y overlays oscuros sobre la ropa.
- **Paleta base:** `#263238` (línea, pelo, pantalón), `#455A64` (slate), `#7E57C2` (violeta), grises `#E0E0E0`, `#EBEBEB` y `#F5F5F5`, y piel `#FFBF9D` con sombra `#FF9A6C`.
- **Fondos:** objetos secundarios en grises claros, con poco contraste y algún acento violeta. Plantas, cuadros y engranajes funcionan como relleno de ambiente.
- **Objetos:** geometría simple de rectángulos redondeados, íconos de línea fina violeta y gráficos de barras planos.

## Character system

- **Proporción:** cabeza grande. En plano medio, el ancho de hombros es ~1,9 veces el ancho de cabeza, con cuello visible y largo.
- **Cara:** ojos punto elípticos, cejas gruesas cortas y curvas, nariz de una sola línea abierta en "L", y boca mínima (línea, o abierta con lengua en `#FF9A6C`). Sin blush ni pestañas.
- **Oreja:** una sola visible en la vista 3/4, con una línea interna.
- **Manos:** palma y dedos en cápsula. La separación entre dedos va en un tono de piel más oscuro. Pulgar independiente.
- **Brazos:** tubos que se afinan levemente con extremos redondeados. Las mangas cortas se superponen como forma aparte.
- **Ropa:** planos de color con 2 o 3 pliegues en línea fina a baja opacidad. El escote en V lleva línea.
- **Pelo:** una masa sólida con lóbulos y 1 o 2 trazos de brillo/sombra en un tono vecino.

## Personajes

| Personaje | Identidad | Fuente |
|---|---|---|
| Caro | Pelo ondulado azul `#2F3FA8`, remera violeta con escote V, piel clara | escenas.zip (atareada, Escena-3/4, image 2) |
| Repositor | Rulos cortos `#263238`, chaleco `#455A64` sobre remera `#3C9FF1`, piel `#C9835C` | nuevo, pelo tomado de app-monetization |
| Compañero | Pelo corto naranja, remera azul (image 2) | escenas.zip, pendiente |

Todos comparten `Face`, `Hand`, `limbPath` y `Neck` (`src/characters/parts.tsx`). Para mirar a la derecha se espeja la cabeza.

## Capas de animación

- **Personaje:** pelo trasero → brazo lejano → cuello → torso → cabeza (cara, flequillo) → brazo cercano → mano. Cada parte tiene su pivote.
- **Escena:** fondo (parallax 0,35) → elementos intermedios (0,7) → personaje (1) → objetos y UI delanteros (1,25 a 1,9) → viñeta.
- **Vida mínima:** respiración, parpadeo, balanceo de pelo, idle flotante en objetos y UI, y micro-rotación.

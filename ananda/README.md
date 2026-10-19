# Ananda · Mar Azul

Web para huéspedes de Ananda, la casa familiar en Mar Azul (Buenos Aires).
Un solo `index.html` responsive, sin build ni dependencias.

## Secciones
- Historia (carta de bienvenida de Aldo y Jésica)
- Fotos con lightbox
- Inventario + kit de bienvenida + contacto de Gianini
- Heladera con imanes (comercios con 5% OFF nombrando a Ananda)
- WiFi y teléfonos útiles
- Encuesta interactiva con estrellas y reputación
- Gianini Inmobiliaria

## Estructura
```
index.html                 la web
img/                       fotos optimizadas (~1800px)
encuesta-apps-script.gs    backend de la encuesta (Google Sheets)
```

## Configurar
Todo lo editable está en el bloque `CONFIG` al principio del `<script>` de `index.html`:
- `wifi.ssid` / `wifi.pass`
- `gianini`: celulares de Luciano y Noe (formato `549` + característica + número)
- `survey.endpoint`: URL de la app web de Apps Script (instrucciones en `encuesta-apps-script.gs`)
- `survey.whatsapp`: alternativa si no hay endpoint (la reseña llega por WhatsApp)

Inventario, imanes y teléfonos se editan en los arrays `INVENTORY`, `MAGNETS` y `CONTACTS`.

## Publicar
Es estática: sirve en GitHub Pages, Cloudflare Pages o cualquier hosting.
El QR de la carta impresa tiene que apuntar a `<url>#encuesta`.

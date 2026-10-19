/**
 * ANANDA · Encuesta de huéspedes
 * Guarda cada reseña en una planilla de Google y devuelve el promedio de estrellas.
 *
 * Cómo instalarlo (5 minutos):
 * 1. Creá una planilla nueva en Google Sheets (ej: "Ananda · Reseñas").
 * 2. Extensiones → Apps Script. Borrá lo que haya y pegá este archivo entero. Guardá.
 * 3. Implementar → Nueva implementación → Tipo: Aplicación web.
 *      Ejecutar como: Yo
 *      Quién tiene acceso: Cualquier usuario
 * 4. Autorizá los permisos y copiá la URL que termina en /exec.
 * 5. Pegala en index.html → CONFIG.survey.endpoint.
 *
 * Si después cambiás este código, hacé Implementar → Administrar implementaciones →
 * editar → Nueva versión, así la URL sigue siendo la misma.
 */

const SHEET_NAME = "Reseñas";
const HEADERS = [
  "Fecha", "Nombre", "Cuándo vino", "Estrellas",
  "Le encantó", "Le encantó (texto)",
  "No tanto", "No tanto (texto)",
  "Nos falta", "Nos falta (texto)",
  "¿Volvería?", "¿Recomendaría?"
];

function doPost(e) {
  const d = JSON.parse(e.postData.contents || "{}");
  const stars = Number(d.estrellas);
  if (!(stars >= 1 && stars <= 5)) return json_({ ok: false, error: "estrellas inválidas" });

  const list = v => (Array.isArray(v) ? v.join(", ") : "");
  const txt = v => String(v || "").slice(0, 1000);

  getSheet_().appendRow([
    new Date(), txt(d.nombre), txt(d.fecha), stars,
    list(d.encanto), txt(d.encanto_txt),
    list(d.no_tanto), txt(d.no_tanto_txt),
    list(d.falta), txt(d.falta_txt),
    txt(d.volveria), txt(d.recomendaria)
  ]);
  return json_({ ok: true });
}

// GET → { avg, count } para mostrar la reputación en la web
function doGet() {
  const sh = getSheet_();
  const rows = sh.getLastRow() - 1;
  if (rows < 1) return json_({ avg: 0, count: 0 });
  const vals = sh.getRange(2, 4, rows, 1).getValues().flat().map(Number).filter(n => n >= 1 && n <= 5);
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  return json_({ avg: Math.round(avg * 10) / 10, count: vals.length });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

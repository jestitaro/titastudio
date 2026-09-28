// Datos ficticios para la UI del video. Sin marcas ni cadenas reales: PDV genéricos,
// productos por categoría y EAN inventados. Convenciones PSMob: PDV en mayúsculas,
// dirección en minúscula, moneda $1.234,07, fechas DD/MM/YYYY.

export const CAT = {
  lavandinas: { file: "Lavandinas.png", name: "Lavandinas" },
  jabonRopa: { file: "JabonRopa.png", name: "Jabón para la ropa" },
  suavizantes: { file: "Suavizantes.png", name: "Suavizantes" },
  limpiadores: { file: "Limpiadores.png", name: "Limpiadores" },
  lavavajillas: { file: "Lavavajillas.png", name: "Lavavajillas" },
  jabonTocador: { file: "JabonTocador.png", name: "Jabón de tocador" },
  deos: { file: "Deos.png", name: "Desodorantes" },
  pelo: { file: "Pelo.png", name: "Cuidado del pelo" },
  cremas: { file: "Cremas.png", name: "Cremas" },
  dental: { file: "CuidadoDental.png", name: "Cuidado dental" },
  aderezos: { file: "Aderezos.png", name: "Aderezos" },
  salsas: { file: "Salsas.png", name: "Salsas" },
  repelentes: { file: "Repelentes.png", name: "Repelentes" },
  misc: { file: "Miscelaneos.png", name: "Misceláneos" },
} as const;

export type CatKey = keyof typeof CAT;

export const catSrc = (k: CatKey) => `categorias/${CAT[k].file}`;

export const PDV = {
  active: { code: "252", name: "MAYORISTA CENTRAL", addr: "av. san martín 850", person: "LUCÍA FERNÁNDEZ" },
  list: [
    { name: "SUPERMERCADO NORTE", addr: "av. corrientes 1234" },
    { name: "AUTOSERVICIO LUNA", addr: "belgrano 77" },
    { name: "DISTRIBUIDORA SUR", addr: "av. mitre 1500" },
    { name: "FARMACIA DEL PARQUE", addr: "av. rivadavia 4420" },
  ],
};

export const TEAM = [
  { initials: "NR", name: "Nico", color: "#1976D2" },
  { initials: "CF", name: "Caro", color: "#7C5CFC" },
  { initials: "LM", name: "Lucas", color: "#2E7D32" },
  { initials: "SP", name: "Sofi", color: "#E65100" },
  { initials: "MA", name: "Mati", color: "#00897B" },
];

export const FORMS = [
  { freq: "Bimestral", title: "Relevamiento de precios", last: "21/09/2026 16:27", limit: "31/10/2026" },
  { freq: "Semanal", title: "Quiebres Limpieza Hogar", last: "25/09/2026 15:38", limit: "02/10/2026" },
  { freq: "Semanal", title: "Exhibición Jabón para la ropa", last: "25/09/2026 16:28", limit: "02/10/2026" },
  { freq: "Semanal", title: "Quiebres Cuidado Personal", last: "26/09/2026 16:29", limit: "03/10/2026" },
];

export const PRODUCTS = [
  { cat: "jabonRopa" as CatKey, ean: "7790000253588", name: "Jabón líquido ropa 3L", price: "$ 5.032,00" },
  { cat: "jabonRopa" as CatKey, ean: "7790000253601", name: "Jabón líquido diluir 500ml", price: "$ 2.180,00" },
  { cat: "lavandinas" as CatKey, ean: "7790000411169", name: "Lavandina gel 1L", price: "$ 1.543,00" },
  { cat: "suavizantes" as CatKey, ean: "7790000465018", name: "Suavizante concentrado 1,5L", price: "$ 3.410,50" },
];

export const EXHIB = [
  { cat: "aderezos" as CatKey, pct: 50.74 },
  { cat: "deos" as CatKey, pct: 73.55 },
  { cat: "jabonTocador" as CatKey, pct: 53.03 },
  { cat: "jabonRopa" as CatKey, pct: 67.82 },
  { cat: "suavizantes" as CatKey, pct: 70.92 },
  { cat: "lavavajillas" as CatKey, pct: 58.24 },
];

// Formato AR: 1234.5 → "1.234,50"
export const ar = (n: number, dec = 2) => {
  const [i, d] = n.toFixed(dec).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec > 0 ? `${int},${d}` : int;
};

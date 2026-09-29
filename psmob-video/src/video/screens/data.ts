// Datos ficticios de la UI (sin marcas ni cadenas reales). PDV en mayúsculas, dirección en minúscula,
// moneda $1.234,07, fechas DD/MM/YYYY, EAN ficticios en monospace.
export const TODAY = "29/09/2026";

export const TEAM = [
  { initials: "NR", name: "Nico", color: "#1D4ED8" },
  { initials: "CF", name: "Caro", color: "#7025E0" },
  { initials: "LM", name: "Lucas", color: "#16A34A" },
  { initials: "SP", name: "Sofi", color: "#D97706" },
];

export const PDVS = [
  { name: "MAYORISTA CENTRAL", addr: "av. san martín 850", km: "1,2 km", time: "07:30 a 16:00" },
  { name: "SUPERMERCADO NORTE", addr: "av. corrientes 1234", km: "3,4 km", time: "08:00 a 12:00" },
  { name: "AUTOSERVICIO LUNA", addr: "belgrano 77", km: "5,1 km", time: "10:00 a 13:00" },
  { name: "DISTRIBUIDORA SUR", addr: "av. mitre 1500", km: "8,0 km", time: "14:00 a 17:30" },
];

// Productos genéricos (packaging sin marca de public/productos).
export const PROD = {
  detergente: { src: "productos/detergente-liquido-celeste.png", ean: "7790000253588", name: "Detergente líquido 3L", price: "$ 5.032,00" },
  lavandina: { src: "productos/bidon-limpiador-amarillo.png", ean: "7790000411169", name: "Limpiador bidón 2L", price: "$ 1.543,00" },
  lavavajillas: { src: "productos/lavavajillas-amarillo.png", ean: "7790000465018", name: "Lavavajillas 750ml", price: "$ 1.320,00" },
  shampoo: { src: "productos/shampoo-violeta.png", ean: "7790000118201", name: "Shampoo 400ml", price: "$ 3.410,50" },
  aerosol: { src: "productos/aerosol-celeste.png", ean: "7790000120523", name: "Desodorante aerosol 150ml", price: "$ 2.310,00" },
  spray: { src: "productos/spray-celeste.png", ean: "7790000334415", name: "Limpiador multiuso 500ml", price: "$ 1.980,00" },
} as const;

export const ar = (n: number, dec = 2) => {
  const [i, d] = n.toFixed(dec).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec > 0 ? `${int},${d}` : int;
};

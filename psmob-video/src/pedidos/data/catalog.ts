// Catálogo ficticio ↔ imágenes de `public/productos/` (assets de productos_ficticios.zip).
// Los nombres de archivo del zip no se muestran en pantalla: cada imagen tiene un nombre ficticio.
import { staticFile } from "remotion";

export type CatalogItem = {
  sku: string;
  ean: string;
  name: string;
  file: string; // archivo en public/productos/
  psl: number;
  uxb: number;
  pres: string;
};

const item = (n: number, name: string, file: string, psl: number, pres = "UN"): CatalogItem => ({
  sku: `QS-${String(10000 + n)}`,
  ean: `77900100${String(n).padStart(5, "0")}`,
  name,
  file,
  psl,
  uxb: 1,
  pres,
});

// Orden = orden de la tabla. Las 3 primeras son las líneas del pedido.
export const CATALOG: CatalogItem[] = [
  item(11, "Test rápido multidroga", "01_multi-drug-one-step-screen-test.png", 2450),
  item(28, "Vaso colector 10 drogas", "03_abon-orina-ez-cup-10-drogas.png", 1890),
  item(35, "Guantes de nitrilo azul x100", "18_guantes-nitrilo-azul.png", 3120.5),
  item(42, "Panel de orina 6 drogas", "04_abon-orina-ez-cup-6-drogas.png", 875),
  item(59, "Frasco reactivo 60 tiras", "02_abon-panel-6-drogas.png", 1240.75),
  item(66, "Mascarilla quirúrgica x50", "19_mascarilla-quirurgica.png", 690.4),
  item(73, "Alcohol en gel 500 ml", "21_alcohol-en-gel.png", 1560),
  item(80, "Termómetro infrarrojo", "22_termometro-infrarrojo.png", 4980),
  item(97, "Jeringa estéril 5 ml x100", "23_jeringa-esteril.png", 2015),
  item(103, "Tubos EDTA x100", "24_tubos-extraccion-sangre-edta.png", 3375.2),
  item(110, "Apósitos adhesivos x100", "25_apositos-adhesivos.png", 940),
  item(127, "Gafas de seguridad", "20_gafas-seguridad.png", 2780),
  item(134, "Vaso colector 3 drogas", "06_abon-orina-ez-cup-3-drogas.png", 1325.6),
  item(141, "Vaso colector 5 drogas", "05_abon-5-drug-ez-cup.png", 1410),
  item(158, "Vaso colector 10 drogas II", "07_abon-orina-ez-cup-10-drogas-2.png", 1905),
  item(165, "Kit de test 6 drogas", "08_sotoxa-test-kit-6-drogas.png", 5210),
  item(172, "Fuente de alimentación", "09_sotoxa-power-supply-unit.png", 3890),
  item(189, "Cable micro USB", "10_sotoxa-micro-usb-cable.png", 760),
  item(196, "Set de cartuchos QC", "11_sotoxa-qc-cartridge-set.png", 6420),
  item(202, "Cable de impresora", "12_sotoxa-printer-cable.png", 820),
  item(219, "Impresora con cable", "13_sotoxa-printer-and-cable.png", 12450),
  item(226, "Cable de alimentación US", "14_sotoxa-power-cable-us.png", 690),
  item(233, "Cable de alimentación AUS", "15_sotoxa-power-cable-aus.png", 690),
  item(240, "Cable de alimentación EU", "16_sotoxa-power-cable-eu.png", 690),
  item(257, "Cable de alimentación UK", "17_sotoxa-power-cable-uk.png", 690),
];

export const productImage = (p: CatalogItem) => staticFile(`productos/${p.file}`);

// Todos los textos del video viven acá para poder traducirlos (en.ts) sin tocar escenas.

export const es = {
  vo: {
    s01: "Gestionar a tu equipo comercial no tiene por qué ser un dolor de cabeza.",
    s10: "Y con AiFred, nuestro asistente con inteligencia artificial, la automatización llega al siguiente nivel. Incluso sin conexión.",
  },
  s01: {
    notifForms: { title: "Formularios pendientes", subtitle: "Relevamiento de góndola", badge: 12 },
    notifVisit: { title: "Visita sin registrar", subtitle: "MAYORISTA CENTRAL" },
    notifRoute: { title: "Ruteo modificado", chip: "Ruteo manual" },
  },
  s10: {
    assistant: "AiFred",
    assistantRole: "Asistente IA",
    offline: "Funciona sin conexión",
    scanning: "Reconociendo productos",
    detected: "productos detectados",
    priceOk: "Precio OK",
    outOfStock: "Faltante",
    products: [
      { name: "Ultra Wash 3L", ean: "7791225569", price: "$5.450,00" },
      { name: "Powder washing", ean: "7791588662", price: "$1.290,00" },
      { name: "Ketchup regular", ean: "7791296187", price: "$2.134,07" },
    ],
  },
};

export type Copy = typeof es;

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
  motionTest: {
    listTitle: "Visitas de hoy",
    listSummary: ["8 visitas", "3 pendientes"],
    visits: [
      { pdv: "SUPERMERCADO DÍA", addr: "av. corrientes 1234", chip: "Pendiente" },
      { pdv: "MAYORISTA CENTRAL", addr: "av. san martín 850", chip: "En curso" },
      { pdv: "KIOSCO EL SOL", addr: "calle 9 de julio 312", chip: "Pendiente" },
      { pdv: "FARMACIA NORTE", addr: "av. rivadavia 4420", chip: "Pendiente" },
      { pdv: "AUTOSERVICIO LUNA", addr: "belgrano 77", chip: "Pendiente" },
      { pdv: "DISTRIBUIDORA SUR", addr: "av. mitre 1500", chip: "Pendiente" },
    ],
    phoneAlerts: ["Visita vencida", "Formulario sin enviar", "Ruta modificada"],
    stress: [
      { title: "Visita vencida", subtitle: "SUPERMERCADO DÍA", tone: "danger" },
      { title: "Formularios pendientes", subtitle: "Relevamiento de góndola", tone: "warning" },
      { title: "Ruta modificada", subtitle: "3 PDV reasignados", tone: "primary" },
      { title: "Foto rechazada", subtitle: "KIOSCO EL SOL", tone: "danger" },
    ],
    chatNotif: { title: "Nico", subtitle: "Nuevo mensaje" },
    chat: {
      name: "Caro",
      status: "en línea",
      incoming: "¿Pudiste cargar la visita de DÍA?",
      outgoing: "Listo, cargada con fotos",
      cardTitle: "SUPERMERCADO DÍA",
      cardChip: "Completada",
      time: "10:42",
      today: "Hoy",
      earlier: "Buen día, arranco la ruta",
      earlierTime: "09:15",
    },
    brand: "PSMob",
    tagline: "El trabajo de campo, en orden.",
    chips: { visit: "Visita 1/8", sync: "Sincronizado", date: "28/09/2026" },
  },
};

export type Copy = typeof es;

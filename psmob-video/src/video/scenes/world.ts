// Posiciones compartidas entre escenas contiguas para que la cámara continúe sin cortes.
// Regla de composición: Caro a la izquierda mirando a la derecha (su celular a su derecha);
// Nico a la derecha mirando a la izquierda (su celular a su izquierda). Nadie le da la espalda a su pantalla.
export const CARO_W = { x: 470, feet: 1060, scale: 0.72 };
export const NICO_W = { x: 1600, feet: 1060, scale: 0.66 };
export const DEV7 = { x: 1340, y: 540, s: 0.84 }; // celular de Caro en la escena 7
export const NICO_DEV = { x: 1320, y: 470, s: 0.62 }; // celular de Nico (a su izquierda), escenas 8–9
// Encuadre final de la 8 = inicial de la 9: Nico en plano americano (cabeza en cuadro) con su celular.
export const CAM_NICO = { x: 1480, y: 400, zoom: 1.18 };

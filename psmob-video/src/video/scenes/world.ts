// Posiciones compartidas entre escenas contiguas para que la cámara continúe sin cortes.
// Regla de composición: Caro a la izquierda mirando a la derecha (su celular a su derecha);
// Nico a la derecha mirando a la izquierda (su celular a su izquierda). Nadie le da la espalda a su pantalla.
// Safe area: a zoom 1 los personajes entran enteros (cabeza ~140, pies en la línea de piso 950).
export const FLOOR_Y = 950;
export const CARO_W = { x: 600, feet: FLOOR_Y, scale: 0.55 };
export const NICO_W = { x: 2000, feet: FLOOR_Y, scale: 0.5 };
export const DEV7 = { x: 1060, y: 520, s: 0.74 }; // celular de Caro (a su derecha), escenas 7 y 10
export const NICO_DEV = { x: 1640, y: 470, s: 0.62 }; // celular de Nico (a su izquierda), escenas 8–9
// Encuadre final de la 8 = inicial de la 9: Nico hasta la cintura a la derecha, su chat en el centro y
// aire a la izquierda para el texto (Caro queda fuera de cuadro).
export const CAM_NICO = { x: 1623, y: 468, zoom: 1.3 };

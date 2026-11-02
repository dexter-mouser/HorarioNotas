// iconos.js — SVG en línea que heredan el color del tema (currentColor)
// Cada icono lleva role="img" y aria-label.

const ESPACIO = 'http://www.w3.org/2000/svg';
const GROSOR_TRAZO = '1.8';
// Base común: hoja de calendario con esquinas redondeadas y anillas
const CALENDARIO = ['M7 4.5h10a3 3 0 0 1 3 3V17a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3z', 'M4 9.5h16', 'M8.5 3v3', 'M15.5 3v3'];

const TRAZOS = {
  reloj: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z', 'M12 7.5V12l3 2'],
  semana: [...CALENDARIO, 'M8 13.5h8', 'M8 16.5h5'],
  // Mismo motivo que el icono de la app: calendario con check
  calendario: [...CALENDARIO, 'M9 14.5l2 2 4-4'],
  ajustes: ['M4 7h9', 'M19 7h1', 'M4 17h1', 'M11 17h9', 'M16 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z', 'M8 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'],
  mas: ['M12 5v14', 'M5 12h14'],
  cerrar: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'],
  sol: ['M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z', 'M12 2.5v1.5', 'M12 20v1.5', 'M5.3 5.3l1 1', 'M17.7 17.7l1 1', 'M2.5 12H4', 'M20 12h1.5', 'M5.3 18.7l1-1', 'M17.7 6.3l1-1'],
  luna: ['M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2z'],
  campana: ['M18 16.5l1.5 1.5h-15L6 16.5V11a6 6 0 0 1 12 0z', 'M10 20.5a2 2 0 0 0 4 0'],
  chincheta: ['M9 3.5h6l-.8 5.5 3.3 3.2V14H6.5v-1.8L9.8 9z', 'M12 14v6.5'],
  nota: ['M7 3.5h7l5 5V18a2.5 2.5 0 0 1-2.5 2.5h-9.5A2.5 2.5 0 0 1 4.5 18V6A2.5 2.5 0 0 1 7 3.5z', 'M14 3.5V7a1.5 1.5 0 0 0 1.5 1.5H19', 'M8.5 13h7', 'M8.5 16.5h4.5'],
  estrella: ['M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z'],
  rombo: ['M12 3.5l7.5 8.5-7.5 8.5-7.5-8.5z'],
  corazon: ['M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z'],
  izquierda: ['M14.5 6l-6 6 6 6'],
  derecha: ['M9.5 6l6 6-6 6'],
};

/** Crea un SVG con el icono pedido y su etiqueta accesible. */
export function icono(nombre, etiqueta) {
  const svg = document.createElementNS(ESPACIO, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'icono');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', etiqueta || nombre);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', GROSOR_TRAZO);
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  for (const d of TRAZOS[nombre] || []) {
    const trazo = document.createElementNS(ESPACIO, 'path');
    trazo.setAttribute('d', d);
    svg.append(trazo);
  }
  return svg;
}

/** Sustituye cada <span data-icono="..." data-etiqueta="..."> por su SVG. */
export function montarIconos(raiz = document) {
  raiz.querySelectorAll('[data-icono]').forEach((marca) => {
    marca.replaceWith(icono(marca.dataset.icono, marca.dataset.etiqueta));
  });
}

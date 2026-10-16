// iconos.js — SVG en línea que heredan el color del tema (currentColor)
// Cada icono lleva role="img" y aria-label.

const ESPACIO = 'http://www.w3.org/2000/svg';
const CALENDARIO = ['M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M4 10h16', 'M8 3v4', 'M16 3v4'];

const TRAZOS = {
  reloj: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2'],
  semana: [...CALENDARIO, 'M8 14h8', 'M8 17h5'],
  calendario: [...CALENDARIO, 'M8 14h.01', 'M12 14h.01', 'M16 14h.01', 'M8 17.5h.01', 'M12 17.5h.01'],
  ajustes: ['M4 8h8', 'M18 8h2', 'M4 16h2', 'M12 16h8', 'M16 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M8 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  mas: ['M12 5v14', 'M5 12h14'],
  cerrar: ['M6 6l12 12', 'M18 6L6 18'],
  sol: ['M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'M12 2v2', 'M12 20v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M2 12h2', 'M20 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
  luna: ['M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z'],
  campana: ['M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z', 'M10 21h4'],
  chincheta: ['M9 3h6l-1 6 3 3v2H7v-2l3-3z', 'M12 14v7'],
  nota: ['M6 3h9l4 4v14H6z', 'M9 12h7', 'M9 16h7'],
  estrella: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'],
  rombo: ['M12 3l8 9-8 9-8-9z'],
  corazon: ['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'],
  izquierda: ['M15 5l-7 7 7 7'],
  derecha: ['M9 5l7 7-7 7'],
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
  svg.setAttribute('stroke-width', '2');
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

// vista-notas.js — Lista de notas dentro de Hoy
import { estado } from '../datos/estado.js';
import { agruparNotas } from '../nucleo/notas.js';
import { crear } from '../componentes/dom.js';
import { tarjetaNota } from '../componentes/tarjetas.js';

export function dibujarNotas() {
  const ahora = new Date();
  const contenedor = document.getElementById('notas');
  const { fijadas, conLimite, sinLimite } = agruparNotas(estado.notas, ahora);
  const secciones = [['Fijadas', fijadas], ['Con fecha límite', conLimite], ['Sin fecha límite', sinLimite]];

  const contenido = [];
  for (const [titulo, notas] of secciones) {
    if (!notas.length) continue;
    contenido.push(crear('h2', { class: 'seccion-titulo' }, titulo), ...notas.map((nota) => tarjetaNota(nota, ahora)));
  }
  if (!contenido.length) contenido.push(crear('p', { class: 'tarjeta tarjeta-vacia' }, 'Sin notas. Pulsa + para añadir.'));
  contenedor.replaceChildren(...contenido);
}

// vista-semana.js — Semana actual: una tarjeta por día con franja de ocupación de 24 h
import { estado } from '../datos/estado.js';
import { eventosDelDia } from '../nucleo/nucleo.js';
import { notasDelDia } from '../nucleo/notas.js';
import { NOMBRES_DIA, indiceDia, lunesDeSemana, rangoSemana, sumarDias } from '../nucleo/tiempo.js';
import { crear } from '../componentes/dom.js';
import { filaEvento, filaNota } from '../componentes/tarjetas.js';
import { aplicarMedidas } from '../componentes/medidas.js';

const MINUTOS_DIA = 1440;

function franja(eventos) {
  const barra = crear('div', { class: 'franja', role: 'img', 'aria-label': 'Franja de ocupación de 24 horas' });
  for (const posicion of [25, 50, 75]) barra.append(crear('i', { class: 'marca', 'data-izq': String(posicion) }));
  for (const e of eventos) {
    barra.append(crear('i', {
      class: 'tramo',
      'data-izq': ((e.inicio / MINUTOS_DIA) * 100).toFixed(2),
      'data-ancho': (((e.fin - e.inicio) / MINUTOS_DIA) * 100).toFixed(2),
    }));
  }
  const escala = crear('div', { class: 'franja-escala', 'aria-hidden': 'true' },
    ...['00', '06', '12', '18', '24'].map((h) => crear('span', {}, h)));
  return [barra, escala];
}

function tarjetaDia(indice, lunes, ahora) {
  const fecha = sumarDias(lunes, indice);
  const eventos = eventosDelDia(estado.eventos, fecha);
  const notas = notasDelDia(estado.notas, fecha);
  const esHoy = indice === indiceDia(ahora);

  let cuenta = `${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'}`;
  if (notas.length) cuenta += ` · ${notas.length} ${notas.length === 1 ? 'nota' : 'notas'}`;

  const nombre = crear('span', { class: 'dia-nombre' }, NOMBRES_DIA[indice]);
  if (esHoy) nombre.append(crear('span', { class: 'etiqueta acento' }, 'Hoy'));
  const cabecera = crear('button', { type: 'button', class: 'dia-cabecera', 'data-ir-dia': String(indice) },
    nombre, crear('span', { class: 'dia-cuenta' }, cuenta));

  const tarjeta = crear('article', { class: `tarjeta tarjeta-dia${esHoy ? ' hoy' : ''}` },
    cabecera, ...franja(eventos), ...eventos.map((e) => filaEvento(e)), ...notas.map((n) => filaNota(n, ahora)));
  if (!eventos.length && !notas.length) tarjeta.append(crear('p', { class: 'libre' }, 'Libre'));
  return tarjeta;
}

export function dibujarSemana() {
  const ahora = new Date();
  const lunes = lunesDeSemana(ahora);
  document.getElementById('rango-semana').textContent = rangoSemana(lunes);
  const rejilla = document.getElementById('semana-rejilla');
  rejilla.replaceChildren(...NOMBRES_DIA.map((_, i) => tarjetaDia(i, lunes, ahora)));
  aplicarMedidas(rejilla);
}

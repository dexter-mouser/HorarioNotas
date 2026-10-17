// vista-calendario.js — Calendario mensual con indicadores y detalle del día
import { estado } from '../datos/estado.js';
import { eventosDelDia } from '../nucleo/nucleo.js';
import { notasDelDia } from '../nucleo/notas.js';
import { diasDelMes, indicadoresDia, sumarMeses } from '../nucleo/mes.js';
import { aTexto, deTexto, formatoFechaLarga, formatoMes, soloFecha } from '../nucleo/tiempo.js';
import { crear } from '../componentes/dom.js';
import { filaEvento, filaNota } from '../componentes/tarjetas.js';

const $ = (id) => document.getElementById(id);
const MAX_PUNTOS = 3;

function celdaDia(dia, ahora) {
  const ind = indicadoresDia(dia, estado.eventos, estado.notas, ahora);
  const delMes = dia.getMonth() === estado.mes.getMonth();
  const seleccionado = aTexto(dia) === aTexto(estado.diaCalendario);
  const marcas = crear('span', { class: 'indicadores' });
  for (let i = 0; i < Math.min(ind.eventos, MAX_PUNTOS); i++) marcas.append(crear('span', { class: 'punto' }));
  if (ind.notas) marcas.append(crear('span', { class: `cuadro${ind.hayVencida ? ' vencida' : ''}` }));

  let etiqueta = formatoFechaLarga(dia);
  if (ind.eventos) etiqueta += `, ${ind.eventos} ${ind.eventos === 1 ? 'evento' : 'eventos'}`;
  if (ind.notas) etiqueta += `, ${ind.notas} ${ind.notas === 1 ? 'nota' : 'notas'}`;

  const clases = ['dia-cal'];
  if (!delMes) clases.push('otro');
  if (aTexto(dia) === aTexto(ahora)) clases.push('es-hoy');
  return crear('button', {
    type: 'button', class: clases.join(' '), 'data-fecha': aTexto(dia),
    'aria-pressed': String(seleccionado), 'aria-label': etiqueta,
  }, crear('span', {}, String(dia.getDate())), marcas);
}

export function dibujarCalendario() {
  const ahora = new Date();
  const hoy = soloFecha(ahora);
  $('mes-titulo').textContent = formatoMes(estado.mes);
  $('boton-mes-hoy').hidden = estado.mes.getFullYear() === hoy.getFullYear() && estado.mes.getMonth() === hoy.getMonth();
  $('rejilla-mes').replaceChildren(...diasDelMes(estado.mes).map((dia) => celdaDia(dia, ahora)));

  // Detalle del día seleccionado
  const eventos = eventosDelDia(estado.eventos, estado.diaCalendario);
  const notas = notasDelDia(estado.notas, estado.diaCalendario);
  const detalle = [
    crear('h2', { class: 'seccion-titulo' }, formatoFechaLarga(estado.diaCalendario)),
    ...eventos.map((e) => filaEvento(e, 'tarjeta fila-semana')),
    ...notas.map((n) => filaNota(n, ahora, 'tarjeta fila-semana')),
  ];
  if (!eventos.length && !notas.length) detalle.push(crear('p', { class: 'tarjeta tarjeta-vacia' }, 'Nada este día.'));
  $('detalle-dia').replaceChildren(...detalle);
}

function irAlMes(mes) {
  const hoy = soloFecha(new Date());
  estado.mes = mes;
  const esMesActual = mes.getFullYear() === hoy.getFullYear() && mes.getMonth() === hoy.getMonth();
  estado.diaCalendario = esMesActual ? hoy : mes; // mes = día 1
  dibujarCalendario();
}

export function iniciarCalendario() {
  $('boton-mes-anterior').addEventListener('click', () => irAlMes(sumarMeses(estado.mes, -1)));
  $('boton-mes-siguiente').addEventListener('click', () => irAlMes(sumarMeses(estado.mes, 1)));
  $('boton-mes-hoy').addEventListener('click', () => irAlMes(sumarMeses(soloFecha(new Date()), 0)));
  $('rejilla-mes').addEventListener('click', (evento) => {
    const celda = evento.target.closest('.dia-cal');
    const fecha = celda && deTexto(celda.dataset.fecha);
    if (!fecha) return;
    estado.diaCalendario = fecha;
    if (fecha.getMonth() !== estado.mes.getMonth()) estado.mes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    dibujarCalendario();
  });
}

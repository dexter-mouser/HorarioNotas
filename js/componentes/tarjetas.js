// tarjetas.js — Piezas visuales reutilizadas por Hoy, Semana y Calendario
import { crear } from './dom.js';
import { icono } from './iconos.js';
import { formatoHora } from '../nucleo/tiempo.js';
import { estadoNota } from '../nucleo/notas.js';
import { FIN_DIA } from '../nucleo/nucleo.js';

const rangoHoras = (evento) => `${formatoHora(evento.inicio)} – ${formatoHora(evento.fin)}`;

/** Etiqueta con el estado de la nota (Vence en…, Vence hoy…, Vencida…, Indefinida). */
export function etiquetaNota(nota, ahora) {
  const { tipo, texto } = estadoNota(nota, ahora);
  const clase = { vencida: 'etiqueta alerta', hoy: 'etiqueta destacada' }[tipo] || 'etiqueta';
  return crear('span', { class: clase }, texto);
}

/** Tarjeta de evento para la agenda de Hoy. */
export function tarjetaEvento(evento, { esAhora = false } = {}) {
  const marcas = crear('span', { class: 'marcas' });
  if (esAhora) marcas.append(crear('span', { class: 'etiqueta acento' }, 'Ahora'));
  if (evento.repeticion === 'una-vez') marcas.append(crear('span', { class: 'etiqueta' }, 'Una vez'));
  if (evento.aviso.activo) marcas.append(icono('campana', 'Aviso activo'));
  const cuerpo = crear('span', { class: 'evento-cuerpo' }, crear('span', { class: 'evento-titulo' }, evento.titulo));
  if (evento.nota) cuerpo.append(crear('span', { class: 'evento-nota' }, evento.nota));
  if (marcas.children.length) cuerpo.append(marcas);
  return crear('button', { type: 'button', class: `tarjeta evento${esAhora ? ' ahora' : ''}`, 'data-evento': evento.id },
    crear('span', { class: 'evento-horas' }, rangoHoras(evento)), cuerpo);
}

/** Fila de evento para Semana y Calendario. */
export function filaEvento(evento, clase = 'fila-semana') {
  return crear('button', { type: 'button', class: clase, 'data-evento': evento.id },
    crear('span', { class: 'evento-titulo' }, evento.titulo),
    crear('span', { class: 'evento-horas' }, rangoHoras(evento)));
}

/** Fila de nota con límite para Semana y Calendario ("Vencida" en lugar de la hora). */
export function filaNota(nota, ahora, clase = 'fila-semana') {
  const vencida = estadoNota(nota, ahora).tipo === 'vencida';
  return crear('button', { type: 'button', class: clase, 'data-nota': nota.id },
    icono('nota', 'Nota'),
    crear('span', { class: 'evento-titulo' }, nota.titulo),
    crear('span', { class: 'evento-horas' }, vencida ? 'Vencida' : formatoHora(nota.limite.hora ?? FIN_DIA)));
}

/** Tarjeta compacta de nota fijada (sección Fijadas de Hoy). */
export function tarjetaNotaFijada(nota, ahora) {
  const tarjeta = crear('button', { type: 'button', class: 'tarjeta fijada', 'data-nota': nota.id },
    icono('chincheta', 'Nota fijada'),
    crear('span', { class: 'evento-titulo' }, nota.titulo),
    etiquetaNota(nota, ahora));
  if (nota.aviso.activo) tarjeta.append(icono('campana', 'Aviso activo'));
  return tarjeta;
}

/** Tarjeta de nota con botón de chincheta (vista Notas). */
export function tarjetaNota(nota, ahora) {
  const marcas = crear('span', { class: 'marcas' }, etiquetaNota(nota, ahora));
  if (nota.aviso.activo) marcas.append(icono('campana', 'Aviso activo'));
  const chincheta = crear('button', {
    type: 'button', class: 'chincheta', 'data-fijar': nota.id,
    'aria-pressed': String(nota.fijada), 'aria-label': nota.fijada ? 'Soltar nota' : 'Fijar nota',
  }, icono('chincheta', 'Chincheta'));
  return crear('article', { class: 'tarjeta nota' },
    crear('button', { type: 'button', class: 'nota-cuerpo', 'data-nota': nota.id },
      crear('span', { class: 'evento-titulo' }, nota.titulo), marcas),
    chincheta);
}

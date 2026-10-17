// archivo-ics.js — Generación del archivo .ics (sin DOM)
import { deTexto, fechaConHora, lunesDeSemana, sumarDias } from './tiempo.js';
import { limiteEnMs } from './notas.js';

const CODIGOS_DIA = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

/** Escapa los caracteres especiales del formato iCalendar. */
function escapar(texto) {
  return String(texto).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Las líneas no deben pasar de 75 caracteres: se parten con un espacio inicial. */
function plegar(linea) {
  const partes = [];
  let resto = linea;
  while (resto.length > 73) {
    partes.push(resto.slice(0, 73));
    resto = ' ' + resto.slice(73);
  }
  partes.push(resto);
  return partes.join('\r\n');
}

function fechaLocal(fecha) {
  const p = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}T${p(fecha.getHours())}${p(fecha.getMinutes())}00`;
}

function marcaUTC(fecha) {
  return fecha.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function alarma(antes, titulo) {
  return ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escapar(titulo)}`, `TRIGGER:-PT${antes}M`, 'END:VALARM'];
}

/**
 * Crea el contenido del .ics con los eventos y notas con aviso activo.
 * Los eventos indefinidos se exportan como repetición semanal.
 * Devuelve null si no hay nada que exportar.
 */
export function generarICS(eventos, notas, ahora = new Date()) {
  const lineas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Horario//ES', 'CALSCALE:GREGORIAN'];
  const sello = marcaUTC(ahora);
  let cantidad = 0;

  for (const evento of eventos) {
    if (!evento.aviso.activo) continue;
    const dia = evento.repeticion === 'una-vez'
      ? sumarDias(deTexto(evento.semana), evento.dia)
      : sumarDias(lunesDeSemana(ahora), evento.dia);
    lineas.push('BEGIN:VEVENT', `UID:evento-${evento.id}@horario`, `DTSTAMP:${sello}`,
      `DTSTART:${fechaLocal(fechaConHora(dia, evento.inicio))}`, `DTEND:${fechaLocal(fechaConHora(dia, evento.fin))}`,
      `SUMMARY:${escapar(evento.titulo)}`);
    if (evento.nota) lineas.push(`DESCRIPTION:${escapar(evento.nota)}`);
    if (evento.repeticion === 'indefinido') lineas.push(`RRULE:FREQ=WEEKLY;BYDAY=${CODIGOS_DIA[evento.dia]}`);
    lineas.push(...alarma(evento.aviso.antes, evento.titulo), 'END:VEVENT');
    cantidad += 1;
  }

  for (const nota of notas) {
    if (!nota.limite || !nota.aviso.activo) continue;
    const inicio = new Date(limiteEnMs(nota));
    lineas.push('BEGIN:VEVENT', `UID:nota-${nota.id}@horario`, `DTSTAMP:${sello}`,
      `DTSTART:${fechaLocal(inicio)}`, `DTEND:${fechaLocal(new Date(inicio.getTime() + 5 * 60000))}`,
      `SUMMARY:${escapar('Nota: ' + nota.titulo)}`);
    if (nota.texto) lineas.push(`DESCRIPTION:${escapar(nota.texto)}`);
    lineas.push(...alarma(nota.aviso.antes, nota.titulo), 'END:VEVENT');
    cantidad += 1;
  }

  if (!cantidad) return null;
  lineas.push('END:VCALENDAR');
  return lineas.map(plegar).join('\r\n') + '\r\n';
}

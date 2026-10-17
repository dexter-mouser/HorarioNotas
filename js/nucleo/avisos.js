// avisos.js — Próximos avisos y avisos perdidos (sin DOM)
import { soloFecha, sumarDias, fechaConHora } from './tiempo.js';
import { ocurreEn } from './nucleo.js';
import { limiteEnMs } from './notas.js';

export const MS_MINUTO = 60000;
export const MS_DIA = 86400000;

/** Momentos base (inicio del evento o límite de la nota) entre dos fechas. */
export function ocurrenciasBase(eventos, notas, desde, hasta) {
  const lista = [];
  for (let dia = soloFecha(desde); dia <= hasta; dia = sumarDias(dia, 1)) {
    for (const evento of eventos) {
      if (!ocurreEn(evento, dia)) continue;
      const base = fechaConHora(dia, evento.inicio).getTime();
      if (base >= desde.getTime() && base <= hasta.getTime()) {
        lista.push({ tipo: 'evento', id: evento.id, titulo: evento.titulo, base, item: evento });
      }
    }
  }
  for (const nota of notas) {
    if (!nota.limite) continue;
    const base = limiteEnMs(nota);
    if (base >= desde.getTime() && base <= hasta.getTime()) {
      lista.push({ tipo: 'nota', id: nota.id, titulo: nota.titulo, base, item: nota });
    }
  }
  return lista.sort((a, b) => a.base - b.base);
}

/** Avisos de los próximos 7 días (incluye los que se usaron alguna vez aunque estén apagados). */
export function proximosAvisos(eventos, notas, ahora = new Date()) {
  const hasta = new Date(ahora.getTime() + 7 * MS_DIA);
  return ocurrenciasBase(eventos, notas, ahora, hasta).filter((o) => o.item.aviso.activo || o.item.aviso.configurado);
}

/** Avisos activos de las últimas 24 h que aún no se mostraron. */
export function avisosPendientes(eventos, notas, ahora, mostrados) {
  const desde = new Date(ahora.getTime() - MS_DIA);
  const hasta = new Date(ahora.getTime() + 2 * MS_DIA);
  const pendientes = [];
  for (const o of ocurrenciasBase(eventos, notas, desde, hasta)) {
    if (!o.item.aviso.activo) continue;
    const momento = o.base - o.item.aviso.antes * MS_MINUTO;
    const clave = `${o.tipo}:${o.id}:${o.base}`;
    if (momento >= desde.getTime() && momento <= ahora.getTime() && !mostrados[clave]) {
      pendientes.push({ ...o, momento, clave });
    }
  }
  return pendientes.sort((a, b) => a.momento - b.momento);
}

/** Olvida los avisos mostrados hace más de tres días. */
export function purgarMostrados(mostrados, ahora) {
  const limite = ahora.getTime() - 3 * MS_DIA;
  return Object.fromEntries(Object.entries(mostrados).filter(([, marca]) => marca > limite));
}

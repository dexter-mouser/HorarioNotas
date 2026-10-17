// mes.js — Cuadrícula del mes e indicadores de cada día (sin DOM)
import { lunesDeSemana, sumarDias } from './tiempo.js';
import { eventosDelDia } from './nucleo.js';
import { notasDelDia, estadoNota } from './notas.js';

/** Todos los días que se ven en la cuadrícula (semanas completas, lunes primero). */
export function diasDelMes(fechaMes) {
  const primero = new Date(fechaMes.getFullYear(), fechaMes.getMonth(), 1);
  const ultimo = new Date(fechaMes.getFullYear(), fechaMes.getMonth() + 1, 0);
  const fin = sumarDias(lunesDeSemana(ultimo), 6);
  const dias = [];
  for (let dia = lunesDeSemana(primero); dia <= fin; dia = sumarDias(dia, 1)) dias.push(dia);
  return dias;
}

/** Primer día del mes que está `cantidad` meses antes o después. */
export function sumarMeses(fechaMes, cantidad) {
  return new Date(fechaMes.getFullYear(), fechaMes.getMonth() + cantidad, 1);
}

/** Cantidad de eventos y notas de un día, y si alguna nota está vencida. */
export function indicadoresDia(fecha, eventos, notas, ahora = new Date()) {
  const delDia = notasDelDia(notas, fecha);
  return {
    eventos: eventosDelDia(eventos, fecha).length,
    notas: delDia.length,
    hayVencida: delDia.some((n) => estadoNota(n, ahora).tipo === 'vencida'),
  };
}

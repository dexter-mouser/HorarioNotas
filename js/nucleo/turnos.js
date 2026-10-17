// turnos.js — Turnos y planes semanales (sin DOM)
import { aTexto, lunesDeSemana } from './tiempo.js';
import { ajustarHoras, avisoPorDefecto, crearId, FIN_DIA, PASO_MINUTOS } from './nucleo.js';

export const MAX_TURNOS = 12;
export const MAX_NOMBRE_TURNO = 30;

/** Convierte los datos de la hoja en un turno válido. */
export function normalizarTurno(datos) {
  const horas = ajustarHoras(datos.inicio, datos.fin, 'fin');
  return {
    id: datos.id || crearId(),
    nombre: String(datos.nombre || '').trim().slice(0, MAX_NOMBRE_TURNO) || 'Turno',
    inicio: horas.inicio,
    fin: horas.fin,
  };
}

/** Valida un turno leído del almacenamiento. */
export function validarTurno(obj) {
  if (!obj || typeof obj !== 'object' || typeof obj.id !== 'string' || !obj.id) return null;
  const { inicio, fin } = obj;
  if (!Number.isInteger(inicio) || !Number.isInteger(fin)) return null;
  if (inicio % PASO_MINUTOS || fin % PASO_MINUTOS || inicio < 0 || fin <= inicio || fin > FIN_DIA) return null;
  return { id: obj.id.slice(0, 40), nombre: String(obj.nombre ?? '').slice(0, MAX_NOMBRE_TURNO) || 'Turno', inicio, fin };
}

/**
 * Aplica un plan semanal. `asignaciones` tiene 7 posiciones (lunes a domingo)
 * con el id de un turno o null (Libre).
 * Reemplaza solo los eventos creados por planes anteriores del mismo tipo
 * (y de la misma semana si es "una-vez"); los manuales no se tocan.
 * Devuelve { eventos, diasFinDia } o { error }.
 */
export function planificarSemana({ eventos, turnos, asignaciones, tipo, lunes, ahora = new Date() }) {
  const semana = aTexto(lunes);
  if (tipo === 'una-vez' && semana < aTexto(lunesDeSemana(ahora))) return { error: 'semana-pasada' };

  const restantes = eventos.filter((e) => !(e.origen === 'plan' && e.repeticion === tipo && (tipo === 'indefinido' || e.semana === semana)));
  const nuevos = [];
  const diasFinDia = [];
  asignaciones.forEach((idTurno, dia) => {
    const turno = turnos.find((t) => t.id === idTurno);
    if (!turno) return;
    const evento = {
      id: crearId(), titulo: turno.nombre, dia, inicio: turno.inicio, fin: turno.fin,
      nota: '', repeticion: tipo, origen: 'plan', aviso: avisoPorDefecto(),
    };
    if (tipo === 'una-vez') evento.semana = semana;
    nuevos.push(evento);
    if (turno.fin === FIN_DIA) diasFinDia.push(dia);
  });
  return { eventos: [...restantes, ...nuevos], diasFinDia };
}

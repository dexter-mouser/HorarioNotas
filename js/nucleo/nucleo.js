// nucleo.js — Reglas de eventos, horas y repetición (sin DOM)
import { aTexto, deTexto, indiceDia, lunesDeSemana, sumarDias } from './tiempo.js';

export const MAX_TITULO = 60;
export const MAX_NOTA_EVENTO = 500;
export const PASO_MINUTOS = 5;
export const INICIO_MAXIMO = 1430; // 23:50
export const FIN_DIA = 1435;       // 23:55
export const ANTELACIONES_EVENTO = [0, 10, 30, 60];

let contador = 0;
/** Identificador único para eventos, notas y turnos. */
export function crearId() {
  contador += 1;
  return Date.now().toString(36) + contador.toString(36) + Math.random().toString(36).slice(2, 6);
}

export function avisoPorDefecto() {
  return { activo: false, antes: 0, configurado: false };
}

/** Normaliza un aviso: antelación permitida y marca "configurado". */
export function normalizarAviso(aviso, permitidas = ANTELACIONES_EVENTO) {
  const origen = aviso && typeof aviso === 'object' ? aviso : {};
  const activo = origen.activo === true;
  const antes = permitidas.includes(origen.antes) ? origen.antes : permitidas[0];
  return { activo, antes, configurado: activo || origen.configurado === true };
}

function aMultiplo(valor) {
  return Math.round(valor / PASO_MINUTOS) * PASO_MINUTOS;
}

function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

/**
 * Aplica las reglas de horas. `cambio` indica qué selector se movió:
 * si el inicio deja el fin igual o anterior, el fin pasa a 1 h después;
 * si el fin queda igual o anterior al inicio, pasa a 5 min después.
 */
export function ajustarHoras(inicio, fin, cambio = 'fin') {
  const nuevoInicio = limitar(aMultiplo(inicio), 0, INICIO_MAXIMO);
  let nuevoFin = limitar(aMultiplo(fin), PASO_MINUTOS, FIN_DIA);
  if (nuevoFin <= nuevoInicio) {
    nuevoFin = cambio === 'inicio' ? Math.min(nuevoInicio + 60, FIN_DIA) : nuevoInicio + PASO_MINUTOS;
  }
  return { inicio: nuevoInicio, fin: nuevoFin };
}

/**
 * Convierte los datos de la hoja en un evento válido.
 * Devuelve { evento } o { error: 'semana-pasada' }.
 * datos: { id, titulo, dia, repeticion, fecha (Date, solo "una-vez"), inicio, fin, nota, aviso, origen }
 */
export function normalizarEvento(datos, ahora = new Date()) {
  const horas = ajustarHoras(datos.inicio, datos.fin, 'fin');
  const evento = {
    id: datos.id || crearId(),
    titulo: String(datos.titulo || '').trim().slice(0, MAX_TITULO) || 'Sin título',
    dia: limitar(Math.trunc(datos.dia) || 0, 0, 6),
    inicio: horas.inicio,
    fin: horas.fin,
    nota: String(datos.nota || '').slice(0, MAX_NOTA_EVENTO),
    repeticion: datos.repeticion === 'una-vez' ? 'una-vez' : 'indefinido',
    aviso: normalizarAviso(datos.aviso),
  };
  if (evento.repeticion === 'una-vez') {
    const fecha = datos.fecha instanceof Date ? datos.fecha : new Date();
    evento.semana = aTexto(lunesDeSemana(fecha));
    evento.dia = indiceDia(fecha);
    if (evento.semana < aTexto(lunesDeSemana(ahora))) return { error: 'semana-pasada' };
  }
  if (datos.origen === 'plan') evento.origen = 'plan';
  return { evento };
}

/** Valida un evento leído del almacenamiento; devuelve el evento limpio o null. */
export function validarEvento(obj) {
  if (!obj || typeof obj !== 'object' || typeof obj.id !== 'string' || !obj.id) return null;
  const entero = (v) => Number.isInteger(v);
  if (!entero(obj.dia) || obj.dia < 0 || obj.dia > 6) return null;
  if (!entero(obj.inicio) || !entero(obj.fin)) return null;
  if (obj.inicio % PASO_MINUTOS || obj.fin % PASO_MINUTOS) return null;
  if (obj.inicio < 0 || obj.inicio > INICIO_MAXIMO || obj.fin <= obj.inicio || obj.fin > FIN_DIA) return null;
  const evento = {
    id: obj.id.slice(0, 40),
    titulo: String(obj.titulo ?? '').slice(0, MAX_TITULO) || 'Sin título',
    dia: obj.dia,
    inicio: obj.inicio,
    fin: obj.fin,
    nota: String(obj.nota ?? '').slice(0, MAX_NOTA_EVENTO),
    repeticion: obj.repeticion === 'una-vez' ? 'una-vez' : 'indefinido',
    aviso: normalizarAviso(obj.aviso),
  };
  if (evento.repeticion === 'una-vez') {
    if (!deTexto(obj.semana)) return null;
    evento.semana = obj.semana;
  }
  if (obj.origen === 'plan') evento.origen = 'plan';
  return evento;
}

/** Fecha concreta de un evento en la semana de `referencia`. */
export function fechaDeEvento(evento, referencia = new Date()) {
  const lunes = evento.repeticion === 'una-vez' ? deTexto(evento.semana) : lunesDeSemana(referencia);
  return sumarDias(lunes, evento.dia);
}

/** ¿El evento ocurre en esa fecha? */
export function ocurreEn(evento, fecha) {
  if (evento.dia !== indiceDia(fecha)) return false;
  return evento.repeticion === 'indefinido' || evento.semana === aTexto(lunesDeSemana(fecha));
}

/** Eventos de una fecha, de la hora más temprana a la más tardía. */
export function eventosDelDia(eventos, fecha) {
  return eventos.filter((e) => ocurreEn(e, fecha)).sort((a, b) => a.inicio - b.inicio || a.fin - b.fin);
}

/** "Ahora": inicio incluido, fin excluido. */
export function estaAhora(evento, minutos) {
  return evento.inicio <= minutos && minutos < evento.fin;
}

/** Elimina los eventos de una sola vez cuya semana ya terminó. */
export function limpiarCaducados(eventos, ahora = new Date()) {
  const lunesActual = aTexto(lunesDeSemana(ahora));
  return eventos.filter((e) => e.repeticion !== 'una-vez' || e.semana >= lunesActual);
}

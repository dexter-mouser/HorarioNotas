// almacenamiento.js — Única puerta de acceso a localStorage
// (fondo-inicial.js solo lee, para pintar sin parpadeo).
// Al leer, cada elemento se valida con las reglas del núcleo y lo dañado se descarta.
import { validarEvento } from '../nucleo/nucleo.js';
import { validarNota, MAX_NOTAS } from '../nucleo/notas.js';
import { validarTurno, MAX_TURNOS } from '../nucleo/turnos.js';

export const CLAVES = {
  eventos: 'horario:eventos',
  notas: 'horario:notas',
  turnos: 'horario:turnos',
  avisos: 'horario:avisos',
  fondo: 'horario:fondo',
  modo: 'horario:modo',
  acento: 'horario:acento',
  acentoVariables: 'horario:acento-vars',
  indicador: 'horario:indicador',
  semilla: 'horario:semilla',
};

/** Lee un texto; devuelve `porDefecto` si no existe o falla. */
export function leerTexto(clave, porDefecto = null) {
  try {
    const valor = localStorage.getItem(clave);
    return valor === null ? porDefecto : valor;
  } catch {
    return porDefecto;
  }
}

/** Borra una clave guardada. */
export function borrarClave(clave) {
  try {
    localStorage.removeItem(clave);
  } catch { /* sin almacenamiento */ }
}

/** Guarda un texto; devuelve false si no fue posible. */
export function guardarTexto(clave, valor) {
  try {
    localStorage.setItem(clave, valor);
    return true;
  } catch {
    return false;
  }
}

/** Lee un valor JSON; ante datos dañados devuelve `porDefecto`. */
export function leerJSON(clave, porDefecto = null) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}

/** Guarda un valor como JSON (una sola escritura). */
export function guardarJSON(clave, valor) {
  return guardarTexto(clave, JSON.stringify(valor));
}

/** Lee una lista y conserva solo los elementos válidos. */
function leerLista(clave, validar, maximo) {
  const lista = leerJSON(clave, []);
  if (!Array.isArray(lista)) return [];
  return lista.map(validar).filter(Boolean).slice(0, maximo);
}

export const cargarEventos = () => leerLista(CLAVES.eventos, validarEvento, 2000);
export const cargarNotas = () => leerLista(CLAVES.notas, validarNota, MAX_NOTAS);
export const cargarTurnos = () => leerLista(CLAVES.turnos, validarTurno, MAX_TURNOS);
export const guardarEventos = (lista) => guardarJSON(CLAVES.eventos, lista);
export const guardarNotas = (lista) => guardarJSON(CLAVES.notas, lista);
export const guardarTurnos = (lista) => guardarJSON(CLAVES.turnos, lista);

/** Avisos: interruptor general, última revisión y avisos ya mostrados. */
export function cargarAvisos() {
  const datos = leerJSON(CLAVES.avisos, {});
  const mostrados = {};
  if (datos && typeof datos.mostrados === 'object' && datos.mostrados) {
    for (const [clave, marca] of Object.entries(datos.mostrados)) {
      if (Number.isFinite(marca)) mostrados[String(clave).slice(0, 120)] = marca;
    }
  }
  return {
    general: !datos || datos.general !== false,
    ultimaRevision: Number.isFinite(datos?.ultimaRevision) ? datos.ultimaRevision : 0,
    mostrados,
  };
}
export const guardarAvisos = (avisos) => guardarJSON(CLAVES.avisos, avisos);

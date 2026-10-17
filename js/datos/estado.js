// estado.js — Estado de la app en memoria y guardado de cambios.
// Cada guardado avisa con el evento "datos:cambio" para redibujar la vista visible.
import {
  CLAVES, leerTexto, borrarClave,
  cargarEventos, cargarNotas, cargarTurnos, cargarAvisos,
  guardarEventos, guardarNotas, guardarTurnos, guardarAvisos,
} from './almacenamiento.js';
import { limpiarCaducados } from '../nucleo/nucleo.js';
import { aTexto, indiceDia, soloFecha } from '../nucleo/tiempo.js';

export const estado = {
  eventos: [],
  notas: [],
  turnos: [],
  avisos: { general: true, ultimaRevision: 0, mostrados: {} },
  pestana: 'hoy',
  fechaActual: soloFecha(new Date()), // para detectar el cambio de día
  diaVisto: 0,                        // día elegido en Hoy (0 = lunes)
  mes: new Date(),                    // primer día del mes visible en Calendario
  diaCalendario: soloFecha(new Date()),
};

function avisarCambio() {
  document.dispatchEvent(new CustomEvent('datos:cambio'));
}

function posicionarEnHoy(ahora) {
  estado.fechaActual = soloFecha(ahora);
  estado.diaVisto = indiceDia(ahora);
  estado.mes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  estado.diaCalendario = soloFecha(ahora);
}

/** Elimina los elementos de ejemplo ("Prueba N") que se guardaron antes. Se ejecuta una sola vez. */
function limpiarEjemplosGuardados() {
  if (leerTexto(CLAVES.semilla) === null) return;
  const esEjemplo = (titulo) => /^Prueba \d$/.test(titulo);
  estado.eventos = estado.eventos.filter((e) => !(esEjemplo(e.titulo) && e.nota === 'Prueba'));
  estado.notas = estado.notas.filter((n) => !(esEjemplo(n.titulo) && n.texto === 'Prueba'));
  estado.turnos = estado.turnos.filter((t) => !esEjemplo(t.nombre));
  borrarClave(CLAVES.semilla);
}

/** Carga los datos y descarta los eventos caducados. */
export function iniciarEstado() {
  const ahora = new Date();
  estado.eventos = limpiarCaducados(cargarEventos(), ahora);
  estado.notas = cargarNotas();
  estado.turnos = cargarTurnos();
  estado.avisos = cargarAvisos();

  limpiarEjemplosGuardados();
  guardarEventos(estado.eventos);
  guardarNotas(estado.notas);
  guardarTurnos(estado.turnos);
  posicionarEnHoy(ahora);
}

/** Si cambió el día: reposiciona las vistas y elimina eventos caducados. Devuelve true si cambió. */
export function refrescarFecha() {
  const ahora = new Date();
  if (aTexto(soloFecha(ahora)) === aTexto(estado.fechaActual)) return false;
  posicionarEnHoy(ahora);
  const vigentes = limpiarCaducados(estado.eventos, ahora);
  if (vigentes.length !== estado.eventos.length) guardarEventosEnEstado(vigentes);
  return true;
}

export function guardarEventosEnEstado(lista) {
  estado.eventos = lista;
  guardarEventos(lista);
  avisarCambio();
}

export function guardarNotasEnEstado(lista) {
  estado.notas = lista;
  guardarNotas(lista);
  avisarCambio();
}

export function guardarTurnosEnEstado(lista) {
  estado.turnos = lista;
  guardarTurnos(lista);
  avisarCambio();
}

export function guardarAvisosEnEstado() {
  guardarAvisos(estado.avisos);
}
